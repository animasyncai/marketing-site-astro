/**
 * Internationalization utilities for Withinly
 * Maintains accessibility while providing multilingual support
 */

// Supported languages
export const SUPPORTED_LANGUAGES = {
    en: {
        code: 'en',
        name: 'English',
        dir: 'ltr',
        locale: 'en-US'
    },
    lt: {
        code: 'lt',
        name: 'Lietuvių',
        dir: 'ltr',
        locale: 'lt-LT'
    }
}

export const DEFAULT_LANGUAGE = 'en'

/**
 * Get language from URL path
 * @param {string} pathname - Current pathname
 * @returns {string} Language code
 */
export function getLanguageFromUrl(pathname) {
    const segments = pathname.split('/').filter(Boolean)
    const firstSegment = segments[0]

    if (firstSegment && SUPPORTED_LANGUAGES[firstSegment]) {
        return firstSegment
    }

    return DEFAULT_LANGUAGE
}

/**
 * Get localized path for a given path and language
 * @param {string} path - The path to localize
 * @param {string} language - Target language code
 * @returns {string} Localized path
 */
export function getLocalizedPath(path, language) {
    // Remove existing language prefix if present
    const cleanPath = path.replace(/^\/(en|lt)(?=\/|$)/, '') || '/'

    if (language === DEFAULT_LANGUAGE) {
        return cleanPath
    }

    return `/${language}${cleanPath === '/' ? '' : cleanPath}`
}

/**
 * Get alternate language URLs for hreflang tags
 * @param {string} currentPath - Current page path
 * @returns {Array} Array of alternate language objects
 */
export function getAlternateLanguages(currentPath) {
    const cleanPath = currentPath.replace(/^\/(en|lt)(?=\/|$)/, '') || '/'

    return Object.values(SUPPORTED_LANGUAGES).map(lang => ({
        code: lang.code,
        locale: lang.locale,
        url: getLocalizedPath(cleanPath, lang.code)
    }))
}

/**
 * Persist language preference
 * @param {string} language - Language code to persist
 */
export function persistLanguage(language) {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('withinly-language', language)
    }
}

/**
 * Get persisted language preference
 * @returns {string} Persisted language or default
 */
export function getPersistedLanguage() {
    if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('withinly-language')
        if (stored && SUPPORTED_LANGUAGES[stored]) {
            return stored
        }
    }
    return DEFAULT_LANGUAGE
}

/**
 * Detect browser language preference
 * @returns {string} Detected language or default
 */
export function detectBrowserLanguage() {
    if (typeof navigator !== 'undefined') {
        const browserLang = navigator.language || navigator.languages ?.[0]

        if (browserLang) {
            // Check for exact match first
            const exactMatch = Object.keys(SUPPORTED_LANGUAGES).find(
                lang => browserLang.toLowerCase() === SUPPORTED_LANGUAGES[lang].locale.toLowerCase()
            )

            if (exactMatch) return exactMatch

            // Check for language code match (e.g., 'en' from 'en-GB')
            const langCode = browserLang.split('-')[0].toLowerCase()
            if (SUPPORTED_LANGUAGES[langCode]) {
                return langCode
            }
        }
    }

    return DEFAULT_LANGUAGE
}

/**
 * Get the best language based on URL, stored preference, and browser
 * @param {string} pathname - Current pathname
 * @returns {string} Best matching language code
 */
export function getBestLanguage(pathname) {
    // First priority: URL-specified language
    const urlLang = getLanguageFromUrl(pathname)
    if (urlLang !== DEFAULT_LANGUAGE) {
        return urlLang
    }

    // Second priority: Stored preference
    const storedLang = getPersistedLanguage()
    if (storedLang !== DEFAULT_LANGUAGE) {
        return storedLang
    }

    // Third priority: Browser language
    return detectBrowserLanguage()
}

/**
 * Generate hreflang tags for SEO
 * @param {string} currentPath - Current page path
 * @param {string} baseUrl - Site base URL
 * @returns {Array} Array of hreflang link objects
 */
export function generateHreflangTags(currentPath, baseUrl) {
    const alternates = getAlternateLanguages(currentPath)
    const tags = []

    // Add alternate language tags
    alternates.forEach(alt => {
        tags.push({
            rel: 'alternate',
            hreflang: alt.locale,
            href: `${baseUrl}${alt.url}`
        })
    })

    // Add x-default for English
    tags.push({
        rel: 'alternate',
        hreflang: 'x-default',
        href: `${baseUrl}${getLocalizedPath(currentPath, DEFAULT_LANGUAGE)}`
    })

    return tags
}

/**
 * Check if language switch would change current page
 * @param {string} currentPath - Current page path
 * @param {string} targetLanguage - Target language to switch to
 * @returns {boolean} Whether the page would change
 */
export function wouldLanguageSwitchChangePage(currentPath, targetLanguage) {
    const currentLang = getLanguageFromUrl(currentPath)
    return currentLang !== targetLanguage
}