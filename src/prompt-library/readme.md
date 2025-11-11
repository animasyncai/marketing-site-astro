# Prompt Library System - Technical Documentation

## Overview

A trait-based prompt filtering system for Withinly's Reflection Companion chat feature. Filters and prioritizes reflection prompts based on user's psychological traits (attachment, love language, mindfulness, self-acceptance) and conversation context.

## Architecture

```
src/prompt-library/
├── data/prompt-library.json          # Prompt definitions (editable via editor UI)
├── prompt-library.js                 # Core filtering logic (production module)
└── prompt-library-demo.js            # Testing/editing utilities

src/pages/
├── prompt-library.astro              # Testing page (trait simulation + debugging)
└── prompt-library-editor.astro       # Editor page (CRUD + validation)
```

## Data Flow

```
User Trait Data (Withinly format)
    ↓
mapTraitData() - converts to internal format
    ↓
getRelevantPrompts() - filters by context (You/Couple/Family)
    ↓
filterAndSortPrompts() - matches traits, adds badges, sorts by relevance
    ↓
Render prompts with ✨ badges for high-priority matches
```

## Core Integration (3 Lines)

```javascript
import { getRelevantPrompts, filterAndSortPrompts } from './prompt-library/prompt-library.js'
import promptData from './prompt-library/data/prompt-library.json'

// In your chat component:
const relevant = getRelevantPrompts(userTraits, context, locale, promptData.prompts)
const filtered = filterAndSortPrompts(relevant, userTraits)
// filtered = array of prompts, sorted by relevance, with .isHighPriority flag for ✨ badges
```

## Trait Data Format

### Input Format (Withinly)

```javascript
{
  attachmentType: {
    primary: "AVOIDANT",              // ANXIOUS | AVOIDANT | SECURE | DISORGANIZED
    secondary: "SECURE",              // optional
    primaryIntensity: "MODERATE",     // VERY_MILD | MILD | MODERATE | STRONG
    secondaryIntensity: "MODERATE",   // optional
    // subscores, detectedPatterns, behavioralProfile - ignored but preserved for future use
  },
  loveLanguage: {
    primary: "QUALITY_TIME",          // QUALITY_TIME | WORDS_OF_AFFIRMATION | ACTS_OF_SERVICE | PHYSICAL_TOUCH | GIFTS
    secondary: "PHYSICAL_TOUCH",      // optional
    // additional fields preserved for future use
  },
  mindfulness: {
    mindfulnessLevel: "MODERATE_MINDFULNESS",  // LOW_MINDFULNESS | MODERATE_MINDFULNESS | GOOD_MINDFULNESS
    // subscores, detectedPatterns - ignored but preserved
  },
  selfAcceptance: {
    level: "DEVELOPING_SELF_ACCEPTANCE",  // BEGINNING_SELF_ACCEPTANCE | DEVELOPING_SELF_ACCEPTANCE | GROWING_SELF_ACCEPTANCE | INTEGRATED_SELF_ACCEPTANCE
    // subscores, detectedPatterns - ignored but preserved
  }
}
```

### Mapped Format (Internal)

```javascript
{
  attachment: {
    primary: { label: "avoidant", intensity: "moderate" },
    secondary: { label: "secure", intensity: "moderate" }  // optional
  },
  loveLanguage: {
    primary: { label: "time" },
    secondary: { label: "touch" }  // optional
  },
  mindfulness: { label: "moderate" },
  selfAcceptance: { label: "moderate" }
}
```

## Prompt Structure

```javascript
{
  id: 4,
  text: {
    en: "Why do I need so much reassurance from my partner?",
    lt: "Kodėl man reikia tiek daug partnero patvirtinimo?"
  },
  contexts: ["Couple"],                    // "You" | "Couple" | "Family"
  category: "communication",               // optional: "reflection" | "communication" | "selfAwareness"
  criteria: {
    matchType: "AND",                      // "AND" | "OR"
    traits: [
      {
        type: "attachment",                // attachment | loveLanguage | mindfulness | selfAcceptance
        labels: ["anxious"],               // matches primary OR secondary
        intensities: ["moderate", "strong"] // optional: only show if intensity matches
      }
    ]
  },
  priority: 9  // 1-10, base relevance score
}
```

