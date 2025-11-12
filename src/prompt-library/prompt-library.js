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
// CATEGORIES
// ============================================================================

/**
 * Base categories for prompts with translations
 */
export const PROMPT_CATEGORIES = {
  reflection: {
    en: 'Reflection',
    lt: 'Refleksija',
  },
  communication: {
    en: 'Communication',
    lt: 'Bendravimas',
  },
  selfAwareness: {
    en: 'Self-Awareness',
    lt: 'Savitikra',
  },
}

/**
 * Gets all available category keys
 * @returns {Array<string>} Array of category keys
 */
export function getCategoryKeys() {
  return Object.keys(PROMPT_CATEGORIES)
}

/**
 * Gets category label in specified locale
 * @param {string} categoryKey - Category key (e.g., 'reflection')
 * @param {string} locale - Language code: 'en' | 'lt'
 * @returns {string} Category label
 */
export function getCategoryLabel(categoryKey, locale = 'en') {
  return PROMPT_CATEGORIES[categoryKey]?.[locale] || PROMPT_CATEGORIES[categoryKey]?.en || categoryKey
}

/**
 * Filters prompts by categories
 * @param {Array} prompts - Array of prompt objects
 * @param {Array<string>} categoryKeys - Array of category keys to filter by (empty = all)
 * @returns {Array} Filtered prompts
 */
export function filterPromptsByCategory(prompts, categoryKeys = []) {
  if (!categoryKeys || categoryKeys.length === 0) {
    return prompts
  }

  return prompts.filter((prompt) => {
    const promptCategory = prompt.category
    if (!promptCategory) {
      // If no category filter is selected, include uncategorized prompts
      // If categories are selected, exclude uncategorized prompts
      return false
    }
    return categoryKeys.includes(promptCategory)
  })
}

/**
 * Groups prompts by category
 * @param {Array} prompts - Array of prompt objects
 * @param {string} locale - Language code for category labels
 * @returns {Object} Object with category keys as keys and arrays of prompts as values
 */
export function groupPromptsByCategory(prompts, locale = 'en') {
  const grouped = {}

  prompts.forEach((prompt) => {
    const categoryKey = prompt.category || 'uncategorized'
    const categoryLabel =
      categoryKey === 'uncategorized'
        ? locale === 'lt'
          ? 'Be kategorijos'
          : 'Uncategorized'
        : getCategoryLabel(categoryKey, locale)

    if (!grouped[categoryKey]) {
      grouped[categoryKey] = {
        key: categoryKey,
        label: categoryLabel,
        prompts: [],
      }
    }

    grouped[categoryKey].prompts.push(prompt)
  })

  return grouped
}

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
  mindfulnessLevel: {
    LOW_MINDFULNESS: 'low',
    MODERATE_MINDFULNESS: 'moderate',
    GOOD_MINDFULNESS: 'high',
  },
  awarenessLevel: {
    LOW_SELF_AWARENESS: 'low',
    MODERATE_SELF_AWARENESS: 'moderate',
    GOOD_SELF_AWARENESS: 'high',
  },
  selfAcceptanceLevel: {
    BEGINNING_SELF_ACCEPTANCE: 'low',
    DEVELOPING_SELF_ACCEPTANCE: 'moderate',
    GROWING_SELF_ACCEPTANCE: 'high',
    INTEGRATED_SELF_ACCEPTANCE: 'god',
  },
  opennessToChange: {
    RESISTANT: 'resistant',
    MIXED_FEELINGS: 'mixed',
    OPEN: 'open',
    EAGER: 'eager',
  },
}

