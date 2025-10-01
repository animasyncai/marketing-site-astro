/**
 * Love Language trait reflection generator
 * Independent, pluggable, reusable
 */

/**
 * Generate love language reflection
 * 
 * @param {object} traitData - Complete trait data with scores
 * @param {object} languageData - JSON data structure for the language
 * @returns {object} { userReport: string, behavioralProfile: string }
 */
export function generateLoveLanguageReflection(traitData, languageData) {
    const {
        primary,
        primaryScores,
        secondary,
        secondaryScores,
        distribution
    } = traitData

    const userReport = buildUserReflection(
        languageData,
        primary,
        primaryScores,
        secondary,
        secondaryScores,
        distribution
    )

    const behavioralProfile = buildBehavioralProfile(
        languageData,
        primary,
        primaryScores,
        secondary,
        secondaryScores,
        distribution
    )

    return {
        userReport,
        behavioralProfile
    }
}

/**
 * Build user-facing reflection with proper paragraph formatting
 */
function buildUserReflection(data, primary, primaryScores, secondary, secondaryScores, distribution) {
    const bank = data.love_language[primary]
    const reflection = bank.reflection

    let paragraphs = []

    // PARAGRAPH 1: Core + Subtype
    let paragraph1 = reflection.core + " "

    if (primaryScores && primary !== "PHYSICAL_TOUCH") {
        const scoreA = primaryScores.A.score
        const scoreB = primaryScores.B.score
        const diff = Math.abs(scoreA - scoreB)

        if (diff <= 0.5) {
            paragraph1 += reflection.balanced
        } else if (scoreA > scoreB) {
            paragraph1 += reflection.subtypeA.emphasis + " " + reflection.subtypeA.behavioral
        } else {
            paragraph1 += reflection.subtypeB.emphasis + " " + reflection.subtypeB.behavioral
        }
    }

    paragraphs.push(paragraph1)

    // PARAGRAPH 2: Closing hook
    paragraphs.push(reflection.closing)

    // PARAGRAPH 3: Secondary bridge (if exists)
    if (secondary) {
        const bridge = buildSecondaryBridge(data, primary, secondary, secondaryScores)
        if (bridge) {
            paragraphs.push(bridge)
        }
    }

    // PARAGRAPH 4: Distribution pattern
    if (distribution && data.distributionPatterns && data.distributionPatterns[distribution]) {
        const distPattern = data.distributionPatterns[distribution]
        paragraphs.push(distPattern.userReflection)
    }

    return paragraphs.join("\n\n")
}

/**
 * Build secondary language bridge with subtype awareness
 */
function buildSecondaryBridge(data, primary, secondary, secondaryScores) {
    let secSubtype = ""
    if (secondary !== "PHYSICAL_TOUCH" && secondaryScores) {
        const secScoreA = secondaryScores.A.score
        const secScoreB = secondaryScores.B.score
        const diff = Math.abs(secScoreA - secScoreB)

        if (diff > 0.5) {
            secSubtype = secScoreA > secScoreB ? "_A" : "_B"
        }
    }

    const primaryAbbrev = primary.split('_').map(w => w[0]).join('')
    const secondaryAbbrev = secondary.split('_').map(w => w[0]).join('')
    const bridgeKey = `${primaryAbbrev}_TO_${secondaryAbbrev}${secSubtype}`

    if (data.secondaryBridges && data.secondaryBridges[bridgeKey]) {
        return data.secondaryBridges[bridgeKey]
    }

    return null
}

/**
 * Build behavioral profile for consultant/reports
 */
function buildBehavioralProfile(data, primary, primaryScores, secondary, secondaryScores, distribution) {
    const bank = data.love_language[primary]
    const behavioral = bank.behavioralProfile

    let paragraphs = []

    // PARAGRAPH 1: Core + Subtype-specific
    let paragraph1 = behavioral.core + " "

    if (primaryScores && primary !== "PHYSICAL_TOUCH") {
        const scoreA = primaryScores.A.score
        const scoreB = primaryScores.B.score
        const diff = Math.abs(scoreA - scoreB)

        if (diff <= 0.5) {
            paragraph1 += behavioral.balanced
        } else if (scoreA > scoreB) {
            paragraph1 += behavioral.subtypeA
        } else {
            paragraph1 += behavioral.subtypeB
        }
    }

    paragraphs.push(paragraph1)

    // PARAGRAPH 2: Universal patterns
    paragraphs.push(behavioral.universal)

    // PARAGRAPH 3: Secondary language (if exists)
    if (secondary) {
        const secondaryBank = data.love_language[secondary]
        const secondaryBehavioral = secondaryBank.behavioralProfile

        let paragraph3 = "Secondary preference: " + secondaryBehavioral.core + " "

        if (secondaryScores && secondary !== "PHYSICAL_TOUCH") {
            const secScoreA = secondaryScores.A.score
            const secScoreB = secondaryScores.B.score
            const diff = Math.abs(secScoreA - secScoreB)

            if (diff <= 0.5) {
                paragraph3 += secondaryBehavioral.balanced
            } else if (secScoreA > secScoreB) {
                paragraph3 += secondaryBehavioral.subtypeA
            } else {
                paragraph3 += secondaryBehavioral.subtypeB
            }
        } else if (secondary === "PHYSICAL_TOUCH") {
            paragraph3 += secondaryBehavioral.universal
        }

        paragraphs.push(paragraph3)
    }

    // PARAGRAPH 4: Distribution behavioral note
    if (distribution && data.distributionPatterns && data.distributionPatterns[distribution]) {
        const distPattern = data.distributionPatterns[distribution]
        paragraphs.push(distPattern.behavioralNote)
    }

    return paragraphs.join(" ")
}