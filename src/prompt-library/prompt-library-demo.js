/**
 * Prompt Library Demo & Editor Utilities
 * 
 * This module provides helper functions for the testing and editor pages,
 * including localStorage management, sample data, and import/export.
 */

// ============================================================================
// LOCALSTORAGE MANAGEMENT
// ============================================================================

const STORAGE_KEY = 'prompt-library-edited';
const STORAGE_VERSION_KEY = 'prompt-library-version';
const CURRENT_VERSION = '1.0.0';

/**
 * Loads prompt library from localStorage or returns default
 * 
 * @param {Array} defaultLibrary - Default prompt library
 * @returns {Object} { prompts: Array, isEdited: boolean, version: string }
 */
export function loadPromptLibrary(defaultLibrary) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const version = localStorage.getItem(STORAGE_VERSION_KEY);

    if (stored) {
      return {
        prompts: JSON.parse(stored),
        isEdited: true,
        version: version || '1.0.0',
      };
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }

  return {
    prompts: defaultLibrary,
    isEdited: false,
    version: CURRENT_VERSION,
  };
}

/**
 * Saves prompt library to localStorage
 * 
 * @param {Array} prompts - Prompt library to save
 */
export function savePromptLibrary(prompts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts, null, 2));
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
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
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_VERSION_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
  return defaultLibrary;
}

/**
 * Checks if there are unsaved changes
 * 
 * @param {Array} currentPrompts - Current prompt state
 * @param {Array} savedPrompts - Saved prompts from localStorage
 * @returns {boolean} True if there are unsaved changes
 */
export function hasUnsavedChanges(currentPrompts, savedPrompts) {
  return JSON.stringify(currentPrompts) !== JSON.stringify(savedPrompts);
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
  const json = JSON.stringify({ prompts }, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
}

/**
 * Imports and validates prompt library from JSON
 * 
 * @param {string} jsonString - JSON string to import
 * @returns {Object} { success: boolean, prompts?: Array, error?: string }
 */
export function importPromptLibrary(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    // Validate structure
    if (!data.prompts || !Array.isArray(data.prompts)) {
      return {
        success: false,
        error: 'Invalid format: missing "prompts" array',
      };
    }

    // Basic validation
    const hasRequiredFields = data.prompts.every(p => 
      p.id && p.text && p.contexts && p.criteria
    );

    if (!hasRequiredFields) {
      return {
        success: false,
        error: 'Invalid format: some prompts missing required fields (id, text, contexts, criteria)',
      };
    }

    return {
      success: true,
      prompts: data.prompts,
    };
  } catch (error) {
    return {
      success: false,
      error: `Parse error: ${error.message}`,
    };
  }
}

// ============================================================================
// SAMPLE TRAIT DATA
// ============================================================================

/**
 * Sample trait data presets for testing
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
      },
      mindfulness: {
        mindfulnessLevel: 'MODERATE_MINDFULNESS',
      },
      selfAcceptance: {
        level: 'DEVELOPING_SELF_ACCEPTANCE',
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
      },
      mindfulness: {
        mindfulnessLevel: 'MODERATE_MINDFULNESS',
      },
      selfAcceptance: {
        level: 'DEVELOPING_SELF_ACCEPTANCE',
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
      },
      mindfulness: {
        mindfulnessLevel: 'GOOD_MINDFULNESS',
      },
      selfAcceptance: {
        level: 'INTEGRATED_SELF_ACCEPTANCE',
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
      },
      selfAcceptance: {
        level: 'BEGINNING_SELF_ACCEPTANCE',
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
      },
      mindfulness: {
        mindfulnessLevel: 'MODERATE_MINDFULNESS',
      },
      selfAcceptance: {
        level: 'DEVELOPING_SELF_ACCEPTANCE',
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
    },
  },
};

/**
 * Creates empty trait data structure
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
    },
    mindfulness: {
      mindfulnessLevel: 'MODERATE_MINDFULNESS',
    },
    selfAcceptance: {
      level: 'DEVELOPING_SELF_ACCEPTANCE',
    },
  };
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
  
  selfAcceptanceLabels: ['low', 'moderate', 'high', 'god'],
  
  intensities: ['very_mild', 'mild', 'moderate', 'strong'],
};

/**
 * Gets available labels for a trait type
 * 
 * @param {string} traitType - Type of trait
 * @returns {Array<string>} Available labels
 */
