/**
 * Love Language trait reflection generator
 */

import loveLanguageEN from '../i18n/en/loveLanguage.json'
import loveLanguageLT from '../i18n/lt/loveLanguage.json'

const translations = {
    en: loveLanguageEN,
    lt: loveLanguageLT
}

/**
 * Generate love language reflection
 * 
 * @param {object} traitData
 * @param {string} locale - 'en' | 'lt'
 * @returns {object} { userReport: string, behavioralProfile: string }
 */
export function generateLoveLanguageReflection(traitData, locale = 'en') {
    const t = translations[locale]
    const {
        primary,
        secondary,
        distribution,
        expressionArchetype
    } = traitData

    const bank = t.loveLanguages[primary]
    if (!bank) {
        throw new Error(`Unknown love language: ${primary}`)
    }

    // Build user reflection
    let userReport = bank.reflection

    // Add secondary bridge if exists
    if (secondary && bank.secondaryBridge && bank.secondaryBridge[secondary]) {
        userReport += ' ' + bank.secondaryBridge[secondary]
    }

    // Generate behavioral profile (always from English data)
    const behavioralProfile = generateBehavioralProfile(
        translations.en, // Always use English
        primary,
        secondary,
        distribution,
        expressionArchetype
    )

    return {
        userReport,
        behavioralProfile
    }
}

function generateBehavioralProfile(t, primary, secondary, distribution, archetype) {
    // Check for combination profile
    if (secondary && distribution) {
        const combinationKey = `${primary}_${secondary}_${distribution}`
        if (t.combinationProfiles && t.combinationProfiles[combinationKey]) {
            return t.combinationProfiles[combinationKey]
        }
    }

    // Build from components
    let profile = t.loveLanguages[primary].behavioralProfile || `Primary love language: ${primary}`

    if (secondary) {
        const bridge = t.loveLanguages[primary].secondaryBridge && t.loveLanguages[primary].secondaryBridge[secondary]
        if (bridge) {
            profile += ` ${bridge}`
        }
    }

    if (distribution) {
        const distProfile = t.distributionPatterns && t.distributionPatterns[distribution] && t.distributionPatterns[distribution].behavioralProfile
        if (distProfile) {
            profile += ` ${distProfile}`
        }
    }

    if (archetype) {
        const archetypeProfile = t.expressionArchetypes && t.expressionArchetypes[archetype] && t.expressionArchetypes[archetype].behavioralProfile
        if (archetypeProfile) {
            profile += ` Expression style: ${archetypeProfile}`
        }
    }

    return profile
}