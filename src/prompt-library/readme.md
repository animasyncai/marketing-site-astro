# Reflection Companion Prompt Library

A complete prompt library system for Withinly's Reflection Companion feature, with filtering, testing, and editing tools.

## 📁 File Structure

```
src/
├── prompt-library/
│   ├── data/
│   │   └── prompt-library.json          # Prompt data (15 starter prompts)
│   ├── prompt-library.js                # Core filtering/matching logic
│   └── prompt-library-demo.js           # Testing & editor utilities
└── pages/
    ├── prompt-library.astro             # Testing page
    └── prompt-library-editor.astro      # Editor page
```

## 🎯 What Was Created

### 1. Core Module (`prompt-library.js`)

Ready-to-use module for Withinly integration:

- **`mapTraitData(traitData)`** - Converts Withinly trait format to prompt format
- **`getRelevantPrompts(traitData, context, locale, promptLibrary)`** - Returns all context-matching prompts
- **`filterAndSortPrompts(prompts, traitData)`** - Adds badges, relevance scores, and sorting
- **`validatePrompt(prompt)`** - Validates individual prompts
- **`validatePromptLibrary(promptLibrary)`** - Validates entire library

### 2. Demo Utilities (`prompt-library-demo.js`)

Helper functions for testing and editing:

- **LocalStorage management** - Load, save, reset prompts
- **Import/Export** - JSON file handling
- **Sample trait data** - 6 presets for testing
- **Editor helpers** - CRUD operations
- **Debugging** - Match explanation logic

### 3. Testing Page (`prompt-library.astro`)

Comprehensive testing interface:

- Trait selector with presets
- Context selector (You/Couple/Family)
- Language toggle (EN/LT)
- Chat window mockup
- Prompt library panel
- Debug panel with match explanations
- Real-time filtering demonstration

### 4. Editor Page (`prompt-library-editor.astro`)

Full CRUD editor with:

- Add, edit, delete, duplicate prompts
- Multi-select for contexts and trait labels
- Validation warnings
- LocalStorage auto-save
- Unsaved changes indicator
- Import/Export JSON
- Reset to default button

### 5. Prompt Data (`prompt-library.json`)

15 starter prompts covering:

- **Universal** (3) - Always shown
- **Attachment-based** (2) - Anxious, Avoidant
- **Love Language-based** (3) - Words, Acts, Touch
- **Mindfulness-based** (2) - Low/Moderate awareness
- **Self-Acceptance-based** (2) - Self-criticism patterns
- **Multi-trait** (3) - AND/OR logic combinations

## 🚀 Integration into Withinly

### Step 1: Copy Files

```bash
# Copy to your Withinly project:
cp -r src/prompt-library/ YOUR_PROJECT/src/
cp src/pages/prompt-library*.astro YOUR_PROJECT/src/pages/
```

### Step 2: Use in Reflection Companion

```javascript
import { getRelevantPrompts, filterAndSortPrompts } from './prompt-library/prompt-library.js'
import promptLibraryData from './prompt-library/data/prompt-library.json'

// In your chat component:
function showPromptLibrary() {
  // Get user's trait data
  const userTraits = getUserTraitData() // Your existing function
  const context = getChatContext() // "You", "Couple", or "Family"
  const locale = getUserLocale() // "en" or "lt"

  // Get all relevant prompts
  const relevantPrompts = getRelevantPrompts(userTraits, context, locale, promptLibraryData.prompts)

  // Filter and sort with badges
  const prompts = filterAndSortPrompts(relevantPrompts, userTraits)

  // Render prompts
  prompts.forEach((prompt) => {
    renderPromptCard({
      text: prompt.text,
      isHighPriority: prompt.isHighPriority, // Show ✨ badge
      onClick: () => handlePromptClick(prompt.id, prompt.text),
    })
  })
}

function handlePromptClick(promptId, text) {
  // Your callback - populate chat input with text
  populateChatInput(text)
}
```

### Step 3: Styling Badges

```javascript
// High priority prompts get ✨ badge:
{
  prompt.isHighPriority && <span className="text-xl">✨</span>
}

// Or custom styling:
;<div className={prompt.isHighPriority ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'}>{prompt.text}</div>
```

## 📊 Data Structure

### Trait Data Input (from Withinly)

```javascript
{
  attachmentType: {
    primary: "AVOIDANT",
    primaryIntensity: "MODERATE"
  },
  loveLanguage: {
    primary: "QUALITY_TIME"
  },
  mindfulness: {
    mindfulnessLevel: "MODERATE_MINDFULNESS"
  },
  selfAcceptance: {
    level: "DEVELOPING_SELF_ACCEPTANCE"
  }
}
```

### Prompt Structure

```javascript
{
  id: 4,
  text: {
    en: "Why do I need so much reassurance from my partner?",
    lt: "Kodėl man reikia tiek daug partnero patvirtinimo?"
  },
  contexts: ["Couple"],
  criteria: {
    matchType: "AND", // or "OR"
    traits: [
      {
        type: "attachment",
        labels: ["anxious"],
        intensities: ["moderate", "strong"] // Optional
      }
    ]
  },
  priority: 9
}
```