## Matching Logic

### Primary/Secondary Support

- Attachment and love language support **primary and secondary** traits
- A prompt matches if EITHER primary OR secondary satisfies requirements
- Example: User has `primary: AVOIDANT, secondary: SECURE`
  - Prompt requiring `["avoidant"]` → ✅ matches (primary)
  - Prompt requiring `["secure"]` → ✅ matches (secondary)
  - Prompt requiring `["anxious"]` → ❌ no match

### Match Types

- **AND**: All specified traits must match
- **OR**: At least one trait must match
- **Universal** (empty traits array): Always matches

### Relevance Scoring

```javascript
relevanceScore = priority + matchedTraits * 2
isHighPriority = matches && matchedTraits > 0
```

## API Reference

### `getRelevantPrompts(traitData, context, locale, promptLibrary, categoryKeys = [])`

Returns all prompts matching the context, with localized text. Optionally filters by categories.

- **traitData**: Withinly trait object
- **context**: "You" | "Couple" | "Family"
- **locale**: "en" | "lt" (falls back to EN if missing)
- **promptLibrary**: Array of prompt objects
- **categoryKeys**: Optional array of category keys to filter by (empty = all)
- **Returns**: Array of prompts with `.text` as string

### `filterAndSortPrompts(prompts, traitData)`

Adds display metadata and sorts by relevance.

- **prompts**: Output from `getRelevantPrompts()`
- **traitData**: Withinly trait object
- **Returns**: Array with additional fields:
  - `.isHighPriority` (boolean) - Show ✨ badge
  - `.relevanceScore` (number) - For sorting
  - `.matchedTraits` (number) - How many traits matched
  - `.matches` (boolean) - Whether criteria matched

### `mapTraitData(traitData)`

Converts Withinly format to internal format. (Used internally, rarely needed externally)

### `validatePrompt(prompt)` / `validatePromptLibrary(library)`

Validates prompt structure. Used by editor UI.

### Category Functions

#### `getCategoryKeys()`

Returns array of all available category keys: `["reflection", "communication", "selfAwareness"]`

#### `getCategoryLabel(categoryKey, locale = 'en')`

Gets translated category label.

- **categoryKey**: Category key (e.g., "reflection")
- **locale**: "en" | "lt"
- **Returns**: Translated label string

#### `filterPromptsByCategory(prompts, categoryKeys = [])`

Filters prompts by category keys.

- **prompts**: Array of prompt objects
- **categoryKeys**: Array of category keys to filter by (empty = all)
- **Returns**: Filtered array of prompts

#### `groupPromptsByCategory(prompts, locale = 'en')`

Groups prompts by category for display.

- **prompts**: Array of prompt objects
- **locale**: Language code for category labels
- **Returns**: Object with category keys as keys, each containing `{ key, label, prompts: [] }`

## LocalStorage System

The editor page saves edits to `localStorage['prompt-library-edited']`. Both testing and editor pages automatically load from localStorage if edited version exists.

**Flow:**

1. User edits prompts in editor → auto-saves to localStorage
2. Testing page loads edited version (shows blue indicator)
3. User exports JSON → unsaved changes indicator clears
4. Deploy: Replace `prompt-library.json` with exported file

**Reset:** Click "Reset to Default" to discard localStorage and use default prompts.

## Content Management Workflow

1. **Edit**: Open `prompt-library-editor.astro`
2. **Add/Edit/Delete**: Use UI to manage prompts
3. **Validate**: Red warnings show validation errors
4. **Test**: Open `prompt-library.astro` to test filtering
5. **Export**: Click "Export JSON" when ready
6. **Deploy**: Replace `src/prompt-library/data/prompt-library.json`

## Categories

Prompts can optionally have a `category` field for organization and filtering:

