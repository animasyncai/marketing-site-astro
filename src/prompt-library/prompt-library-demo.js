/**
 * Prompt Library Demo & Editor Utilities
 *
 * This module provides helper functions for the testing and editor pages,
 * including localStorage management, sample data, and import/export.
 */

// ============================================================================
// LOCALSTORAGE MANAGEMENT
// ============================================================================

const STORAGE_KEY = 'prompt-library-edited'
const STORAGE_VERSION_KEY = 'prompt-library-version'
const CURRENT_VERSION = '1.0.0'

/**
 * Loads prompt library from localStorage or returns default
 *
 * @param {Array} defaultLibrary - Default prompt library
 * @returns {Object} { prompts: Array, isEdited: boolean, version: string }
 */
export function loadPromptLibrary(defaultLibrary) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const version = localStorage.getItem(STORAGE_VERSION_KEY)

    if (stored) {
      return {
        prompts: JSON.parse(stored),
        isEdited: true,
        version: version || '1.0.0',
      }
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
  }

  return {
    prompts: defaultLibrary,
    isEdited: false,
    version: CURRENT_VERSION,
  }
}

/**
 * Saves prompt library to localStorage
 *
 * @param {Array} prompts - Prompt library to save
 */
export function savePromptLibrary(prompts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts, null, 2))
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION)
    return true
  } catch (error) {
    console.error('Error saving to localStorage:', error)
    return false
  }
}

/**
 * Resets prompt library to default (clears localStorage)
 *
 * @param {Array} defaultLibrary - Default prompt library
 * @returns {Array} Default library
 */
export function resetPromptLibrary(defaultLibrary) {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_VERSION_KEY)
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
  return defaultLibrary
}

/**
 * Checks if there are unsaved changes
 *
 * @param {Array} currentPrompts - Current prompt state
 * @param {Array} savedPrompts - Saved prompts from localStorage
 * @returns {boolean} True if there are unsaved changes
 */
export function hasUnsavedChanges(currentPrompts, savedPrompts) {
  return JSON.stringify(currentPrompts) !== JSON.stringify(savedPrompts)
}

// ============================================================================
// IMPORT / EXPORT
// ============================================================================

/**
 * Exports prompt library as JSON file
 *
 * @param {Array} prompts - Prompts to export
 * @param {string} filename - Optional filename
 */
