/**
 * Middleware for Withinly i18n routing
 * Handles language detection and routing without breaking existing functionality
 */

import { defineMiddleware } from 'astro:middleware'
import { DEFAULT_LANGUAGE, getLocalizedPath } from './utils/i18n.js'

// One site-wide policy for every response the function serves (static files get theirs from vercel.json).
// Fathom and Google Fonts are third-party code in our origin by design; see SECURITY.md.
const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' https://cdn.usefathom.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://cdn.usefathom.com",
    "connect-src 'self' https://cdn.usefathom.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}

function withSecurityHeaders(response) {
  let target = response
  try {
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) target.headers.set(name, value)
  } catch {
    // Some responses (e.g. Response.redirect) have immutable headers: copy, then set.
    target = new Response(response.body, response)
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) target.headers.set(name, value)
  }
  return target
}

export const onRequest = defineMiddleware(async (context, next) => withSecurityHeaders(await route(context, next)))

async function route(context, next) {
  const { url, redirect } = context
  const pathname = url.pathname

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
}
