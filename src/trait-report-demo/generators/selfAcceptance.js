/**
 * Self-Acceptance trait reflection generator
 */

import selfAcceptanceEN from '../i18n/en/selfAcceptance.json'
import selfAcceptanceLT from '../i18n/lt/selfAcceptance.json'

const translations = {
    en: selfAcceptanceEN,
    lt: selfAcceptanceLT
}

/**
 * Generate self-acceptance reflection
 * 
 * @param {object} traitData
 * @param {string} locale - 'en' | 'lt'
 * @returns {object} { userReport: string, behavioralProfile: string }
 */
export function generateSelfAcceptanceReflection(traitData, locale = 'en') {
    const t = translations[locale]
    const {
        level,
        openness_to_change
    } = traitData

    const bank = t.levels[level]
    if (!bank) {
        throw new Error(`Unknown self-acceptance level: ${level}`)
    }

    // Build user reflection with proper paragraph breaks
    let userReport = bank.reflection

    // Add openness modifier as separate paragraph if exists
    if (openness_to_change && t.opennessModifiers && t.opennessModifiers[openness_to_change]) {
        const modifier = t.opennessModifiers[openness_to_change].modifier
        if (modifier) {
            userReport += '\n\n' + modifier
        }
    }

    // Behavioral profile ALWAYS from English only
    const enBank = translations.en.levels[level]
    let behavioralProfile = enBank.behavioralProfile

    // Add behavioral addition from English only
    if (openness_to_change && translations.en.opennessModifiers && translations.en.opennessModifiers[openness_to_change]) {
        const behavioralAddition = translations.en.opennessModifiers[openness_to_change].behavioralAddition
        if (behavioralAddition) {
            behavioralProfile += ' ' + behavioralAddition
        }
    }

    return {
        userReport,
        behavioralProfile
    }
}