export function exportPromptLibrary(prompts, filename = 'prompt-library.json') {
  const json = JSON.stringify({ prompts }, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}

/**
 * Imports and validates prompt library from JSON
 *
 * @param {string} jsonString - JSON string to import
 * @returns {Object} { success: boolean, prompts?: Array, error?: string }
 */
export function importPromptLibrary(jsonString) {
  try {
    const data = JSON.parse(jsonString)

    // Validate structure
    if (!data.prompts || !Array.isArray(data.prompts)) {
      return {
        success: false,
        error: 'Invalid format: missing "prompts" array',
      }
    }

    // Basic validation
    const hasRequiredFields = data.prompts.every((p) => p.id && p.text && p.contexts && p.criteria)

    if (!hasRequiredFields) {
      return {
        success: false,
        error: 'Invalid format: some prompts missing required fields (id, text, contexts, criteria)',
      }
    }

    return {
      success: true,
      prompts: data.prompts,
    }
  } catch (error) {
    return {
      success: false,
      error: `Parse error: ${error.message}`,
    }
  }
}

// ============================================================================
// SAMPLE TRAIT DATA
// ============================================================================

/**
 * Sample trait data presets for testing
 * Uses the full Withinly data structure
 */
export const SAMPLE_TRAITS = {
  anxiousAttacher: {
    name: 'Anxious Attacher',
    traits: {
      attachmentType: {
        primary: 'ANXIOUS',
        secondary: 'SECURE',
        primaryIntensity: 'STRONG',
        secondaryIntensity: 'MODERATE',
      },
      loveLanguage: {
        primary: 'WORDS_OF_AFFIRMATION',
        secondary: 'QUALITY_TIME',
      },
      mindfulness: {
        mindfulnessLevel: 'MODERATE_MINDFULNESS',
        awarenessLevel: 'GOOD_SELF_AWARENESS',
      },
      selfAcceptance: {
        level: 'DEVELOPING_SELF_ACCEPTANCE',
        opennessToChange: 'MIXED_FEELINGS',
      },
    },
  },

  avoidantAttacher: {
    name: 'Avoidant Attacher',
    traits: {
      attachmentType: {
        primary: 'AVOIDANT',
        secondary: 'SECURE',
        primaryIntensity: 'MODERATE',
        secondaryIntensity: 'MODERATE',
      },
      loveLanguage: {
        primary: 'QUALITY_TIME',
        secondary: 'PHYSICAL_TOUCH',
      },
      mindfulness: {
        mindfulnessLevel: 'MODERATE_MINDFULNESS',
        awarenessLevel: 'MODERATE_SELF_AWARENESS',
      },
      selfAcceptance: {
        level: 'DEVELOPING_SELF_ACCEPTANCE',
        opennessToChange: 'RESISTANT',
      },
    },
  },

  secureAndAware: {
    name: 'Secure & Aware',
    traits: {
      attachmentType: {
        primary: 'SECURE',
        secondary: 'ANXIOUS',
        primaryIntensity: 'STRONG',
        secondaryIntensity: 'MILD',
      },
      loveLanguage: {
        primary: 'QUALITY_TIME',
        secondary: 'WORDS_OF_AFFIRMATION',
      },
      mindfulness: {
        mindfulnessLevel: 'GOOD_MINDFULNESS',
        awarenessLevel: 'GOOD_SELF_AWARENESS',
      },
      selfAcceptance: {
        level: 'INTEGRATED_SELF_ACCEPTANCE',
        opennessToChange: 'OPEN',
      },
    },
  },

  beginner: {
    name: 'Beginner (Low Awareness)',
    traits: {
      attachmentType: {
        primary: 'DISORGANIZED',
        primaryIntensity: 'MODERATE',
      },
      loveLanguage: {
        primary: 'PHYSICAL_TOUCH',
      },
      mindfulness: {
        mindfulnessLevel: 'LOW_MINDFULNESS',
        awarenessLevel: 'LOW_SELF_AWARENESS',
      },
      selfAcceptance: {
        level: 'BEGINNING_SELF_ACCEPTANCE',
        opennessToChange: 'RESISTANT',
      },
    },
  },

  actsOfService: {
    name: 'Acts of Service (Feeling Unappreciated)',
    traits: {
      attachmentType: {
        primary: 'ANXIOUS',
        primaryIntensity: 'MODERATE',
      },
      loveLanguage: {
        primary: 'ACTS_OF_SERVICE',
        secondary: 'WORDS_OF_AFFIRMATION',
      },
      mindfulness: {
        mindfulnessLevel: 'MODERATE_MINDFULNESS',
        awarenessLevel: 'MODERATE_SELF_AWARENESS',
      },
      selfAcceptance: {
        level: 'DEVELOPING_SELF_ACCEPTANCE',
        opennessToChange: 'MIXED_FEELINGS',
      },
    },
  },

  minimal: {
    name: 'Minimal Traits',
    traits: {
      attachmentType: {
        primary: 'SECURE',
        primaryIntensity: 'MODERATE',
      },
      loveLanguage: {
        primary: 'QUALITY_TIME',
      },
      mindfulness: {
        mindfulnessLevel: 'MODERATE_MINDFULNESS',
      },
      selfAcceptance: {
        level: 'DEVELOPING_SELF_ACCEPTANCE',
      },
    },
  },
}

/**
 * Creates empty trait data structure matching Withinly format
 */
export function createEmptyTraits() {
  return {
    attachmentType: {
      primary: 'SECURE',
      secondary: null,
      primaryIntensity: 'MODERATE',
      secondaryIntensity: null,
    },
    loveLanguage: {
      primary: 'QUALITY_TIME',
      secondary: null,
    },
    mindfulness: {
      mindfulnessLevel: 'MODERATE_MINDFULNESS',
      awarenessLevel: null,
    },
    selfAcceptance: {
      level: 'DEVELOPING_SELF_ACCEPTANCE',
      opennessToChange: null,
    },
  }
}

// ============================================================================
// EDITOR HELPERS
// ============================================================================

/**
 * Available options for prompt editor dropdowns
 */
export const EDITOR_OPTIONS = {
  contexts: ['You', 'Couple', 'Family'],

  matchTypes: ['AND', 'OR'],

  traitTypes: ['attachment', 'loveLanguage', 'mindfulness', 'selfAcceptance'],

  attachmentLabels: ['anxious', 'avoidant', 'secure', 'disorganized'],

  loveLanguageLabels: ['words', 'time', 'acts', 'touch', 'gifts'],

  mindfulnessLabels: ['low', 'moderate', 'high'],

  awarenessLabels: ['low', 'moderate', 'high'],

  selfAcceptanceLabels: ['low', 'moderate', 'high', 'god'],

  opennessLabels: ['resistant', 'mixed', 'open', 'eager'],

  intensities: ['very_mild', 'mild', 'moderate', 'strong'],
}

/**
 * Gets available labels for a trait type
 *
 * @param {string} traitType - Type of trait
 * @returns {Array<string>} Available labels
 */
export function getLabelsForTraitType(traitType) {
  switch (traitType) {
    case 'attachment':
      return EDITOR_OPTIONS.attachmentLabels
    case 'loveLanguage':
      return EDITOR_OPTIONS.loveLanguageLabels
    case 'mindfulness':
      // Include both mindfulness and awareness labels
      return [...EDITOR_OPTIONS.mindfulnessLabels, ...EDITOR_OPTIONS.awarenessLabels.map((l) => `awareness:${l}`)]
    case 'selfAcceptance':
      // Include both level and openness labels
      return [...EDITOR_OPTIONS.selfAcceptanceLabels, ...EDITOR_OPTIONS.opennessLabels.map((l) => `openness:${l}`)]
    default:
      return []
  }
}

/**
 * Creates a new empty prompt
 *
 * @param {number} nextId - Next available ID
 * @returns {Object} Empty prompt object
 */
export function createEmptyPrompt(nextId) {
  return {
    id: nextId,
    text: {
      en: '',
      lt: '',
    },
    contexts: ['You'],
    category: null, // Optional category
    criteria: {
      matchType: 'AND',
      traits: [],
    },
    priority: 5,
  }
}

/**
 * Duplicates a prompt with a new ID
 *
 * @param {Object} prompt - Prompt to duplicate
 * @param {number} nextId - Next available ID
 * @returns {Object} Duplicated prompt
 */
export function duplicatePrompt(prompt, nextId) {
  return {
    ...JSON.parse(JSON.stringify(prompt)), // Deep clone
    id: nextId,
  }
}

/**
 * Gets the next available ID
 *
 * @param {Array} prompts - Current prompts
 * @returns {number} Next ID
 */
export function getNextId(prompts) {
  if (prompts.length === 0) return 1
  return Math.max(...prompts.map((p) => p.id)) + 1
}

// ============================================================================
// DEBUGGING HELPERS
// ============================================================================

/**
 * Explains why a prompt matched or didn't match
 * Handles all trait structures: primary/secondary, mindfulness/awareness, level/openness
 *
 * @param {Object} prompt - Prompt to explain
 * @param {Object} traitData - User's trait data
 * @param {Object} mappedTraits - Mapped traits from mapTraitData()
 * @returns {Object} Explanation object
 */
export function explainMatch(prompt, traitData, mappedTraits) {
  const explanation = {
    promptId: prompt.id,
    promptText: prompt.text?.en || prompt.text,
    universal: prompt.criteria.traits.length === 0,
    matchType: prompt.criteria.matchType,
    traitChecks: [],
    finalResult: false,
  }

  if (explanation.universal) {
    explanation.finalResult = true
    return explanation
  }

  // Helper to check a single trait value
  const checkTraitValue = (traitValue, requiredTrait) => {
    if (!traitValue) return false

    // Check labels
    if (requiredTrait.labels && requiredTrait.labels.length > 0) {
      if (!requiredTrait.labels.includes(traitValue.label)) {
        return false
      }
    }

    // Check intensities
    if (requiredTrait.intensities && requiredTrait.intensities.length > 0) {
      if (!traitValue.intensity || !requiredTrait.intensities.includes(traitValue.intensity)) {
        return false
      }
    }

    return true
  }

  for (const requiredTrait of prompt.criteria.traits) {
    const userTrait = mappedTraits[requiredTrait.type]

    const check = {
      traitType: requiredTrait.type,
      required: {
        labels: requiredTrait.labels || 'any',
        intensities: requiredTrait.intensities || 'any',
      },
      user: null,
      matches: false,
      reason: '',
    }

    if (!userTrait) {
      check.reason = `User doesn't have ${requiredTrait.type} trait`
    } else {
      // Handle attachment/loveLanguage with primary/secondary
      if (userTrait.primary) {
        check.user = {
          primary: {
            label: userTrait.primary.label,
            intensity: userTrait.primary.intensity || 'none',
          },
          secondary: userTrait.secondary
            ? {
                label: userTrait.secondary.label,
                intensity: userTrait.secondary.intensity || 'none',
              }
            : null,
        }

        const primaryMatches = checkTraitValue(userTrait.primary, requiredTrait)
        const secondaryMatches = userTrait.secondary ? checkTraitValue(userTrait.secondary, requiredTrait) : false

        if (primaryMatches || secondaryMatches) {
          check.matches = true
          check.reason = primaryMatches
            ? `✓ Match (primary: ${userTrait.primary.label})`
            : `✓ Match (secondary: ${userTrait.secondary.label})`
        } else {
          const primaryLabel = userTrait.primary.label
          const secondaryLabel = userTrait.secondary?.label || 'none'
          check.reason = `Label mismatch: need ${requiredTrait.labels?.join(' or ') || 'any'}, have ${primaryLabel}/${secondaryLabel}`
        }
      }
      // Handle mindfulness with .mindfulness and .awareness
      else if (userTrait.mindfulness || userTrait.awareness) {
        check.user = {
          mindfulness: userTrait.mindfulness
            ? {
                label: userTrait.mindfulness.label,
              }
            : null,
          awareness: userTrait.awareness
            ? {
                label: userTrait.awareness.label,
              }
            : null,
        }

        const mindfulnessMatches = userTrait.mindfulness ? checkTraitValue(userTrait.mindfulness, requiredTrait) : false
        const awarenessMatches = userTrait.awareness ? checkTraitValue(userTrait.awareness, requiredTrait) : false

        if (mindfulnessMatches || awarenessMatches) {
          check.matches = true
          check.reason = mindfulnessMatches
            ? `✓ Match (mindfulness: ${userTrait.mindfulness.label})`
            : `✓ Match (awareness: ${userTrait.awareness.label})`
        } else {
          const mindfulnessLabel = userTrait.mindfulness?.label || 'none'
          const awarenessLabel = userTrait.awareness?.label || 'none'
          check.reason = `Label mismatch: need ${requiredTrait.labels?.join(' or ') || 'any'}, have mindfulness:${mindfulnessLabel}/awareness:${awarenessLabel}`
        }
      }
      // Handle selfAcceptance with .level and .openness
      else if (userTrait.level || userTrait.openness) {
        check.user = {
          level: userTrait.level
            ? {
                label: userTrait.level.label,
              }
            : null,
          openness: userTrait.openness
            ? {
                label: userTrait.openness.label,
              }
            : null,
        }

        const levelMatches = userTrait.level ? checkTraitValue(userTrait.level, requiredTrait) : false
        const opennessMatches = userTrait.openness ? checkTraitValue(userTrait.openness, requiredTrait) : false

        if (levelMatches || opennessMatches) {
          check.matches = true
          check.reason = levelMatches
            ? `✓ Match (level: ${userTrait.level.label})`
            : `✓ Match (openness: ${userTrait.openness.label})`
        } else {
          const levelLabel = userTrait.level?.label || 'none'
          const opennessLabel = userTrait.openness?.label || 'none'
          check.reason = `Label mismatch: need ${requiredTrait.labels?.join(' or ') || 'any'}, have level:${levelLabel}/openness:${opennessLabel}`
        }
      }
    }

    explanation.traitChecks.push(check)
  }

  // Calculate final result based on match type
  const matchCount = explanation.traitChecks.filter((c) => c.matches).length

  if (prompt.criteria.matchType === 'AND') {
    explanation.finalResult = matchCount === explanation.traitChecks.length
  } else {
    explanation.finalResult = matchCount > 0
  }

  return explanation
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  loadPromptLibrary,
  savePromptLibrary,
  resetPromptLibrary,
  hasUnsavedChanges,
  exportPromptLibrary,
  importPromptLibrary,
  SAMPLE_TRAITS,
  createEmptyTraits,
  EDITOR_OPTIONS,
  getLabelsForTraitType,
  createEmptyPrompt,
  duplicatePrompt,
  getNextId,
  explainMatch,
}
