# 🤖 Reflection Companion

**Core Purpose:**  
Help users explore their emotional patterns in real situations — through conversation guided by their traits and reports.  
Not therapy, not casual chat — but a **personal reflection partner**.

In order to make the most use of available data and chat features the system generates consultant guidelines for the chat.

More details in `/prompts/consultant-guidelines.md`

The guidelines are generated after atleast 3 traits are completed. Regenerated if traits change significantly and once 4th one is completed as well.

General prompt for consultant can be found in `/prompts/consultant.md`

---

## 🎯 Positioning

**"Your Personal Reflection Partner"**

> "I know how you connect and care. Let's explore how that shows up in your life."

**Value:**

- Pattern-based self-understanding
- Conversations tied to reports and traits
- Safe exploration without judgment or labels

---

## 🧠 Memory System (MVP)

- Access to 10 most recent messages + evolving summary
- Summary updates every 5 messages
- Unlimited summary length to preserve details
- No explicit memory search (post-MVP feature)
- Summarizes chat and extracts significant notes (accessible by rag) Prompt `/prompts/summarizeAntExtract.md`
- Has access to report summarization via tool-based system (NOT MVP) - `/prompts/tool-report-summary.md`

---

## ✨ Reflection Prompt System

**Status:** ✅ Implemented (see `/src/prompt-library/` for technical docs)

**Goal:** Prevent "hello/hi" usage and guide users into meaningful exploration through trait-based prompt filtering.

### UX Flow

- **First Time (Empty Chat):**
  - Show 3–4 curated prompts as clickable cards
  - Message: "Let's explore a real situation from your life. Choose what resonates:"
  - User clicks → prompt fills input → they can edit/send

- **Ongoing Chat:**
  - Floating ✨ button always visible
  - Opens prompt library, filtered by user's traits
  - Prompts populate input field on select

### How It Works

The system filters ~15 reflection prompts based on:

- **User's traits**: Attachment, love language, mindfulness, self-acceptance
- **Context**: You (solo) vs. Couple vs. Family
- **Match type**: Primary traits (🌟) get priority, secondary traits (⭐) also shown

**Matching Logic:**

- Supports both primary AND secondary trait values (e.g., primary: avoidant, secondary: secure)
- Mindfulness includes both mindfulness level + awareness level
- Self-acceptance includes both acceptance level + openness to change
- Prompts match if EITHER primary OR secondary/sub-field satisfies criteria
- Universal prompts always shown to everyone

**Example:**

- User has anxious attachment (primary) → sees "Why do I need so much reassurance?" 🌟
- User has avoidant attachment (secondary) → sees "Why do I pull away?" ⭐
- Everyone sees "Something feels off but I can't name it" (universal)

### Content Management

- **Editor UI** at `/pages/prompt-library-editor.astro` for adding/editing prompts
- **Testing page** at `/pages/prompt-library.astro` for validating filtering
- Changes save to localStorage for testing, export to JSON for deployment
- System validates prompt structure automatically

---

## 💬 Usage Strategy

Encourage:

- Exploring relationship conflicts
- Recognizing recurring triggers
- Understanding personal reactions
- Applying report insights

Redirect away from:

- Crisis support → professional help
- General advice → focus on patterns

---

## 💰 Pricing (MVP)

- **Free**: First 3 messages after onboarding (Standards)
- **Standard Chat (default)**: 1 Spark = 20 messages
- **Depth Chat (optional toggle)**: 1 Spark = 5 messages

Framing:

- **Standard** = more quantity, lighter depth (GPT-4.1 mini)
- **Depth** = fewer messages, richer nuance (GPT-4.1)

---

## 🎨 User Experience

- **Opening Prompts Examples:**
  - "Help me understand a recent conflict"
  - "Why do I react this way when…"
  - "How can I communicate this need better?"

- **Pro Toggle:**
  - Switch between Mini (default) and Pro Depth (premium quality)
  - Clear Spark usage shown ("20 msgs" vs "5 msgs per Spark")

- **Feedback & Balance:**
  - Always show sparks left ("✨ 7 Sparks remaining")
  - Low balance (<3 Sparks) triggers refill suggestion

- Under chat window show the following:
  Mini mode: "✨ You're in Mini mode — 20 messages per Spark. 14 left on this Spark."
  Depth mode: "✨ Depth mode — 5 richer messages per Spark. 3 left on this Spark."

---

## 📊 Success Metrics

- Prompt click-through rate
- Conversation depth (avg exchanges per Spark)
- Return usage within 7 days
- Spark spending ratio (chat vs reports)

---

## ⚠️ MVP Constraints

**Won't Do:**

- Label psychological styles explicitly
- Provide therapy or crisis support
- Enable endless casual small talk

**Will Do:**

- Connect real situations to patterns
- Encourage reflection and growth
- Maintain psychological sophistication in plain language

---
