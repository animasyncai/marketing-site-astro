import { SIGNUP_ALLOWED_ORIGINS } from 'astro:env/server'

// Only the site's own pages may POST. SIGNUP_ALLOWED_ORIGINS is a required, comma-separated list of exact origins
// (e.g. `https://withinly.app,https://www.withinly.app`). The request's own URL cannot stand in for it: behind Vercel,
// Astro builds `request.url` on localhost. An empty list fails closed.
const ALLOWED_ORIGINS = new Set(
  SIGNUP_ALLOWED_ORIGINS.split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean),
)
if (ALLOWED_ORIGINS.size === 0) {
  console.error('[origin] SIGNUP_ALLOWED_ORIGINS is empty: every POST is refused with 403')
}

// The request's Origin when it is one of ours, else null (a missing Origin is refused too).
export function allowedOriginOf(request: Request): string | null {
  const origin = request.headers.get('origin')
  return origin !== null && ALLOWED_ORIGINS.has(origin) ? origin : null
}