### Output from filterAndSortPrompts()

```javascript
;[
  {
    id: 4,
    text: 'Why do I need so much reassurance?',
    isHighPriority: true, // Show ✨ badge
    relevanceScore: 13, // For sorting
    matchedTraits: 2, // How many traits matched
    matches: true, // Whether it matched criteria
    ...originalPromptData,
  },
]
```

## 🧪 Testing

### Using the Testing Page

1. Open `prompt-library.astro` in browser
2. Select trait presets or customize:
   - Attachment type & intensity
   - Love language
   - Mindfulness level
   - Self-acceptance level
3. Choose context (You/Couple/Family)
4. Click "Explore Prompts" to see filtered results
5. Check debug panel for match explanations

**Key Testing Scenarios:**

- Anxious Attacher in Couple context → sees reassurance prompts
- Avoidant Attacher in Couple context → sees "pulling away" prompts
- Low mindfulness → sees "slow down" prompts
- Universal prompts always show

### Using the Editor Page

1. Open `prompt-library-editor.astro` in browser
2. Edit existing prompts or add new ones
3. Changes save automatically to localStorage
4. Export JSON when ready to deploy
5. Import JSON to restore previous versions

## 🎨 Customization

### Adding New Prompts

```javascript
{
  id: 16, // Use next available ID
  text: {
    en: "Your English text here",
    lt: "Your Lithuanian text here"
  },
  contexts: ["You", "Couple"], // Can appear in multiple contexts
  criteria: {
    matchType: "AND", // All traits must match
    traits: [
      {
        type: "attachment",
        labels: ["anxious"],
        intensities: ["strong"] // Optional: only show if high intensity
      },
      {
        type: "mindfulness",
        labels: ["low"] // Must also have low mindfulness
      }
    ]
  },
  priority: 8 // 1-10, higher = more important
}
```

### Trait Mapping Reference

```javascript
// Attachment Types
AVOIDANT → "avoidant"
ANXIOUS → "anxious"
SECURE → "secure"
DISORGANIZED → "disorganized"

// Love Languages
QUALITY_TIME → "time"
WORDS_OF_AFFIRMATION → "words"
ACTS_OF_SERVICE → "acts"
PHYSICAL_TOUCH → "touch"
GIFTS → "gifts"

// Intensities
VERY_MILD → "very_mild"
MILD → "mild"
MODERATE → "moderate"
STRONG → "strong"

// Mindfulness
LOW_MINDFULNESS → "low"
MODERATE_MINDFULNESS → "moderate"
GOOD_MINDFULNESS → "high"

// Self-Acceptance
BEGINNING_SELF_ACCEPTANCE → "low"
DEVELOPING_SELF_ACCEPTANCE → "moderate"
GROWING_SELF_ACCEPTANCE → "high"
INTEGRATED_SELF_ACCEPTANCE → "god" // 😄
```

## 🔧 Advanced Usage

### Creating Context-Specific Prompts

```javascript
// Shows only in Couple context:
contexts: ['Couple']

// Shows in multiple contexts:
contexts: ['You', 'Couple']

// Universal (all contexts):
contexts: ['You', 'Couple', 'Family']
```

### Using OR Logic

```javascript
// Show if user has EITHER avoidant attachment OR low words love language:
criteria: {
  matchType: "OR",
  traits: [
    { type: "attachment", labels: ["avoidant"] },
    { type: "loveLanguage", labels: ["words"], intensities: ["low", "very_mild"] }
  ]
}
```

### Universal Prompts

```javascript
// Always shows (no trait requirements):
criteria: {
  matchType: "AND",
  traits: [] // Empty array = universal
}
```

## ⚠️ Important Notes

1. **LocalStorage in Editor**: Changes are saved to browser localStorage. Export JSON to persist changes.

2. **Validation**: The editor shows validation warnings for:
   - Missing translations
   - Invalid contexts
   - Invalid trait types
   - Invalid match types
   - Priority out of range

3. **Badge Logic**: `isHighPriority = true` when:
   - Prompt matches at least 1 trait
   - Used to show ✨ badge

4. **Relevance Scoring**:
   - Base = priority value
   - +2 for each matched trait
   - Higher score = shown first

5. **Fallback**: If Lithuanian translation missing, falls back to English automatically.

## 📝 Next Steps

1. **Test thoroughly** with real user trait data
2. **Expand library** to 30-50 prompts covering more scenarios
3. **Add more languages** if needed (structure supports it)
4. **A/B test** badge visibility and prompt ordering
5. **Monitor metrics**:
   - Click-through rate per prompt
   - Which contexts use prompts most
   - Which trait combinations trigger which prompts

## 🤝 Team Workflow

1. **Content team**: Use editor to draft new prompts
2. **Export JSON**: Click "Export JSON" when ready
3. **Review**: Validate exported JSON file
4. **Deploy**: Replace `prompt-library.json` in production
5. **Test**: Use testing page to verify behavior

## 📚 API Reference

See inline JSDoc comments in `prompt-library.js` for detailed API documentation.

---

**Created**: November 2024  
**Version**: 1.0.0  
**Status**: MVP Ready ✅
