/**
 * Middleware for Withinly i18n routing
 * Handles language detection and routing without breaking existing functionality
 */

import {
    defineMiddleware
} from 'astro:middleware'
import {
    DEFAULT_LANGUAGE,
    getLocalizedPath
} from './utils/i18n.js'

export const onRequest = defineMiddleware(async (context, next) => {
    const {
        url,
        redirect
    } = context
    const pathname = url.pathname

    // Simple password protection for demo report
    // Protects /demo-report (and localized paths that end with it)
    if (pathname.endsWith('/demo-report')) {
        const rawCookie = context.cookies.get('demo_report_auth')
        const authCookie = typeof rawCookie === 'string' ? rawCookie : (rawCookie && rawCookie.value)
        if (authCookie === '1') {
            return next()
        }

        const currentUrl = new URL(context.request.url)
        const providedPassword = currentUrl.searchParams.get('password')
        if (providedPassword === 'secret') {
            // Set a lightweight auth cookie and redirect to clean URL
            context.cookies.set('demo_report_auth', '1', {
                path: '/',
                httpOnly: true,
                sameSite: 'Lax',
                secure: url.protocol === 'https:'
            })
            currentUrl.searchParams.delete('password')
            return redirect(currentUrl.pathname + (currentUrl.search ? `?${currentUrl.searchParams.toString()}` : ''), 302)
        }

        const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Protected</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background:#f8fafc; margin:0; padding:0; }
    .card { max-width: 380px; margin: 12vh auto; background:#fff; border-radius: 12px; box-shadow: 0 10px 25px rgba(2,6,23,0.08); padding: 24px; }
    h1 { font-size: 18px; margin: 0 0 12px; color:#0f172a; }
    p { font-size: 14px; color:#475569; margin:0 0 16px; }
    input[type="password"] { width:100%; padding:10px 12px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; }
    button { width:100%; margin-top:14px; padding:10px 12px; background:#2563eb; color:#fff; border:none; border-radius:8px; font-weight:600; cursor:pointer; }
    button:hover { background:#1d4ed8; }
  </style>
  <meta name="robots" content="noindex, nofollow" />
  <meta http-equiv="Cache-Control" content="no-store" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <link rel="icon" href="/favicon.svg" />
  <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/ibm-plex-mono-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/ibm-plex-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/mona-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/raleway.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/source-serif-4-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/space-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/zilla-slab-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/zilla-slab-latin-italic.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/work-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/work-sans-latin-italic.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/biorhyme.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/merriweather.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/roboto.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/source-code-pro.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/source-serif-4-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/source-serif-4-cyrillic-italic.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/source-serif-4-greek.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/source-serif-4-greek-italic.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/source-serif-4-latin-italic.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/source-serif-4-vietnamese.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/source-serif-4-vietnamese-italic.woff2" as="font" type="font/woff2" crossorigin>
</head>
<body>
  <div class="card">
    <h1>Password required</h1>
    <p>Enter the password to view this page.</p>
    <form method="GET" action="${currentUrl.pathname}">
      <input type="password" name="password" placeholder="Password" autocomplete="current-password" />
      <button type="submit">Continue</button>
    </form>
  </div>
</body>
</html>`

        return new Response(html, {
            status: 401,
            headers: {
                'content-type': 'text/html; charset=utf-8',
                'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
        })
    }

    // Skip middleware for API routes and static assets
    if (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_astro/') ||
        pathname.includes('.') // Skip files with extensions (images, etc.)
    ) {
        return next()
    }

    // Handle root path redirect to include language prefix if needed
    if (pathname === '/') {
        // For now, keep English as default for root
        // In production, you might want to redirect based on browser language
        return next()
    }

    // Validate that the language is supported
    const supportedLangs = ['en', 'lt']
    if (pathname.startsWith('/lt/') || pathname.startsWith('/en/')) {
        const lang = pathname.split('/')[1]
        if (!supportedLangs.includes(lang)) {
            // Redirect to default language
            const newPath = getLocalizedPath(pathname.replace(`/${lang}`, ''), DEFAULT_LANGUAGE)
            return redirect(newPath, 301)
        }
    }

    // Continue with the request
    return next()
})