/**
 * Attachment trait reflection generator
 */

import attachmentEN from '../i18n/en/attachment.json'
import attachmentLT from '../i18n/lt/attachment.json'

const translations = {
    en: attachmentEN,
    lt: attachmentLT
}

/**
 * Generate attachment reflection
 * 
 * @param {object} traitData
 * @param {string} locale - 'en' | 'lt'
 * @returns {object} { userReport: string, behavioralProfile: string }
 */
export function generateAttachmentReflection(traitData, locale = 'en') {
    const t = translations[locale]
    const {
        primary,
        primaryIntensity,
        secondary,
        secondaryIntensity
    } = traitData

    const bank = t.types[primary]
    if (!bank) {
        throw new Error(`Unknown attachment type: ${primary}`)
    }

    const tone = t.toneModifiers[primaryIntensity]
    if (!tone) {
        throw new Error(`Unknown intensity: ${primaryIntensity}`)
    }

    // Build user reflection
    let userReport = bank.reflection
        .replace('[tone:frequency]', tone.frequency)
        .replace('[tone:likelihood]', tone.likelihood)

    // Add secondary bridge if exists
    if (secondary && bank.secondaryBridge && bank.secondaryBridge[secondary]) {
        userReport += ' ' + bank.secondaryBridge[secondary]
    }

    // Generate behavioral profile (always from English data)
    const behavioralProfile = generateBehavioralProfile(
        translations.en, // Always use English for behavioral profiles
        primary,
        primaryIntensity,
        secondary,
        secondaryIntensity
    )

    return {
        userReport,
        behavioralProfile
    }
}

function generateBehavioralProfile(t, primary, primaryIntensity, secondary, secondaryIntensity) {
    const primaryProfile = t.types[primary].behavioralProfiles[primaryIntensity]

    if (!secondary) {
        return primaryProfile
    }

    const combinationKey = `${primary}_${primaryIntensity}_${secondary}_${secondaryIntensity}`
    if (t.combinationProfiles[combinationKey]) {
        return t.combinationProfiles[combinationKey]
    }

    // Systematic generation
    const typeKey = `${primary}_${secondary}`
    const intensityKey = `${primaryIntensity}_${secondaryIntensity}`

    const combinationDescription = t.systematicCombinations.typeDescriptions[typeKey] ||
        'complex interaction between different attachment needs'

    const intensityNote = t.systematicCombinations.intensityModifiers[intensityKey] ||
        'Creates some relationship complexity.'

    const primaryBase = primaryProfile.split('.')[0]

    return `${primaryBase}. Secondary ${secondary.toLowerCase()} patterns create ${combinationDescription}. ${intensityNote}`
}