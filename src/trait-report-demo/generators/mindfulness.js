/**
 * Mindfulness Generator - COMPLETE (30 patterns)
 * All text in JSON, only logic here
 */

import mindfulnessEN from '../i18n/en/mindfulness.json'
import mindfulnessLT from '../i18n/lt/mindfulness.json'

const translations = {
    en: mindfulnessEN,
    lt: mindfulnessLT
}

export function generateMindfulnessReflection(traitData, locale = 'en') {
    const t = translations[locale]
    const tEN = translations.en
    const {
        mindfulnessLevel,
        awarenessLevel,
        subscores
    } = traitData

    const combinationKey = `${mindfulnessLevel}_${awarenessLevel}`
    const combinationBank = t.combinations[combinationKey]

    let userReport
    let behavioralProfile

    if (combinationBank) {
        userReport = combinationBank.reflection
        behavioralProfile = tEN.combinations[combinationKey].behavioralProfile
    } else {
        const mindfulnessBank = t.dimensions.mindfulness[mindfulnessLevel]
        const awarenessBank = t.dimensions.awareness[awarenessLevel]

        if (!mindfulnessBank || !awarenessBank) {
            throw new Error(`Unknown mindfulness/awareness level: ${mindfulnessLevel}/${awarenessLevel}`)
        }

        userReport = mindfulnessBank.reflection
        const enMindfulness = tEN.dimensions.mindfulness[mindfulnessLevel]
        const enAwareness = tEN.dimensions.awareness[awarenessLevel]
        behavioralProfile = `${enMindfulness.behavioralProfile} ${enAwareness.behavioralProfile}`
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
        presentAwareness,
        nonreactiveObserving,
        responseFlexibility,
        internalStateAwareness,
        emotionalInsight
    } = subscores

    // Calculate averages for compound checks
    const avg = (presentAwareness + nonreactiveObserving + responseFlexibility +
        internalStateAwareness + emotionalInsight) / 5
    const range = Math.max(presentAwareness, nonreactiveObserving, responseFlexibility,
            internalStateAwareness, emotionalInsight) -
        Math.min(presentAwareness, nonreactiveObserving, responseFlexibility,
            internalStateAwareness, emotionalInsight)

    // === INTEGRATION PATTERNS (all high) ===

    if (presentAwareness > 3.5 && nonreactiveObserving > 3.5 && responseFlexibility > 3.5 &&
        internalStateAwareness > 3.5 && emotionalInsight > 3.5) {
        patterns.push('exceptionalMindfulness')
    } else if (presentAwareness > 3.0 && nonreactiveObserving > 3.0 && responseFlexibility > 3.0 &&
        internalStateAwareness > 3.0 && emotionalInsight > 3.0) {
        patterns.push('strongMindfulnessIntegration')
    } else if ([presentAwareness, nonreactiveObserving, responseFlexibility,
            internalStateAwareness, emotionalInsight
        ].filter(s => s > 3.0).length === 4 &&
        avg >= 2.8) {
        patterns.push('nearComplete')
    }

    // === STRUGGLE PATTERNS (all/most low) ===

    if (presentAwareness < 2.0 && nonreactiveObserving < 2.0 && responseFlexibility < 2.0 &&
        internalStateAwareness < 2.0 && emotionalInsight < 2.0) {
        patterns.push('minimalMindfulness')
    } else if ([presentAwareness, nonreactiveObserving, responseFlexibility,
            internalStateAwareness, emotionalInsight
        ].filter(s => s < 2.3).length === 4 &&
        avg < 2.5) {
        patterns.push('multipleDeficits')
    } else if (presentAwareness < 2.3 && nonreactiveObserving < 2.3 && responseFlexibility < 2.3 &&
        internalStateAwareness < 2.3 && emotionalInsight < 2.3) {
        patterns.push('earlyStageAllAround')
    }

    // === DEVELOPMENT PATTERNS (all moderate) ===

    if (range < 0.5 && avg >= 2.3 && avg <= 3.0) {
        patterns.push('balancedDevelopment')
    } else if (avg >= 2.5 && avg <= 3.0 &&
        presentAwareness >= 2.5 && nonreactiveObserving >= 2.5 &&
        responseFlexibility >= 2.5 && internalStateAwareness >= 2.5 &&
        emotionalInsight >= 2.5) {
        patterns.push('moderateMomentum')
    } else if (range < 0.6 && avg >= 2.3 && avg <= 2.8) {
        patterns.push('stableMiddleRange')
    }

    // === TENSION PATTERNS (high/low mix) ===

    if (presentAwareness < low && emotionalInsight > high) {
        patterns.push('intellectualVsRealtime')
    }

    if (nonreactiveObserving > high && responseFlexibility < 2.5) {
        patterns.push('observationWithoutAction')
    }

    if (internalStateAwareness < low && emotionalInsight > high) {
        patterns.push('awarenessWithoutIntegration')
    }

    if (presentAwareness < 2.0) {
        patterns.push('practiceWithoutPresence')
    }

    if (presentAwareness > high && emotionalInsight < low) {
        patterns.push('presenceWithoutInsight')
    }

    if (internalStateAwareness < low && presentAwareness > 2.5) {
        patterns.push('bodyAwarenessGap')
    }

    if (responseFlexibility < low && nonreactiveObserving > 2.5) {
        patterns.push('reactiveUnderStress')
    }

    if (emotionalInsight > high && internalStateAwareness < 2.3) {
        patterns.push('insightWithoutAwareness')
    }

    if (nonreactiveObserving > 2.8 && responseFlexibility < 2.3) {
        patterns.push('observationWithoutFlexibility')
    }

    // === EDGE CASES ===

    if (presentAwareness < 2.3 &&
        (nonreactiveObserving >= 2.5 || responseFlexibility >= 2.5 ||
            internalStateAwareness >= 2.5 || emotionalInsight >= 2.5)) {
        patterns.push('formalPracticeNoTransfer')
    }

    if (presentAwareness > 3.0 && emotionalInsight < 2.3 &&
        nonreactiveObserving < 3.0 && internalStateAwareness < 3.0) {
        patterns.push('naturalPresenceNoStructure')
    }

    if (internalStateAwareness < 2.0 && emotionalInsight > 2.5) {
        patterns.push('bodySeparation')
    }

    if (nonreactiveObserving > 3.3 && presentAwareness < 2.5) {
        patterns.push('hyperVigilantObservation')
    }

    if ((presentAwareness + nonreactiveObserving) / 2 > 3.0 && responseFlexibility < 2.0) {
        patterns.push('reactionGapDespiteAwareness')
    }

    if (emotionalInsight > 3.3 && (presentAwareness + internalStateAwareness) < 4.5) {
        patterns.push('insightWithoutFoundation')
    }

    if (presentAwareness > 3.0 && internalStateAwareness < 2.3) {
        patterns.push('presenceWithoutDifferentiation')
    }

    if (presentAwareness > 2.8 && nonreactiveObserving > 2.8 &&
        responseFlexibility > 2.8 && internalStateAwareness > 2.8 &&
        emotionalInsight < 2.3) {
        patterns.push('allButInsight')
    }

    if (emotionalInsight > 2.8 && internalStateAwareness < 1.8) {
        patterns.push('bodyMindDissociation')
    }

    if (responseFlexibility > 3.0 && nonreactiveObserving < 2.3) {
        patterns.push('flexibilityWithoutObservation')
    }

    if (presentAwareness > 3.0 && responseFlexibility < 2.0) {
        patterns.push('presentButReactive')
    }

    const scores = [presentAwareness, nonreactiveObserving, responseFlexibility,
        internalStateAwareness, emotionalInsight
    ]
    const highScores = scores.filter(s => s > 3.3).length
    const lowScores = scores.filter(s => s < 2.5).length
    if (highScores === 1 && lowScores >= 3) {
        patterns.push('fragmentedAwareness')
    }

    return patterns
}

