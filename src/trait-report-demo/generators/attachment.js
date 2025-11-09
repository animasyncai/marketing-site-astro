/**
 * Attachment trait reflection generator - WITH SUBSCORES AND PATTERNS
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
 * @returns {object} { userReport: string, behavioralProfile: string, detectedPatterns: string }
 */
export function generateAttachmentReflection(traitData, locale = 'en') {
    const t = translations[locale]
    const {
        primary,
        primaryIntensity,
        secondary,
        secondaryIntensity,
        subscores
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

    // Detect patterns first (needed for behavioral profile)
    const detectedPatterns = subscores ? detectPatterns(primary, subscores) : []

    // Generate behavioral profile (always from English data)
    const behavioralProfile = generateBehavioralProfile(
        translations.en, // Always use English for behavioral profiles
        primary,
        primaryIntensity,
        secondary,
        secondaryIntensity,
        subscores,
        detectedPatterns
    )

    return {
        userReport,
        behavioralProfile,
        detectedPatterns // Return as array
    }
}

function generateBehavioralProfile(t, primary, primaryIntensity, secondary, secondaryIntensity, subscores, detectedPatterns) {
    const primaryProfile = t.types[primary].behavioralProfiles[primaryIntensity]

    let behavioralProfile = primaryProfile

    if (secondary) {
        const combinationKey = `${primary}_${primaryIntensity}_${secondary}_${secondaryIntensity}`
        if (t.combinationProfiles[combinationKey]) {
            behavioralProfile = t.combinationProfiles[combinationKey]
        } else {
            // Systematic generation
            const typeKey = `${primary}_${secondary}`
            const intensityKey = `${primaryIntensity}_${secondaryIntensity}`

            const combinationDescription = t.systematicCombinations.typeDescriptions[typeKey] ||
                'complex interaction between different attachment needs'

            const intensityNote = t.systematicCombinations.intensityModifiers[intensityKey] ||
                'Creates some relationship complexity.'

            const primaryBase = primaryProfile.split('.')[0]

            behavioralProfile = `${primaryBase}. Secondary ${secondary.toLowerCase()} patterns create ${combinationDescription}. ${intensityNote}`
        }
    }

    // Add pattern-based behavioral insights if patterns detected
    if (detectedPatterns && detectedPatterns.length > 0 && t.systematicCombinations ?.patternDescriptions) {
        const patternDescriptions = detectedPatterns
            .map(patternKey => t.systematicCombinations.patternDescriptions[patternKey])
            .filter(Boolean)

        if (patternDescriptions.length > 0) {
            behavioralProfile += ' ' + patternDescriptions.join(' ')
        }
    }

    return behavioralProfile
}

/**
 * Detect attachment patterns based on subscores
 * @param {string} primary - Primary attachment type
 * @param {object} subscores - Subscore data
 * @returns {Array<string>} - Array of detected pattern machine names
 */
function detectPatterns(primary, subscores) {
    const patterns = []

    const {
        protestBehavior,
        deactivationStrategy,
        pushPullPattern,
        emotionalRegulation,
        metadata
    } = subscores

    const {
        low,
        high
    } = metadata.thresholds

    // Step 1: Check for cross-type patterns (mutually exclusive - only one can fire)
    if (protestBehavior >= high && deactivationStrategy >= high) {
        patterns.push('highInternalConflict')
    } else if (emotionalRegulation >= high && protestBehavior < 2.0 &&
        deactivationStrategy < 2.0 && pushPullPattern < 2.0) {
        patterns.push('strongRegulationCapacity')
    } else if (Math.abs(protestBehavior - 3.0) <= 0.5 &&
        Math.abs(deactivationStrategy - 3.0) <= 0.5 &&
        Math.abs(pushPullPattern - 3.0) <= 0.5 &&
        Math.abs(emotionalRegulation - 3.0) <= 0.5) {
        patterns.push('balancedButActivated')
    }

    // Step 2: Check for primary-type specific patterns
    if (primary === 'AVOIDANT') {
        // Priority order: defensive/reactive > conflicted > pure > leaning
        if (deactivationStrategy >= high && emotionalRegulation < low) {
            patterns.push('defensiveShutdown')
        } else if (deactivationStrategy >= high && protestBehavior >= low && protestBehavior < high) {
            patterns.push('avoidantWithHiddenAnxiety')
        } else if (deactivationStrategy >= high && protestBehavior < low) {
            patterns.push('pureAvoidantWithdrawal')
        } else if (deactivationStrategy >= low && deactivationStrategy < high && emotionalRegulation >= high) {
            patterns.push('secureLeaningAvoidant')
        }
    } else if (primary === 'ANXIOUS') {
        if (protestBehavior >= high && emotionalRegulation < low) {
            patterns.push('reactivePursuit')
        } else if (protestBehavior >= high && deactivationStrategy >= low && deactivationStrategy < high) {
            patterns.push('conflictedAnxious')
        } else if (protestBehavior >= high && deactivationStrategy < low) {
            patterns.push('pureAnxiousPursuit')
        } else if (protestBehavior >= low && protestBehavior < high && emotionalRegulation >= high) {
            patterns.push('secureLeaningAnxious')
        }
    } else if (primary === 'DISORGANIZED') {
        if (pushPullPattern >= high && protestBehavior >= high) {
            patterns.push('chaoticAnxious')
        } else if (pushPullPattern >= high && deactivationStrategy >= high) {
            patterns.push('chaoticAvoidant')
        } else if (pushPullPattern >= high && emotionalRegulation < low) {
            patterns.push('unstableRegulation')
        } else if (pushPullPattern >= low && pushPullPattern < high &&
            emotionalRegulation >= low) {
            patterns.push('healingDisorganized')
        }
    } else if (primary === 'SECURE') {
        if (emotionalRegulation >= 4.0 && protestBehavior < low &&
            deactivationStrategy < low && pushPullPattern < low) {
            patterns.push('integratedSecure')
        } else if (emotionalRegulation >= high && emotionalRegulation < 4.0 &&
            (protestBehavior >= low || deactivationStrategy >= low)) {
            patterns.push('secureWithTendencies')
        }
    }

    // Return max 3 patterns: 1 cross-type + 2 primary-type
    return patterns.slice(0, 3)
}