export function getLabelsForTraitType(traitType) {
  switch (traitType) {
    case 'attachment':
      return EDITOR_OPTIONS.attachmentLabels;
    case 'loveLanguage':
      return EDITOR_OPTIONS.loveLanguageLabels;
    case 'mindfulness':
      return EDITOR_OPTIONS.mindfulnessLabels;
    case 'selfAcceptance':
      return EDITOR_OPTIONS.selfAcceptanceLabels;
    default:
      return [];
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
    criteria: {
      matchType: 'AND',
      traits: [],
    },
    priority: 5,
  };
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
  };
}

/**
 * Gets the next available ID
 * 
 * @param {Array} prompts - Current prompts
 * @returns {number} Next ID
 */
export function getNextId(prompts) {
  if (prompts.length === 0) return 1;
  return Math.max(...prompts.map(p => p.id)) + 1;
}

// ============================================================================
// DEBUGGING HELPERS
// ============================================================================

/**
 * Explains why a prompt matched or didn't match
 * 
 * @param {Object} prompt - Prompt to explain
 * @param {Object} traitData - User's trait data
 * @param {Object} mappedTraits - Mapped traits from mapTraitData()
 * @returns {Object} Explanation object
 */
export function explainMatch(prompt, traitData, mappedTraits) {
  const explanation = {
    promptId: prompt.id,
    promptText: prompt.text.en,
    universal: prompt.criteria.traits.length === 0,
    matchType: prompt.criteria.matchType,
    traitChecks: [],
    finalResult: false,
  };

  if (explanation.universal) {
    explanation.finalResult = true;
    return explanation;
  }

  for (const requiredTrait of prompt.criteria.traits) {
    const userTrait = mappedTraits[requiredTrait.type];
    
    const check = {
      traitType: requiredTrait.type,
      required: {
        labels: requiredTrait.labels || 'any',
        intensities: requiredTrait.intensities || 'any',
      },
      user: userTrait ? {
        label: userTrait.label,
        intensity: userTrait.intensity || 'none',
      } : null,
      matches: false,
      reason: '',
    };

    if (!userTrait) {
      check.reason = `User doesn't have ${requiredTrait.type} trait`;
    } else {
      // Check labels
      if (requiredTrait.labels && requiredTrait.labels.length > 0) {
        if (!requiredTrait.labels.includes(userTrait.label)) {
          check.reason = `Label mismatch: need ${requiredTrait.labels.join(' or ')}, have ${userTrait.label}`;
        }
      }

      // Check intensities
      if (requiredTrait.intensities && requiredTrait.intensities.length > 0) {
        if (!userTrait.intensity || !requiredTrait.intensities.includes(userTrait.intensity)) {
          check.reason = `Intensity mismatch: need ${requiredTrait.intensities.join(' or ')}, have ${userTrait.intensity || 'none'}`;
        }
      }

      // If no reason set, it matches
      if (!check.reason) {
        check.matches = true;
        check.reason = '✓ Match';
      }
    }

    explanation.traitChecks.push(check);
  }

  // Calculate final result based on match type
  const matchCount = explanation.traitChecks.filter(c => c.matches).length;
  
  if (prompt.criteria.matchType === 'AND') {
    explanation.finalResult = matchCount === explanation.traitChecks.length;
  } else {
    explanation.finalResult = matchCount > 0;
  }

  return explanation;
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
};
