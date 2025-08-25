# 🤖 Reflection Companion

**Core Purpose:** Help users understand their life experiences through their psychological patterns without explicit labeling.

---

## 🎯 Positioning

**"Your Personal Reflection Partner"**

> "I know how you connect and care. Let's explore how that shows up in your life."

**Value:** Pattern-based self-understanding for real situations, not therapy or generic chat.

---

## ✨ Reflection Prompt System

**Core Problem:** Prevent casual "hello" usage and guide users toward meaningful pattern exploration.

### UX Flow

**First Time (Empty Chat):**
- Show 3-4 curated prompts as clickable cards
- Message: "Let's explore a real situation from your life. Choose what resonates:"
- User clicks → prompt populates chat input → user can edit/send

**Ongoing Chat:**
- Floating ✨ button (always visible)
- Click → slide-out panel with full prompt library
- User selects → prompt populates chat input

### Prompt Library Structure

**Three Types of Prompts:**

1. **Universal/General** (always shown)
   ```
   "Something feels off but I can't name it"
   "I keep doing this thing in relationships where..."
   "Help me understand a recent conflict"
   ```

2. **Trait-Type Based** (attachment, love language)
   ```
   anxious_attachment: "Why do I need so much reassurance?"
   avoidant_attachment: "Why do I pull away when they get close?"
   words_love_language: "They show they care but I still feel unseen"
   ```

3. **Trait-Level Based** (mindfulness, self-acceptance)
   ```
   low_mindfulness: "Help me slow down and notice what's happening inside"
   high_mindfulness: "Walk me through the deeper pattern here"
   low_self_acceptance: "Why am I so hard on myself?"
   high_self_acceptance: "How can I use this insight to grow?"
   ```

### Smart Filtering Logic

**Show prompts IF:**
- Universal/general prompts (always shown)
- Match user's primary trait (gets ✨ recommended badge)
- Match user's secondary trait (shown, no badge)
- Match user's mindfulness/self-acceptance level

**Hide prompts that:**
- Don't match their primary, secondary, or level-appropriate traits

**Example for Anxious Primary + Words Secondary + Low Mindfulness:**
```
✨ Reflection Starters

✨ Why do I need so much reassurance? (primary - badged)
✨ Help me understand this conflict pattern (primary - badged)
   They show they care but I still feel unseen (secondary)
   Help me notice what I'm actually feeling (mindfulness level)
   Something feels off but I can't name it (universal)

[Hidden: secure attachment, high mindfulness prompts, etc.]

**Recommended Badge Logic:**
- Only primary attachment and love language traits get ✨ badge
- Secondary traits and levels shown without badges
- Universal prompts shown without badges

### Analytics & Optimization

**Simple Tracking:**
- Which prompts get clicked (popularity)
- ✨ button usage frequency (feature adoption)
- Overall chat retention (indirect success signal)

**Success Metrics:**
- Prompt click-through rate
- Return usage of ✨ button
- Overall chat engagement and retention
- Token spending on chat messages

### Content Strategy

**Prompt Quality Guidelines:**
- Each prompt should lead to 3+ message exchanges
- Focus on specific situations, not abstract concepts
- Use behavioral language, avoid clinical terms
- Create curiosity and self-reflection

**Library Size:**
- ~20-25 total prompts for MVP
- 3-5 prompts per major trait type/level
- All universal prompts applicable to any user

---

## 💡 Usage Strategy

**Encourage:**

- Relationship conflicts and communication patterns
- Emotional triggers and recurring situations
- Understanding personal reactions and responses
- Practical application of psychological insights

**Redirect:**

- Crisis support → professional help
- Generic advice → pattern exploration
- General therapy → specific situations

---

## 🧠 Response Approach

**Pattern Integration Without Labels:**
Instead of: "Based on your anxious attachment..."
Use: "It sounds like you might need more reassurance in moments like this..."
Instead of: "Your love language is words of affirmation..."
Use: "I notice you mentioned feeling unheard - verbal recognition seems important to you..."

**Always connect to their specific patterns without naming the clinical terms.**

---

## 💰 Pricing (MVP)

- **Free:** 3 messages after completing Basic Inner Portrait
- **Paid:** 1 Spark per message
- **Deep Dive:** 5 messages for 3 Sparks (bulk discount)

**Philosophy:** Premium enough to prevent casual usage, accessible for meaningful exploration.

---

## 🎨 User Experience

**Opening Prompts:**

- "Help me understand a recent conflict"
- "Why do I react this way when..."
- "How can I communicate this need better?"
- "What pattern might be behind this feeling?"

**Boundary Scripts:**

- Crisis: "This sounds serious. Please reach out to a professional. I'm here for pattern exploration when you're ready."
- Generic: "I'm designed to help you understand situations through your personal patterns. What specific situation brought this up?"

---

## 📊 Success Metrics

**Quality over Quantity:**

- Conversation depth (pattern references per message)
- User satisfaction with personalization
- Return usage within 7 days
- Conversion from free to paid messages

---

## 🛡️ Key Differentiators

- **Knows user's specific patterns** (vs generic AI)
- **Behaviorally descriptive** (vs clinical labeling)
- **Situation-focused** (vs emotional support)
- **Growth-oriented** (vs problem-solving)
- **Smart prompt curation** (vs random suggestions)

---

## ⚠️ MVP Constraints

**What We Won't Do:**

- Name psychological labels explicitly
- Provide therapy or crisis support
- Give generic life advice
- Enable casual conversation

**What We Will Do:**

- Reference behavioral patterns descriptively
- Connect real situations to their traits
- Encourage self-understanding and growth
- Maintain psychological sophistication without clinical language
- Provide curated, relevant conversation starters