function identifyNotablePattern(subscores) {
    const {
        presentAwareness,
        nonreactiveObserving,
        responseFlexibility,
        internalStateAwareness,
        emotionalInsight
    } = subscores

    const isExtreme = (score) => score < 1.8 || score > 3.5
    const hasLargeGap = (score1, score2) => Math.abs(score1 - score2) > 1.0

    // Priority order

    // 1. Exceptional mindfulness (rare positive)
    if (presentAwareness > 3.5 && nonreactiveObserving > 3.5 && responseFlexibility > 3.5 &&
        internalStateAwareness > 3.5 && emotionalInsight > 3.5) {
        return 'exceptionalMindfulness'
    }

    // 2. Minimal mindfulness (critical for struggling users)
    if (presentAwareness < 2.0 && nonreactiveObserving < 2.0 && responseFlexibility < 2.0 &&
        internalStateAwareness < 2.0 && emotionalInsight < 2.0) {
        return 'minimalMindfulness'
    }

    // 3. Intellectual vs. Real-time (very common and impactful)
    if (hasLargeGap(emotionalInsight, presentAwareness) &&
        emotionalInsight > 3.0 && presentAwareness < 2.3) {
        return 'intellectualVsRealtime'
    }

    // 4. Observation without action
    if (hasLargeGap(nonreactiveObserving, responseFlexibility) &&
        nonreactiveObserving > 3.0 && responseFlexibility < 2.3) {
        return 'observationWithoutAction'
    }

    // 5. Mind-body disconnect
    if (hasLargeGap(emotionalInsight, internalStateAwareness) &&
        emotionalInsight > 3.0 && internalStateAwareness < 2.3) {
        return 'mindBodyDisconnect'
    }

    // 6. Extreme low present awareness
    if (isExtreme(presentAwareness) && presentAwareness < 1.8) {
        return 'extremeLowPresence'
    }

    // 7. Strong presence but no depth
    if (hasLargeGap(presentAwareness, emotionalInsight) &&
        presentAwareness > 3.0 && emotionalInsight < 2.3) {
        return 'presenceWithoutDepth'
    }

    return null
}