- **reflection** - General reflection prompts
- **communication** - Communication-focused prompts
- **selfAwareness** - Self-awareness and mindfulness prompts

Categories support translations (en/lt) and can be used to filter prompts in both the editor and testing pages.

## Validation Rules

Prompts must have:

- ✅ Numeric ID
- ✅ `text.en` and `text.lt` translations
- ✅ At least one context
- ✅ Valid contexts: "You", "Couple", "Family"
- ✅ Valid matchType: "AND" or "OR"
- ✅ Valid trait types: "attachment", "loveLanguage", "mindfulness", "selfAcceptance"
- ✅ Priority 1-10
- ✅ Valid category (if provided): must be one of the defined category keys

## Testing

**Testing Page** (`prompt-library.astro`):

- Simulates different trait combinations (6 presets)
- Shows matched vs. total prompts
- Debug panel explains why each prompt matched/didn't match
- Displays mapped traits
- Tests context switching
- Tests language switching

**Key Test Cases:**

- Anxious attachment in Couple context → shows reassurance prompts
- Avoidant attachment → shows "pulling away" prompts
- Low mindfulness → shows awareness prompts
- Secondary traits matching → prompts appear for both primary and secondary
- Universal prompts → always visible

## Performance

- **Filtering**: O(n) where n = number of prompts (~15-50 typical)
- **No async operations**: Synchronous filtering
- **Bundle size**: ~8KB for 15 prompts + code
- **Memoization**: Recommended for React (`useMemo` on filtered prompts)

## Extensibility

### Adding New Traits

1. Add to `TRAIT_MAPPING` in `prompt-library.js`
2. Update `mapTraitData()` function
3. Update `EDITOR_OPTIONS` in `prompt-library-demo.js`
4. Add to editor UI dropdowns

### Adding New Languages

1. Add to prompt `text` objects: `text.es`, `text.de`, etc.
2. Update editor form with new textarea
3. Validation automatically checks all languages

### Adding Subscores/Advanced Matching

The current system ignores subscores but preserves them in input data. To use:

1. Extend `mapTraitData()` to map subscore fields
2. Update `matchesTrait()` to check subscore conditions
3. Add new criterion types to prompt structure

## Production Checklist

- [ ] Test with real user trait data
- [ ] Validate all prompts (editor shows warnings)
- [ ] Test context switching (You/Couple/Family)
- [ ] Test language fallback (missing translations)
- [ ] Test primary/secondary matching
- [ ] Export JSON from editor
- [ ] Replace default `prompt-library.json`
- [ ] Clear localStorage after deployment (users reset automatically)
- [ ] Monitor click-through rates per prompt

## Troubleshooting

**Prompts not showing:**

- Check context matches user's current context
- Check trait data is in correct format
- Use testing page to debug filtering
- Check browser console for errors

**Edited prompts not loading:**

- Ensure both pages use `loadPromptLibrary()` (not direct JSON import)
- Check `localStorage['prompt-library-edited']` exists
- Blue indicator should appear on testing page if using edited version

**Unsaved changes indicator stuck:**

- Export JSON to mark as saved
- Or click "Reset to Default" to clear

**Primary/secondary not working:**

- Ensure trait data has `.primary` and `.secondary` fields
- Check `mapTraitData()` output in testing page debug panel

## Dependencies

None. Pure JavaScript module, works with any framework (React, Vue, vanilla JS).

## Browser Support

- Modern browsers (ES6+)
- LocalStorage required for editor functionality
- Falls back gracefully if localStorage unavailable (uses default prompts)

---

**Version**: 1.2.0  
**Last Updated**: 2024-11-12  
**Status**: Production Ready

## Recent Updates (v1.2.0)

- ✅ Added category support with filtering and grouping
- ✅ Improved UI: checkboxes for filters and trait editing
- ✅ Enhanced prompt selector styling with color-coded badges
- ✅ Navigation links between testing and editor pages
- ✅ Full support for secondary traits (attachment, love language)
- ✅ Support for awareness levels (mindfulness) and openness to change (self-acceptance)
