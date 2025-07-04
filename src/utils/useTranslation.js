/**
 * Translation utilities and hooks for Astro components
 * Provides accessible, fallback-enabled translation functionality
 */

import {
    getLanguageFromUrl,
    DEFAULT_LANGUAGE
} from './i18n.js'

// Cache for loaded translations to avoid repeated fetches
const translationCache = new Map()

/**
 * Load translations for a specific language
 * @param {string} language - Language code to load
 * @returns {Promise<Object>} Translation object
 */
export async function loadTranslations(language) {
    // Check cache first
    if (translationCache.has(language)) {
        return translationCache.get(language)
    }

    try {
        // Dynamic import of translation files
        const translations = await import(`../data/translations/${language}.json`)
        const translationData = translations.default || translations

        // Cache the loaded translations
        translationCache.set(language, translationData)
        return translationData
    } catch (error) {
        console.warn(`Failed to load translations for language: ${language}`, error)

        // Fallback to default language if not already trying it
        if (language !== DEFAULT_LANGUAGE) {
            return loadTranslations(DEFAULT_LANGUAGE)
        }

        // Return empty object as last resort
        return {}
    }
}

/**
 * Get translation by nested key path with fallback support
 * @param {Object} translations - Translation object
 * @param {string} keyPath - Dot-notation key path (e.g., 'hero.headline')
 * @param {Object} variables - Variables to interpolate in translation
 * @param {string} fallback - Fallback text if translation missing
 * @returns {string} Translated text
 */
export function getTranslation(translations, keyPath, variables = {}, fallback = '') {
    try {
        // Navigate through nested object using dot notation
        const keys = keyPath.split('.')
        let current = translations

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key]
            } else {
                // Key not found, return fallback or key path for development
                return fallback || (process.env.NODE_ENV === 'development' ? `[${keyPath}]` : keyPath)
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
        return fallback || (process.env.NODE_ENV === 'development' ? `[${keyPath}]` : keyPath)

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
    const translations = await loadTranslations(language)

    return function t(keyPath, variables, fallback) {
        return getTranslation(translations, keyPath, variables, fallback)
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
 * @param {Object} translations - Translation object
 * @param {string} keyPath - Dot-notation key path
 * @returns {boolean} Whether translation exists
 */
export function hasTranslation(translations, keyPath) {
    try {
        const keys = keyPath.split('.')
        let current = translations

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

/**
 * Get all available translation keys (useful for debugging)
 * @param {Object} translations - Translation object
 * @param {string} prefix - Key prefix for nested objects
 * @returns {Array<string>} Array of all available keys
 */
export function getAvailableKeys(translations, prefix = '') {
    const keys = []

    function traverse(obj, currentPrefix) {
        for (const [key, value] of Object.entries(obj)) {
            const fullKey = currentPrefix ? `${currentPrefix}.${key}` : key

            if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                traverse(value, fullKey)
            } else {
                keys.push(fullKey)
            }
        }
    }

    traverse(translations, prefix)
    return keys
}

/**
 * Validate translations object structure
 * Useful for ensuring translation files are properly formatted
 * @param {Object} translations - Translation object to validate
 * @returns {Object} Validation result with errors
 */
export function validateTranslations(translations) {
    const errors = []
    const warnings = []

    if (!translations || typeof translations !== 'object') {
        errors.push('Translations must be an object')
        return {
            valid: false,
            errors,
            warnings
        }
    }

    // Check for required top-level sections
    const requiredSections = ['meta', 'navigation', 'hero', 'footer']
    for (const section of requiredSections) {
        if (!(section in translations)) {
            warnings.push(`Missing recommended section: ${section}`)
        }
    }

    // Check for empty strings
    function checkEmpty(obj, path = '') {
        for (const [key, value] of Object.entries(obj)) {
            const fullPath = path ? `${path}.${key}` : key

            if (typeof value === 'string' && value.trim() === '') {
                warnings.push(`Empty translation at: ${fullPath}`)
            } else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                checkEmpty(value, fullPath)
            }
        }
    }

    checkEmpty(translations)

    return {
        valid: errors.length === 0,
        errors,
        warnings
    }
}

/**
 * Merge translations (useful for extending base translations)
 * @param {Object} base - Base translation object
 * @param {Object} override - Override translation object
 * @returns {Object} Merged translations
 */
export function mergeTranslations(base, override) {
    const result = {
        ...base
    }

    for (const [key, value] of Object.entries(override)) {
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            result[key] = mergeTranslations(result[key] || {}, value)
        } else {
            result[key] = value
        }
    }

    return result
}