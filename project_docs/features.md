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

**No individual interaction guidance** - consultant gets AI-generated integrated guidance later instead.

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

- **Couple Snapshot** — free, 300–500 words. Shows specific behavioral dynamics both partners will recognize.
- **Relationship Compass (Personalized Pair)** — two 1200-1500 word guides helping each partner understand their role in loving their partner better.
- **Conflict Compass (Personalized Pair)** — two 1200-1500 word guides helping each partner fight better with their specific partner.

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
- Adapts based on user traits and consultant guidelines.
- Ongoing use costs tokens (Sparks).

More details in `feature-chat.md`