/**
 * Maps user trait data to prompt library format
 *
 * @param {Object} traitData - User's trait data from Withinly
 * @returns {Object} Mapped traits for prompt matching
 *
 * Example input:
 * {
 *   attachmentType: {
 *     primary: "AVOIDANT",
 *     secondary: "SECURE",
 *     primaryIntensity: "MODERATE",
 *     secondaryIntensity: "MODERATE",
 *     // ... other fields preserved
 *   },
 *   loveLanguage: {
 *     primary: "QUALITY_TIME",
 *     secondary: "PHYSICAL_TOUCH",
 *     // ... other fields preserved
 *   },
 *   mindfulness: {
 *     mindfulnessLevel: "MODERATE_MINDFULNESS",
 *     awarenessLevel: "GOOD_SELF_AWARENESS",
 *     // ... other fields preserved
 *   },
 *   selfAcceptance: {
 *     level: "DEVELOPING_SELF_ACCEPTANCE",
 *     opennessToChange: "MIXED_FEELINGS",
 *     // ... other fields preserved
 *   }
 * }
 *
 * Example output:
 * {
 *   attachment: {
 *     primary: { label: "avoidant", intensity: "moderate" },
 *     secondary: { label: "secure", intensity: "moderate" }
 *   },
 *   loveLanguage: {
 *     primary: { label: "time" },
 *     secondary: { label: "touch" }
 *   },
 *   mindfulness: {
 *     mindfulness: { label: "moderate" },
 *     awareness: { label: "high" }
 *   },
 *   selfAcceptance: {
 *     level: { label: "moderate" },
 *     openness: { label: "mixed" }
 *   }
 * }
 */
export function mapTraitData(traitData) {
  const mapped = {}

  // Map attachment (supports primary and secondary)
  if (traitData.attachmentType?.primary) {
    mapped.attachment = {
      primary: {
        label: TRAIT_MAPPING.attachment[traitData.attachmentType.primary],
        intensity: traitData.attachmentType.primaryIntensity
          ? TRAIT_MAPPING.intensity[traitData.attachmentType.primaryIntensity]
          : undefined,
      },
    }

    // Add secondary if present
    if (traitData.attachmentType.secondary) {
      mapped.attachment.secondary = {
        label: TRAIT_MAPPING.attachment[traitData.attachmentType.secondary],
        intensity: traitData.attachmentType.secondaryIntensity
          ? TRAIT_MAPPING.intensity[traitData.attachmentType.secondaryIntensity]
          : undefined,
      }
    }
  }

  // Map love language (supports primary and secondary)
  if (traitData.loveLanguage?.primary) {
    mapped.loveLanguage = {
      primary: {
        label: TRAIT_MAPPING.loveLanguage[traitData.loveLanguage.primary],
      },
    }

    // Add secondary if present
    if (traitData.loveLanguage.secondary) {
      mapped.loveLanguage.secondary = {
        label: TRAIT_MAPPING.loveLanguage[traitData.loveLanguage.secondary],
      }
    }
  }

  // Map mindfulness (supports mindfulnessLevel and awarenessLevel)
  if (traitData.mindfulness) {
    mapped.mindfulness = {}

    if (traitData.mindfulness.mindfulnessLevel) {
      mapped.mindfulness.mindfulness = {
        label: TRAIT_MAPPING.mindfulnessLevel[traitData.mindfulness.mindfulnessLevel],
      }
    }

    if (traitData.mindfulness.awarenessLevel) {
      mapped.mindfulness.awareness = {
        label: TRAIT_MAPPING.awarenessLevel[traitData.mindfulness.awarenessLevel],
      }
    }
  }

  // Map self-acceptance (supports level and opennessToChange)
  if (traitData.selfAcceptance) {
    mapped.selfAcceptance = {}

    if (traitData.selfAcceptance.level) {
      mapped.selfAcceptance.level = {
        label: TRAIT_MAPPING.selfAcceptanceLevel[traitData.selfAcceptance.level],
      }
    }

    if (traitData.selfAcceptance.opennessToChange) {
      mapped.selfAcceptance.openness = {
        label: TRAIT_MAPPING.opennessToChange[traitData.selfAcceptance.opennessToChange],
      }
    }
  }

  return mapped
}

// ============================================================================
// PROMPT FILTERING
// ============================================================================

/**
 * Checks if user's trait matches a prompt's trait requirement
 * Supports multiple structures:
 * - attachment, loveLanguage: .primary and .secondary
 * - mindfulness: .mindfulness and .awareness
 * - selfAcceptance: .level and .openness
 *
 * @param {Object} userTrait - User's mapped trait
 * @param {Object} promptTrait - Prompt's trait requirement
 * @returns {Object} { matches: boolean, matchType: 'primary' | 'secondary' | 'basic' | null }
 */
