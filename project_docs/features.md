# Features Overview

This section describes all features and their working principles in Withinly project.

# Traits

Traits are used to understand a user’s emotional and psychological picture. They consist of short questionnaires which are then evaluated and used to generate insights for the user, the AI consultant, and reports.

Currently we support 4 traits:

- **Love Language**
- **Attachment Type**
- **Mindfulness Level**
- **Self-Acceptance Level**

Each trait identifies **primary values** (e.g. `primaryLoveLanguage: Touch`), but we avoid static labels in user-facing text. Instead, results are translated into **storytelling and reflections**, so users don’t fixate on categories.

Every trait produces two outputs:

1. **User-facing mini report** — a predefined reflection shown after completion and saved for ongoing reference.
2. **Behavioral profile** — rich psychological context for reports/consultant

**No individual interaction guidance** - consultant gets AI-generated integrated guidance instead.

---

## Love Language

- **Goal**: Identify primary and (optional) secondary love languages, plus archetypal expression styles.
- **User-facing title**: _The Way You Love_
- **Description**: _(to be generated)_
- **Prompt**: `/traits/love-language.md`
- **Example**: `/traits/love-language-example.md`

---

## Attachment Type

- **Goal**: Identify primary attachment style, intensity, and optional secondary style.
- **User-facing title**: _The Way You Attach_
- **Description**: _(to be generated)_
- **Prompt**: `/traits/attachment-type.md`
- **Example**: `/traits/attachment-type-example.md`

---

## Mindfulness Level

- **Goal**: Identify the user’s level of mindfulness and openness to change.
- **User-facing title**: _The Way You Stay Present_
- **Description**: _(to be generated)_
- **Prompt**: `/traits/mindfulness-level.md`
- **Example**: `/traits/mindfulness-level-example.md`

---

## Self-Acceptance Level

- **Goal**: Identify how the user accepts themselves and what narratives shape their self-view.
- **User-facing title**: _The Way You Hear Yourself_
- **Description**: _(to be generated)_
- **Prompt**: `/traits/self-acceptance.md`
- **Example**: `/traits/self-acceptance-example.md`

---

## Predefined Reports & Change Evaluation

- **Mini Reports** are fully predefined. When a user first completes a trait, they receive one of these pregenerated reflections. No AI is used.
- **Progress Feedback**: When a user retakes a questionnaire, the system compares **labels only** (e.g. attachment = _Avoidant → Anxious_, or love language = _Words → Touch_).
  - If the label is unchanged → show a predefined “stable” reflection.
  - If the label has changed → show a predefined “changed” reflection specific to the transition.
- This MVP approach avoids complex scoring logic and keeps costs low.
- If a trait changes significantly, the system can also flag associated reports (e.g. Master Report) as **recommended to regenerate**.

More details in `feature-traits.md`

---

## 📖 Reports (Inner Portraits & Relational Portraits)

Reports weave traits together into emotionally intelligent reflections.  
They are the **core way users see their patterns in context**.

### Individual Reports (Inner Portraits)

- **Basic Inner Portrait** — a gentle summary of your traits, 350–450 words.
- **Full Inner Portrait** — a 1000–1500 word integrative reflection on your emotional world.
- **Conflict Compass** — how you react to tension, protect yourself, and return to connection.
- **Relationship Blueprint** — how you bond, offer love, and need to be met.
- **Trust & Vulnerability Map** — how you open up and balance safety.
- **Communication Decoder** — how you express care and what helps you return to balance.

Each report costs tokens (Sparks) to generate and stands on its own.  
Reports can be regenerated if traits change significantly.

### Couple Reports (Relational Portraits)

Unlocked through **Partner Sync**.  
Designed for romantic couples in MVP scope (1:1 partner link).

- **Couple Snapshot** — free, 300–500 words. Highlights overlaps and differences in partners’ traits.
- **Relationship Compass (Couple Edition)** — a deep 1000–1500 word reflection on how patterns meet.
- **Conflict Compass (Couple Edition)** — future expansion into stress and repair styles.

Partner traits are never shared directly. Only synthesized reflections are visible.

## 🧑‍🤝‍🧑 Partner Sync

Partner Sync enables **two accounts** to link privately.

- **Consent-based**: one partner invites, the other accepts.
- **Free entry point**: Couple Snapshot for instant recognition.
- **Upsell path**: premium couple reports that both partners can access if one pays.
- **Privacy**: either partner can unlink at any time. Traits remain private.

This is a core differentiator: Withinly is not only about self-reflection, but also about **seeing yourself through another**.

More details in `feature-relational-portrait.md`

---

## 💬 Reflection Companion

- Speaks in a warm, therapeutic-like tone — never clinical.
- Adapts based on trait psychologist notes and report summaries.
- Ongoing use costs tokens (Sparks).
- Summarizes chat and extracts significant notes, but that is currently experimental. Prompt `/prompts/summarizeAntExtract.md`
- Has access to report summarization via tool-based system (200 word summary of the report) - `/prompts/tool-report-summary.md`
- Main prompt `prompts/consultant.md` example with real data: `prompts/consultant-example.md`

## Tools

- Goal-setting and growth-oriented practices (planned)
- Longitudinal insight graphs (future feature)
