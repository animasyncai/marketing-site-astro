/**
 * Translation utilities and hooks for Astro components
 * Provides accessible, fallback-enabled translation functionality
 */

import {
    getLanguageFromUrl,
    DEFAULT_LANGUAGE
} from './i18n.js'

// Import translations statically to avoid dynamic import issues
import enTranslations from '../data/translations/en.json'
import ltTranslations from '../data/translations/lt.json'

// Static translation map
const translations = {
    en: enTranslations,
    lt: ltTranslations
}

/**
 * Load translations for a specific language
 * @param {string} language - Language code to load
 * @returns {Promise<Object>} Translation object
 */
export async function loadTranslations(language) {
    try {
        if (translations[language]) {
            return translations[language]
        }

        // Fallback to default language
        if (language !== DEFAULT_LANGUAGE && translations[DEFAULT_LANGUAGE]) {
            return translations[DEFAULT_LANGUAGE]
        }

        // Return empty object as last resort
        return {}
    } catch (error) {
        console.warn(`Failed to load translations for language: ${language}`, error)
        return translations[DEFAULT_LANGUAGE] || {}
    }
}

/**
 * Get translation by nested key path with fallback support
 * @param {Object} translationObj - Translation object
 * @param {string} keyPath - Dot-notation key path (e.g., 'hero.headline')
 * @param {Object} variables - Variables to interpolate in translation
 * @param {string} fallback - Fallback text if translation missing
 * @returns {string} Translated text
 */
export function getTranslation(translationObj, keyPath, variables = {}, fallback = '') {
    try {
        // Navigate through nested object using dot notation
        const keys = keyPath.split('.')
        let current = translationObj

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key]
            } else {
                // Key not found, return fallback or key path for development
                return fallback || (
                    import.meta.env.DEV ? `[${keyPath}]` : keyPath)
            }
        }

        // If we found a string, interpolate variables
        if (typeof current === 'string') {
            return interpolateVariables(current, variables)
        }

        // If we found an array, join with spaces (useful for lists)
        if (Array.isArray(current)) {
            return current.map(item =>
                typeof item === 'string' ? interpolateVariables(item, variables) : item
            ).join(' ')
        }

        // Return fallback for non-string values
        return fallback || (
            import.meta.env.DEV ? `[${keyPath}]` : keyPath)

    } catch (error) {
        console.warn(`Translation error for key: ${keyPath}`, error)
        return fallback || keyPath
    }
}

/**
 * Interpolate variables in translation strings
 * Supports {{variable}} syntax
 * @param {string} text - Text with variable placeholders
 * @param {Object} variables - Variables to interpolate
 * @returns {string} Text with variables replaced
 */
function interpolateVariables(text, variables) {
    if (!variables || typeof variables !== 'object') {
        return text
    }

    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return variables[key] !== undefined ? variables[key] : match
    })
}

/**
 * Create translation function for specific language
 * @param {string} language - Language code
 * @returns {Promise<Function>} Translation function
 */
export async function createTranslationFunction(language) {
    const translationObj = await loadTranslations(language)

    return function t(keyPath, variables, fallback) {
        return getTranslation(translationObj, keyPath, variables, fallback)
    }
}

/**
 * Create translation function from URL (for Astro pages)
 * @param {string} pathname - Current page pathname
 * @returns {Promise<Function>} Translation function
 */
export async function createTranslationFromUrl(pathname) {
    const language = getLanguageFromUrl(pathname)
    return createTranslationFunction(language)
}

/**
 * Get translations object for specific language
 * @param {string} language - Language code
 * @returns {Promise<Object>} Full translations object
 */
export async function getTranslations(language) {
    return loadTranslations(language)
}

/**
 * Get translations object from URL (for Astro pages)
 * @param {string} pathname - Current page pathname
 * @returns {Promise<Object>} Full translations object
 */
export async function getTranslationsFromUrl(pathname) {
    const language = getLanguageFromUrl(pathname)
    return getTranslations(language)
}

/**
 * Check if translation exists for given key
 * @param {Object} translationObj - Translation object
 * @param {string} keyPath - Dot-notation key path
 * @returns {boolean} Whether translation exists
 */
export function hasTranslation(translationObj, keyPath) {
    try {
        const keys = keyPath.split('.')
        let current = translationObj

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key]
            } else {
                return false
            }
        }

        return typeof current === 'string' || Array.isArray(current)
    } catch {
        return false
    }
}