function matchesTrait(userTrait, promptTrait) {
  if (!userTrait) return { matches: false, matchType: null }

  // Helper to check a single trait value against requirements
  const checkTraitValue = (traitValue) => {
    if (!traitValue) return false

    // Check if label matches (if specified)
    if (promptTrait.labels && promptTrait.labels.length > 0) {
      if (!promptTrait.labels.includes(traitValue.label)) {
        return false
      }
    }

    // Check if intensity matches (if specified and trait has intensity)
    if (promptTrait.intensities && promptTrait.intensities.length > 0) {
      if (!traitValue.intensity || !promptTrait.intensities.includes(traitValue.intensity)) {
        return false
      }
    }

    return true
  }

  // Check if this is a trait with primary/secondary structure (attachment, loveLanguage)
  if (userTrait.primary) {
    // Check primary first
    if (checkTraitValue(userTrait.primary)) {
      return { matches: true, matchType: 'primary' }
    }

    // If primary doesn't match, check secondary (if present)
    if (userTrait.secondary && checkTraitValue(userTrait.secondary)) {
      return { matches: true, matchType: 'secondary' }
    }

    return { matches: false, matchType: null }
  }

  // Check if this is mindfulness with .mindfulness and .awareness
  // For mindfulness, .mindfulness is considered primary, .awareness is secondary
  if (userTrait.mindfulness || userTrait.awareness) {
    // Check mindfulness level (primary)
    if (userTrait.mindfulness && checkTraitValue(userTrait.mindfulness)) {
      return { matches: true, matchType: 'primary' }
    }

    // Check awareness level (secondary)
    if (userTrait.awareness && checkTraitValue(userTrait.awareness)) {
      return { matches: true, matchType: 'secondary' }
    }

    return { matches: false, matchType: null }
  }

  // Check if this is selfAcceptance with .level and .openness
  // For selfAcceptance, .level is considered primary, .openness is secondary
  if (userTrait.level || userTrait.openness) {
    // Check acceptance level (primary)
    if (userTrait.level && checkTraitValue(userTrait.level)) {
      return { matches: true, matchType: 'primary' }
    }

    // Check openness to change (secondary)
    if (userTrait.openness && checkTraitValue(userTrait.openness)) {
      return { matches: true, matchType: 'secondary' }
    }

    return { matches: false, matchType: null }
  }

  // Fallback for simple structure (shouldn't reach here with new structure)
  const matches = checkTraitValue(userTrait)
  return { matches, matchType: matches ? 'basic' : null }
}

/**
 * Checks if user matches all prompt criteria
 *
 * @param {Object} mappedTraits - User's mapped traits
 * @param {Object} criteria - Prompt's criteria
 * @returns {Object} { matches: boolean, matchedTraits: number, hasPrimaryMatch: boolean, hasSecondaryMatch: boolean }
 */
