/**
 * Mindfulness trait reflection generator
 */

import mindfulnessEN from '../i18n/en/mindfulness.json'
import mindfulnessLT from '../i18n/lt/mindfulness.json'

const translations = {
    en: mindfulnessEN,
    lt: mindfulnessLT
}

/**
 * Generate mindfulness reflection
 * 
 * @param {object} traitData
 * @param {string} locale - 'en' | 'lt'
 * @returns {object} { userReport: string, behavioralProfile: string }
 */
export function generateMindfulnessReflection(traitData, locale = 'en') {
    const t = translations[locale]
    const {
        mindfulnessLevel,
        awarenessLevel
    } = traitData

    const combinationKey = `${mindfulnessLevel}_${awarenessLevel}`
    const combinationBank = t.combinations[combinationKey]

    let userReport
    let behavioralProfile

    if (combinationBank) {
        userReport = combinationBank.reflection
        // Behavioral profile always from English
        behavioralProfile = translations.en.combinations[combinationKey].behavioralProfile
    } else {
        const mindfulnessBank = t.dimensions.mindfulness[mindfulnessLevel]
        const awarenessBank = t.dimensions.awareness[awarenessLevel]

        if (!mindfulnessBank || !awarenessBank) {
            throw new Error(`Unknown mindfulness/awareness level: ${mindfulnessLevel}/${awarenessLevel}`)
        }

        userReport = mindfulnessBank.reflection

        // Behavioral profile always from English
        const enMindfulness = translations.en.dimensions.mindfulness[mindfulnessLevel]
        const enAwareness = translations.en.dimensions.awareness[awarenessLevel]
        behavioralProfile = `${enMindfulness.behavioralProfile} ${enAwareness.behavioralProfile}`
    }

    return {
        userReport,
        behavioralProfile
    }
}