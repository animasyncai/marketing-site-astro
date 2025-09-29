/**
 * Main API for generating trait reflections
 */

import {
    generateAttachmentReflection
} from './generators/attachment.js'
import {
    generateLoveLanguageReflection
} from './generators/loveLanguage.js'
import {
    generateMindfulnessReflection
} from './generators/mindfulness.js'
import {
    generateSelfAcceptanceReflection
} from './generators/selfAcceptance.js'

const generators = {
    attachment: generateAttachmentReflection,
    loveLanguage: generateLoveLanguageReflection,
    mindfulness: generateMindfulnessReflection,
    selfAcceptance: generateSelfAcceptanceReflection
}

/**
 * Generate trait reflection and behavioral profile
 * 
 * @param {string} traitType - 'attachment' | 'loveLanguage' | 'mindfulness' | 'selfAcceptance'
 * @param {object} traitData - Trait-specific data structure
 * @param {string} locale - 'en' | 'lt'
 * @returns {object} { userReport: string, behavioralProfile: string }
 */
export function generateTraitReflection(traitType, traitData, locale = 'en') {
    const generator = generators[traitType]

    if (!generator) {
        throw new Error(`Unknown trait type: ${traitType}`)
    }

    if (!['en', 'lt'].includes(locale)) {
        throw new Error(`Unsupported locale: ${locale}`)
    }

    return generator(traitData, locale)
}

export {
    generateAttachmentReflection,
    generateLoveLanguageReflection,
    generateMindfulnessReflection,
    generateSelfAcceptanceReflection
}