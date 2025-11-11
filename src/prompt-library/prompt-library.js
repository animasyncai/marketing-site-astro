/**
 * Prompt Library Core Module
 * 
 * This module provides the core functionality for filtering and matching
 * reflection prompts based on user traits and context.
 * 
 * Usage:
 * ```js
 * import { getRelevantPrompts, filterAndSortPrompts } from './prompt-library.js';
 * 
 * const prompts = getRelevantPrompts(traitData, 'Couple', 'en');
 * const filtered = filterAndSortPrompts(prompts, traitData);
 * ```
 */

// ============================================================================
// TRAIT MAPPING
// ============================================================================

/**
 * Maps internal trait system labels to prompt library labels
 */
const TRAIT_MAPPING = {
  attachment: {
    AVOIDANT: 'avoidant',
    ANXIOUS: 'anxious',
    SECURE: 'secure',
    DISORGANIZED: 'disorganized',
  },
  loveLanguage: {
    QUALITY_TIME: 'time',
    WORDS_OF_AFFIRMATION: 'words',
    ACTS_OF_SERVICE: 'acts',
    PHYSICAL_TOUCH: 'touch',
    GIFTS: 'gifts',
  },
  intensity: {
    VERY_MILD: 'very_mild',
    MILD: 'mild',
    MODERATE: 'moderate',
    STRONG: 'strong',
  },
  mindfulness: {
    LOW_MINDFULNESS: 'low',
    MODERATE_MINDFULNESS: 'moderate',
    GOOD_MINDFULNESS: 'high',
  },
  selfAcceptance: {
    BEGINNING_SELF_ACCEPTANCE: 'low',
    DEVELOPING_SELF_ACCEPTANCE: 'moderate',
    GROWING_SELF_ACCEPTANCE: 'high',
    INTEGRATED_SELF_ACCEPTANCE: 'god', // 😄
  },
};

/**
 * Maps user trait data to prompt library format
 * 
 * @param {Object} traitData - User's trait data from Withinly
 * @returns {Object} Mapped traits for prompt matching
 * 
 * Example input:
 * {
 *   attachmentType: { primary: "AVOIDANT", primaryIntensity: "MODERATE" },
 *   loveLanguage: { primary: "QUALITY_TIME" },
 *   mindfulness: { mindfulnessLevel: "MODERATE_MINDFULNESS" },
 *   selfAcceptance: { level: "DEVELOPING_SELF_ACCEPTANCE" }
 * }
 * 
 * Example output:
 * {
 *   attachment: { label: "avoidant", intensity: "moderate" },
 *   loveLanguage: { label: "time" },
 *   mindfulness: { label: "moderate" },
 *   selfAcceptance: { label: "moderate" }
 * }
 */
export function mapTraitData(traitData) {
  const mapped = {};

  // Map attachment
  if (traitData.attachmentType?.primary) {
    mapped.attachment = {
      label: TRAIT_MAPPING.attachment[traitData.attachmentType.primary],
      intensity: traitData.attachmentType.primaryIntensity
        ? TRAIT_MAPPING.intensity[traitData.attachmentType.primaryIntensity]
        : undefined,
    };
  }

  // Map love language
  if (traitData.loveLanguage?.primary) {
    mapped.loveLanguage = {
      label: TRAIT_MAPPING.loveLanguage[traitData.loveLanguage.primary],
    };
  }

  // Map mindfulness
  if (traitData.mindfulness?.mindfulnessLevel) {
    mapped.mindfulness = {
      label: TRAIT_MAPPING.mindfulness[traitData.mindfulness.mindfulnessLevel],
    };
  }

  // Map self-acceptance
  if (traitData.selfAcceptance?.level) {
    mapped.selfAcceptance = {
      label: TRAIT_MAPPING.selfAcceptance[traitData.selfAcceptance.level],
    };
  }

  return mapped;
}

// ============================================================================
// PROMPT FILTERING
// ============================================================================

/**
 * Checks if user's trait matches a prompt's trait requirement
 * 
 * @param {Object} userTrait - User's mapped trait { label, intensity }
 * @param {Object} promptTrait - Prompt's trait requirement
 * @returns {boolean} True if trait matches
 */
function matchesTrait(userTrait, promptTrait) {
  if (!userTrait) return false;

  // Check if label matches (if specified)
  if (promptTrait.labels && promptTrait.labels.length > 0) {
    if (!promptTrait.labels.includes(userTrait.label)) {
      return false;
    }
  }

  // Check if intensity matches (if specified)
  if (promptTrait.intensities && promptTrait.intensities.length > 0) {
    if (!userTrait.intensity || !promptTrait.intensities.includes(userTrait.intensity)) {
      return false;
    }
  }

  return true;
}

/**
 * Checks if user matches all prompt criteria
 * 
 * @param {Object} mappedTraits - User's mapped traits
 * @param {Object} criteria - Prompt's criteria
 * @returns {Object} { matches: boolean, matchedTraits: number }
 */
function matchesCriteria(mappedTraits, criteria) {
  if (!criteria.traits || criteria.traits.length === 0) {
    // Universal prompt - no trait requirements
    return { matches: true, matchedTraits: 0 };
  }

  const matchType = criteria.matchType || 'AND';
  let matchedCount = 0;

  for (const promptTrait of criteria.traits) {
    const userTrait = mappedTraits[promptTrait.type];
    const matches = matchesTrait(userTrait, promptTrait);

    if (matches) {
      matchedCount++;
    }

    if (matchType === 'AND' && !matches) {
      // AND logic: all must match
      return { matches: false, matchedTraits: matchedCount };
    }

    if (matchType === 'OR' && matches) {
      // OR logic: at least one must match
      return { matches: true, matchedTraits: matchedCount };
    }
  }

  if (matchType === 'AND') {
    // All traits matched
    return { matches: true, matchedTraits: matchedCount };
  } else {
    // OR logic: no traits matched
    return { matches: false, matchedTraits: 0 };
  }
}

