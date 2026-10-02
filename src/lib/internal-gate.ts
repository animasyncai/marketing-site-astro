import crypto from 'node:crypto'
import type { AstroCookies, AstroGlobal } from 'astro'
import { GATE_COOKIE_SECRET, GATE_PASSWORD } from 'astro:env/server'
import { allowedOriginOf } from './origin'

// Password gate for the internal pages (/demo-report, /prompt-library, /prompt-library-editor).
// Each gated page and endpoint calls it itself, so no URL spelling can route around it. The cookie is
// `<expiry>.<HMAC(GATE_COOKIE_SECRET, expiry + SHA-256(GATE_PASSWORD))>`: changing either secret revokes every cookie.

export const GATE_COOKIE = 'internal_auth'
const TTL_SECONDS = 12 * 60 * 60
export const PRIVATE_HEADERS = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' }

const sha256 = (value: string): Buffer => crypto.createHash('sha256').update(value).digest()
const nowSeconds = (): number => Math.floor(Date.now() / 1000)
const signature = (expiry: number): string =>
  crypto
    .createHmac('sha256', GATE_COOKIE_SECRET)
    .update(`gate:v1|${expiry}|${sha256(GATE_PASSWORD).toString('hex')}`)
    .digest('hex')

export function hasValidGateCookie(cookies: AstroCookies): boolean {
  const match = /^(\d{1,12})\.([0-9a-f]{64})$/.exec(cookies.get(GATE_COOKIE)?.value ?? '')
  if (!match) return false
  const expiry = Number(match[1])
  const remaining = expiry - nowSeconds()
  if (remaining <= 0 || remaining > TTL_SECONDS) return false
  return crypto.timingSafeEqual(Buffer.from(signature(expiry), 'hex'), Buffer.from(match[2], 'hex'))
}

// Best-effort per instance, like the sign-up limiter: slows guessing, is not a hard cap.
const attempts = new Map<string, { count: number; resetTime: number }>()
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 10

function allowAttempt(ip: string): boolean {
  const now = Date.now()
  for (const [key, entry] of attempts) if (now > entry.resetTime) attempts.delete(key)
  const entry = attempts.get(ip)
  if (!entry) {
    attempts.set(ip, { count: 1, resetTime: now + ATTEMPT_WINDOW_MS })
    return true
  }
  entry.count++
  return entry.count <= MAX_ATTEMPTS
}

function loginPage(path: string, status: number, message = ''): Response {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Password required</title>
  <link rel="icon" href="/favicon.svg" />
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background:#f8fafc; margin:0; }
    .card { max-width: 380px; margin: 12vh auto; background:#fff; border-radius: 12px; box-shadow: 0 10px 25px rgba(2,6,23,0.08); padding: 24px; }
    h1 { font-size: 18px; margin: 0 0 12px; color:#0f172a; }
    p { font-size: 14px; color:#475569; margin:0 0 16px; }
    .error { color:#b91c1c; }
    label { display:block; font-size:14px; color:#0f172a; margin-bottom:6px; }
    input[type="password"] { box-sizing:border-box; width:100%; padding:10px 12px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; }
    button { width:100%; margin-top:14px; padding:10px 12px; background:#2563eb; color:#fff; border:none; border-radius:8px; font-weight:600; cursor:pointer; }
    button:hover { background:#1d4ed8; }
  </style>
</head>
<body>
  <main class="card">
    <h1>Password required</h1>
    <p>Enter the password to view this page.</p>
    ${message ? `<p class="error" role="alert">${message}</p>` : ''}
    <form method="post" action="${path}">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" autocomplete="current-password" required />
      <button type="submit">Continue</button>
    </form>
  </main>
</body>
</html>`
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', ...PRIVATE_HEADERS } })
}

// `path` is the page's own constant path: the login form posts to it and success redirects to it, never to a value
// taken from the request.
async function handleLogin(Astro: AstroGlobal, path: string): Promise<Response> {
  const origin = allowedOriginOf(Astro.request)
  if (origin === null) {
    return new Response('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain', ...PRIVATE_HEADERS } })
  }
  if (!allowAttempt(Astro.clientAddress)) return loginPage(path, 429, 'Too many attempts. Try again later.')

  let submitted = ''
  try {
    const value = (await Astro.request.formData()).get('password')
    if (typeof value === 'string') submitted = value
  } catch {
    // not a form body: treated as a wrong password
  }
  if (!crypto.timingSafeEqual(sha256(submitted), sha256(GATE_PASSWORD))) {
    return loginPage(path, 401, 'Wrong password.')
  }

  const expiry = nowSeconds() + TTL_SECONDS
  const secure = origin.startsWith('https:') ? '; Secure' : ''
  return new Response(null, {
    status: 303,
    headers: {
      Location: path,
      'Set-Cookie': `${GATE_COOKIE}=${expiry}.${signature(expiry)}; Path=/; Max-Age=${TTL_SECONDS}; HttpOnly; SameSite=Strict${secure}`,
      ...PRIVATE_HEADERS,
    },
  })
}

// First statement of every gated page: `const denied = await guard(Astro, '/demo-report'); if (denied) return denied`.
export async function guard(Astro: AstroGlobal, path: string): Promise<Response | null> {
  if (Astro.request.method === 'POST') return handleLogin(Astro, path)
  if (!hasValidGateCookie(Astro.cookies)) return loginPage(path, 401)
  for (const [name, value] of Object.entries(PRIVATE_HEADERS)) Astro.response.headers.set(name, value)
  return null
}
