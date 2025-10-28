/**
 * Self-Acceptance Generator - COMPLETE (30 patterns)
 * All text in JSON, only logic here
 */

import selfAcceptanceEN from '../i18n/en/selfAcceptance.json'
import selfAcceptanceLT from '../i18n/lt/selfAcceptance.json'

const translations = {
    en: selfAcceptanceEN,
    lt: selfAcceptanceLT
}

export function generateSelfAcceptanceReflection(traitData, locale = 'en') {
    const t = translations[locale]
    const tEN = translations.en
    const {
        level,
        openness_to_change,
        subscores
    } = traitData

    const bank = t.levels[level]
    if (!bank) {
        throw new Error(`Unknown self-acceptance level: ${level}`)
    }

    let userReport = bank.reflection

    if (openness_to_change && t.opennessModifiers ?.[openness_to_change]) {
        const modifier = t.opennessModifiers[openness_to_change].modifier
        if (modifier) {
            userReport += '\n\n' + modifier
        }
    }

    const enBank = tEN.levels[level]
    let behavioralProfile = enBank.behavioralProfile

    if (openness_to_change && tEN.opennessModifiers ?.[openness_to_change]) {
        const behavioralAddition = tEN.opennessModifiers[openness_to_change].behavioralAddition
        if (behavioralAddition) {
            behavioralProfile += ' ' + behavioralAddition
        }
    }

    if (subscores) {
        const behavioralPatternKeys = identifyBehavioralPatterns(subscores)
        const behavioralPatternTexts = behavioralPatternKeys
            .map(key => tEN.behavioralPatterns ?.[key])
            .filter(Boolean)

        if (behavioralPatternTexts.length > 0) {
            behavioralProfile += ' ' + behavioralPatternTexts.join(' ')
        }

        const notablePatternKey = identifyNotablePattern(subscores)
        if (notablePatternKey && t.notablePatterns ?.[notablePatternKey]) {
            const prefix = locale === 'lt' ?
                '\n\n**Vienas dalykas, kurį verta pastebėti:** ' :
                '\n\n**One thing to notice:** '
            userReport += prefix + t.notablePatterns[notablePatternKey]
        }
    }

    return {
        userReport,
        behavioralProfile
    }
}

function identifyBehavioralPatterns(subscores) {
    const patterns = []
    const {
        low,
        high
    } = subscores.metadata.thresholds

    const {
        innerVoice,
        emotionalAcceptance,
        pastAcceptance,
        compassionForOthers
    } = subscores

    // Calculate averages for compound checks
    const avg = (innerVoice + emotionalAcceptance + pastAcceptance + compassionForOthers) / 4
    const avgNoCompassion = (innerVoice + emotionalAcceptance + pastAcceptance) / 3
    const range = Math.max(innerVoice, emotionalAcceptance, pastAcceptance, compassionForOthers) -
        Math.min(innerVoice, emotionalAcceptance, pastAcceptance, compassionForOthers)

    // === INTEGRATION PATTERNS (all high) ===

    if (innerVoice > 3.5 && emotionalAcceptance > 3.5 && pastAcceptance > 3.5 && compassionForOthers > 3.5) {
        patterns.push('exceptionalIntegration')
    } else if (innerVoice > 3.0 && emotionalAcceptance > 3.0 && pastAcceptance > 3.0 && compassionForOthers > 3.0) {
        patterns.push('strongIntegration')
    } else if ([innerVoice, emotionalAcceptance, pastAcceptance, compassionForOthers].filter(s => s > 3.0).length === 3 &&
        avg >= 2.8) {
        patterns.push('almostIntegrated')
    }

    // === STRUGGLE PATTERNS (all/most low) ===

    if (innerVoice < 2.0 && emotionalAcceptance < 2.0 && pastAcceptance < 2.0 && compassionForOthers < 2.0) {
        patterns.push('pervasiveStruggle')
    } else if ([innerVoice, emotionalAcceptance, pastAcceptance, compassionForOthers].filter(s => s < 2.3).length === 3 &&
        avg < 2.5) {
        patterns.push('multipleDeficits')
    } else if (innerVoice < 2.3 && emotionalAcceptance < 2.3 && pastAcceptance < 2.3 && compassionForOthers < 2.3) {
        patterns.push('beginningFromDifficulty')
    }

    // === DEVELOPMENT PATTERNS (all moderate) ===

    if (range < 0.5 && avg >= 2.3 && avg <= 3.0) {
        patterns.push('evenDevelopment')
    } else if (avg >= 2.5 && avg <= 3.0 &&
        innerVoice >= 2.5 && emotionalAcceptance >= 2.5 &&
        pastAcceptance >= 2.5 && compassionForOthers >= 2.5) {
        patterns.push('moderateWithPotential')
    } else if (range < 0.6 && avg >= 2.3 && avg <= 2.8) {
        patterns.push('stableMiddle')
    }

    // === TENSION PATTERNS (high/low mix) ===

    if (emotionalAcceptance > high && innerVoice < low) {
        patterns.push('emotionalAcceptanceHarshVoice')
    }

    if (compassionForOthers > high && innerVoice < 2.5) {
        patterns.push('compassionForOthersNotSelf')
    }

    if (pastAcceptance < low && compassionForOthers > high) {
        patterns.push('compassionGapWithPast')
    }

    if (innerVoice < low) {
        patterns.push('harshInnerVoice')
    }

    if (emotionalAcceptance > high && pastAcceptance < low) {
        patterns.push('emotionalAcceptanceNotPast')
    }

    if (compassionForOthers < low && innerVoice < low) {
        patterns.push('limitedCompassion')
    }

    if (pastAcceptance > high && innerVoice < 2.3) {
        patterns.push('pastPeaceNotPresent')
    }

    if (emotionalAcceptance < low) {
        patterns.push('emotionalResistance')
    }

    if (innerVoice > high && emotionalAcceptance > high && pastAcceptance < low) {
        patterns.push('strongFoundationWeakPast')
    }

    if (Math.abs(compassionForOthers - innerVoice) > 1.5) {
        patterns.push('compassionImbalance')
    }

    if (pastAcceptance > high && emotionalAcceptance < 2.3) {
        patterns.push('pastAcceptanceNotEmotional')
    }

    if (innerVoice < 2.3 && emotionalAcceptance > 2.5) {
        patterns.push('innerVoiceStressDependent')
    }

    // === EDGE CASES ===

    if (emotionalAcceptance > 3.3 && innerVoice < 1.8 && pastAcceptance >= 2.5 && pastAcceptance <= 3.5) {
        patterns.push('emotionalPeaceHarshJudgment')
    }

    if (compassionForOthers > 3.3 && avgNoCompassion < 2.2) {
        patterns.push('compassionFlowsOneWay')
    }

    if ((innerVoice + emotionalAcceptance) / 2 > 3.0 && pastAcceptance < 2.0) {
        patterns.push('presentAcceptancePastGrip')
    }

    if (pastAcceptance > 3.0 && emotionalAcceptance < 2.0) {
        patterns.push('pastReleaseEmotionalBlock')
    }

    if (innerVoice < 2.0 && emotionalAcceptance > 2.8 && pastAcceptance > 2.8 && compassionForOthers > 2.8) {
        patterns.push('innerVoiceOnlyDeficit')
    }

    if (emotionalAcceptance > 3.3 && innerVoice < 2.5 && pastAcceptance < 2.5 && compassionForOthers < 2.5) {
        patterns.push('emotionalAcceptanceOnlyStrength')
    }

    if (compassionForOthers > 3.0 && emotionalAcceptance < 2.0 && innerVoice >= 2.0) {
        patterns.push('compassionWithoutEmotionalAcceptance')
    }

    if (avgNoCompassion > 3.0 && compassionForOthers < 2.3) {
        patterns.push('allButCompassion')
    }

    if (innerVoice >= 2.3 && innerVoice <= 3.0 &&
        (emotionalAcceptance > 3.0 || pastAcceptance > 3.0 || compassionForOthers > 3.0)) {
        patterns.push('selectiveHarshness')
    }

    return patterns
}

