/**
 * Middleware for Withinly i18n routing
 * Handles language detection and routing without breaking existing functionality
 */

import {
    defineMiddleware
} from 'astro:middleware'
import {
    getLanguageFromUrl,
    DEFAULT_LANGUAGE,
    getLocalizedPath
} from './utils/i18n.js'

export const onRequest = defineMiddleware(async (context, next) => {
    const {
        url,
        redirect
    } = context
    const pathname = url.pathname

    // Skip middleware for API routes and static assets
    if (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_astro/') ||
        pathname.includes('.') // Skip files with extensions (images, etc.)
    ) {
        return next()
    }

    // Get current language from URL
    const currentLang = getLanguageFromUrl(pathname)

    // Handle root path redirect to include language prefix if needed
    if (pathname === '/') {
        // Check for stored language preference
        const userAgent = context.request.headers.get('user-agent') || ''
        const acceptLanguage = context.request.headers.get('accept-language') || ''

        // Simple browser language detection
        let preferredLang = DEFAULT_LANGUAGE
        if (acceptLanguage.includes('lt')) {
            preferredLang = 'lt'
        }

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