function matchesCriteria(mappedTraits, criteria) {
  if (!criteria.traits || criteria.traits.length === 0) {
    // Universal prompt - no trait requirements
    return { matches: true, matchedTraits: 0, hasPrimaryMatch: false, hasSecondaryMatch: false }
  }

  const matchType = criteria.matchType || 'AND'
  let matchedCount = 0
  let hasPrimaryMatch = false
  let hasSecondaryMatch = false

  for (const promptTrait of criteria.traits) {
    const userTrait = mappedTraits[promptTrait.type]
    const { matches, matchType: traitMatchType } = matchesTrait(userTrait, promptTrait)

    if (matches) {
      matchedCount++
      if (traitMatchType === 'primary') {
        hasPrimaryMatch = true
      } else if (traitMatchType === 'secondary') {
        hasSecondaryMatch = true
      }
    }

    if (matchType === 'AND' && !matches) {
      // AND logic: all must match
      return { matches: false, matchedTraits: matchedCount, hasPrimaryMatch, hasSecondaryMatch }
    }

    if (matchType === 'OR' && matches) {
      // OR logic: at least one must match
      return { matches: true, matchedTraits: matchedCount, hasPrimaryMatch, hasSecondaryMatch }
    }
  }

  if (matchType === 'AND') {
    // All traits matched
    return { matches: true, matchedTraits: matchedCount, hasPrimaryMatch, hasSecondaryMatch }
  } else {
    // OR logic: no traits matched
    return { matches: false, matchedTraits: 0, hasPrimaryMatch: false, hasSecondaryMatch: false }
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
export function getRelevantPrompts(traitData, context, locale, promptLibrary, categoryKeys = []) {
  let filtered = promptLibrary.filter((prompt) => prompt.contexts.includes(context))

  // Apply category filter if provided
  if (categoryKeys && categoryKeys.length > 0) {
    filtered = filterPromptsByCategory(filtered, categoryKeys, locale)
  }

  return filtered.map((prompt) => ({
    ...prompt,
    text: prompt.text[locale] || prompt.text.en, // Fallback to English
  }))
}

/**
 * Filters and sorts prompts based on trait matching and priority
 * Adds display metadata like badges and relevance scores
 * Prioritization: Primary matches > Secondary matches > Basic (universal) > Priority score
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
 *     isPrimaryMatch: true,      // Show 🌟 badge
 *     isSecondaryMatch: false,
 *     relevanceScore: 0.95,
 *     matchedTraits: 2,
 *     ...originalPromptData
 *   },
 * ]
 */
export function filterAndSortPrompts(prompts, traitData) {
  const mappedTraits = mapTraitData(traitData)

  const enrichedPrompts = prompts.map((prompt) => {
    const { matches, matchedTraits, hasPrimaryMatch, hasSecondaryMatch } = matchesCriteria(
      mappedTraits,
      prompt.criteria,
    )

    // Calculate relevance score
    // Universal prompts (no criteria) get base priority
    // Trait-matched prompts get priority + bonus for number of matched traits
    const baseRelevance = prompt.priority || 5
    const traitBonus = matchedTraits * 2
    const relevanceScore = matches && matchedTraits > 0 ? baseRelevance + traitBonus : baseRelevance

    // Determine match type flags
    const isPrimaryMatch = matches && hasPrimaryMatch
    const isSecondaryMatch = matches && hasSecondaryMatch && !hasPrimaryMatch

    return {
      ...prompt,
      matches,
      matchedTraits,
      relevanceScore,
      isPrimaryMatch,
      isSecondaryMatch,
      // Legacy support - keep isHighPriority for backwards compatibility
      isHighPriority: isPrimaryMatch || isSecondaryMatch,
    }
  })

  // Sort by priority: Primary > Secondary > Basic (universal) > Priority score
  return enrichedPrompts.sort((a, b) => {
    // Primary matches first
    if (a.isPrimaryMatch && !b.isPrimaryMatch) return -1
    if (!a.isPrimaryMatch && b.isPrimaryMatch) return 1

    // Secondary matches second
    if (a.isSecondaryMatch && !b.isSecondaryMatch) return -1
    if (!a.isSecondaryMatch && b.isSecondaryMatch) return 1

    // Then by relevance score (highest first)
    return b.relevanceScore - a.relevanceScore
  })
}

// ============================================================================
// TOP RECOMMENDATIONS
// ============================================================================

/**
 * Gets top N most relevant prompts based on user traits
 * Returns the most relevant prompts regardless of category
 *
 * @param {Object} traitData - User's trait data (raw from Withinly)
 * @param {string} context - Current context: "You" | "Couple" | "Family"
 * @param {string} locale - Language code: "en" | "lt"
 * @param {Array} promptLibrary - Array of prompt objects
 * @param {number} limit - Number of top prompts to return (default: 3)
 * @returns {Array} Top N most relevant prompts, sorted by priority
 *
 * Example output:
 * [
 *   {
 *     id: 4,
 *     text: "Why do I need so much reassurance?",
 *     isPrimaryMatch: true,      // Show 🌟 badge
 *     isSecondaryMatch: false,
 *     relevanceScore: 13,
 *     matchedTraits: 1,
 *     ...originalPromptData
 *   },
 *   {
 *     id: 5,
 *     text: "Why do I pull away when things get close?",
 *     isPrimaryMatch: false,
 *     isSecondaryMatch: true,    // Show ⭐ badge
 *     relevanceScore: 11,
 *     matchedTraits: 1,
 *     ...originalPromptData
 *   },
 * ]
 */
export function getTopRelevantPrompts(traitData, context, locale, promptLibrary, limit = 3) {
  // Get all relevant prompts for the context
  const relevant = getRelevantPrompts(traitData, context, locale, promptLibrary)

  // Filter and sort by trait matching
  const filtered = filterAndSortPrompts(relevant, traitData)

  // Return top N prompts
  return filtered.slice(0, limit)
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
  const errors = []

  // Required fields
  if (!prompt.id) errors.push('Missing id')
  if (!prompt.text) errors.push('Missing text')
  if (!prompt.contexts || !Array.isArray(prompt.contexts)) {
    errors.push('Missing or invalid contexts')
  }
  if (!prompt.criteria) errors.push('Missing criteria')

  // Text translations
  if (prompt.text) {
    if (!prompt.text.en) errors.push('Missing English translation')
    if (!prompt.text.lt) errors.push('Missing Lithuanian translation')
  }

  // Contexts validation
  if (prompt.contexts) {
    const validContexts = ['You', 'Couple', 'Family']
    const invalidContexts = prompt.contexts.filter((c) => !validContexts.includes(c))
    if (invalidContexts.length > 0) {
      errors.push(`Invalid contexts: ${invalidContexts.join(', ')}`)
    }
  }

  // Category validation
  if (prompt.category) {
    const validCategories = getCategoryKeys()
    if (!validCategories.includes(prompt.category)) {
      errors.push(`Invalid category: "${prompt.category}" (must be one of: ${validCategories.join(', ')})`)
    }
  }

  // Criteria validation
  if (prompt.criteria) {
    if (prompt.criteria.matchType && !['AND', 'OR'].includes(prompt.criteria.matchType)) {
      errors.push('Invalid matchType (must be AND or OR)')
    }

    if (prompt.criteria.traits) {
      prompt.criteria.traits.forEach((trait, index) => {
        if (!trait.type) {
          errors.push(`Trait ${index}: Missing type`)
        }
        const validTypes = ['attachment', 'loveLanguage', 'mindfulness', 'selfAcceptance']
        if (trait.type && !validTypes.includes(trait.type)) {
          errors.push(`Trait ${index}: Invalid type "${trait.type}"`)
        }
      })
    }
  }

  // Priority validation
  if (prompt.priority && (prompt.priority < 1 || prompt.priority > 10)) {
    errors.push('Priority must be between 1 and 10')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validates entire prompt library
 *
 * @param {Array} promptLibrary - Array of prompts
 * @returns {Object} { valid: boolean, errors: Array<{ id, errors }> }
 */
export function validatePromptLibrary(promptLibrary) {
  const allErrors = []

  promptLibrary.forEach((prompt) => {
    const validation = validatePrompt(prompt)
    if (!validation.valid) {
      allErrors.push({
        id: prompt.id,
        errors: validation.errors,
      })
    }
  })

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  mapTraitData,
  getRelevantPrompts,
  filterAndSortPrompts,
  getTopRelevantPrompts,
  validatePrompt,
  validatePromptLibrary,
  TRAIT_MAPPING,
  PROMPT_CATEGORIES,
  getCategoryKeys,
  getCategoryLabel,
  filterPromptsByCategory,
  groupPromptsByCategory,
}

// ============================================================================
// RECOMMENDED PROMPTS
// ============================================================================
//
// To get the top 3 most relevant prompts for a user:
//
// ```js
// import { getTopRelevantPrompts } from './prompt-library.js';
// import promptData from './prompt-library/data/prompt-library.json';
//
// const topPrompts = getTopRelevantPrompts(
//   userTraits,
//   'Couple',  // or 'You' | 'Family'
//   'en',      // or 'lt'
//   promptData.prompts,
//   3          // optional, defaults to 3
// );
//
// // Display with badges:
// topPrompts.forEach(prompt => {
//   const badge = prompt.isPrimaryMatch ? '🌟' :
//                 prompt.isSecondaryMatch ? '⭐' : '';
//   console.log(`${badge} ${prompt.text}`);
// });
// ```
//
// Prioritization order:
// 1. Primary trait matches (🌟 glowing star)
// 2. Secondary trait matches (⭐ regular star)
// 3. Universal prompts (no trait requirements)
// 4. Priority score (within each group)
//