function identifyNotablePattern(subscores) {
    const {
        innerVoice,
        emotionalAcceptance,
        pastAcceptance,
        compassionForOthers
    } = subscores

    const isExtreme = (score) => score < 1.8 || score > 3.5
    const hasLargeGap = (score1, score2) => Math.abs(score1 - score2) > 1.0

    // Priority order

    // 1. Exceptional integration (rare positive)
    if (innerVoice > 3.5 && emotionalAcceptance > 3.5 && pastAcceptance > 3.5 && compassionForOthers > 3.5) {
        return 'exceptionalIntegration'
    }

    // 2. Pervasive struggle (critical for struggling users)
    if (innerVoice < 2.0 && emotionalAcceptance < 2.0 && pastAcceptance < 2.0 && compassionForOthers < 2.0) {
        return 'pervasiveStruggle'
    }

    // 3. Emotional acceptance with harsh inner voice (most common tension)
    if (hasLargeGap(emotionalAcceptance, innerVoice) && emotionalAcceptance > 3.0 && innerVoice < 2.3) {
        return 'emotionalAcceptanceHarshVoice'
    }

    // 4. Compassion for others but not self
    if (hasLargeGap(compassionForOthers, innerVoice) && compassionForOthers > 3.0 && innerVoice < 2.3) {
        return 'compassionForOthersNotSelf'
    }

    // 5. Stuck in the past
    if (isExtreme(pastAcceptance) && pastAcceptance < 1.8 && emotionalAcceptance > 2.5) {
        return 'stuckInPast'
    }

    // 6. Extreme harsh inner voice
    if (isExtreme(innerVoice) && innerVoice < 1.8) {
        return 'extremeHarshVoice'
    }

    // 7. Past peace but not present kindness
    if (hasLargeGap(pastAcceptance, innerVoice) && pastAcceptance > 3.0 && innerVoice < 2.3) {
        return 'pastPeaceNotPresentKindness'
    }

    // 8. Cannot sit with emotions
    if (isExtreme(emotionalAcceptance) && emotionalAcceptance < 1.8) {
        return 'cannotSitWithEmotions'
    }

    // 9. Compassion gap with past
    if (hasLargeGap(pastAcceptance, compassionForOthers) && compassionForOthers > 3.0 && pastAcceptance < 2.0) {
        return 'compassionGapWithPast'
    }

    return null
}