/**
 * Gets all prompts relevant to the current context
 * Returns ALL prompts that match the context, regardless of trait matching
 * 
 * @param {Object} traitData - User's trait data (raw from Withinly)
 * @param {string} context - Current context: "You" | "Couple" | "Family"
 * @param {string} locale - Language code: "en" | "lt"
 * @param {Array} promptLibrary - Array of prompt objects
 * @returns {Array} All prompts matching context with locale text
 * 
 * Example output:
 * [
 *   { id: 1, text: "Something feels off...", contexts: [...], ... },
 *   { id: 2, text: "Help me understand...", contexts: [...], ... },
 * ]
 */
export function getRelevantPrompts(traitData, context, locale, promptLibrary) {
  return promptLibrary
    .filter(prompt => prompt.contexts.includes(context))
    .map(prompt => ({
      ...prompt,
      text: prompt.text[locale] || prompt.text.en, // Fallback to English
    }));
}

/**
 * Filters and sorts prompts based on trait matching and priority
 * Adds display metadata like badges and relevance scores
 * 
 * @param {Array} prompts - Prompts from getRelevantPrompts()
 * @param {Object} traitData - User's trait data (raw from Withinly)
 * @returns {Array} Sorted prompts with display metadata
 * 
 * Example output:
 * [
 *   { 
 *     id: 4, 
 *     text: "Why do I need so much reassurance?",
 *     isHighPriority: true,  // Show ✨ badge
 *     relevanceScore: 0.95,
 *     matchedTraits: 2,
 *     ...originalPromptData
 *   },
 * ]
 */
export function filterAndSortPrompts(prompts, traitData) {
  const mappedTraits = mapTraitData(traitData);

  const enrichedPrompts = prompts.map(prompt => {
    const { matches, matchedTraits } = matchesCriteria(mappedTraits, prompt.criteria);
    
    // Calculate relevance score
    // Universal prompts (no criteria) get base priority
    // Trait-matched prompts get priority + bonus for number of matched traits
    const baseRelevance = prompt.priority || 5;
    const traitBonus = matchedTraits * 2;
    const relevanceScore = matches && matchedTraits > 0 
      ? baseRelevance + traitBonus 
      : baseRelevance;

    // High priority badge if:
    // - Matches at least 1 trait with high intensity or multiple traits
    const isHighPriority = matches && matchedTraits > 0;

    return {
      ...prompt,
      matches,
      matchedTraits,
      relevanceScore,
      isHighPriority,
    };
  });

  // Sort by relevance score (highest first)
  return enrichedPrompts.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validates a prompt object structure
 * 
 * @param {Object} prompt - Prompt to validate
 * @returns {Object} { valid: boolean, errors: Array<string> }
 */
export function validatePrompt(prompt) {
  const errors = [];

  // Required fields
  if (!prompt.id) errors.push('Missing id');
  if (!prompt.text) errors.push('Missing text');
  if (!prompt.contexts || !Array.isArray(prompt.contexts)) {
    errors.push('Missing or invalid contexts');
  }
  if (!prompt.criteria) errors.push('Missing criteria');

  // Text translations
  if (prompt.text) {
    if (!prompt.text.en) errors.push('Missing English translation');
    if (!prompt.text.lt) errors.push('Missing Lithuanian translation');
  }

  // Contexts validation
  if (prompt.contexts) {
    const validContexts = ['You', 'Couple', 'Family'];
    const invalidContexts = prompt.contexts.filter(c => !validContexts.includes(c));
    if (invalidContexts.length > 0) {
      errors.push(`Invalid contexts: ${invalidContexts.join(', ')}`);
    }
  }

  // Criteria validation
  if (prompt.criteria) {
    if (prompt.criteria.matchType && !['AND', 'OR'].includes(prompt.criteria.matchType)) {
      errors.push('Invalid matchType (must be AND or OR)');
    }

    if (prompt.criteria.traits) {
      prompt.criteria.traits.forEach((trait, index) => {
        if (!trait.type) {
          errors.push(`Trait ${index}: Missing type`);
        }
        const validTypes = ['attachment', 'loveLanguage', 'mindfulness', 'selfAcceptance'];
        if (trait.type && !validTypes.includes(trait.type)) {
          errors.push(`Trait ${index}: Invalid type "${trait.type}"`);
        }
      });
    }
  }

  // Priority validation
  if (prompt.priority && (prompt.priority < 1 || prompt.priority > 10)) {
    errors.push('Priority must be between 1 and 10');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates entire prompt library
 * 
 * @param {Array} promptLibrary - Array of prompts
 * @returns {Object} { valid: boolean, errors: Array<{ id, errors }> }
 */
export function validatePromptLibrary(promptLibrary) {
  const allErrors = [];

  promptLibrary.forEach(prompt => {
    const validation = validatePrompt(prompt);
    if (!validation.valid) {
      allErrors.push({
        id: prompt.id,
        errors: validation.errors,
      });
    }
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  mapTraitData,
  getRelevantPrompts,
  filterAndSortPrompts,
  validatePrompt,
  validatePromptLibrary,
  TRAIT_MAPPING,
};
