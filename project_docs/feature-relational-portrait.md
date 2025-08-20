# 🔗 Partner Sync (Couple-Only, MVP Scope)

Partner Sync is designed to connect **two partners** and generate couple-focused insights.  
At this stage, the feature is **romantic-only** — 1:1 connection with one partner at a time.

---

## 🔐 Consent & Privacy

- The system becomes **aware of both partners’ traits**, but these traits are never directly shown to each other.
- Only shared outputs are visible:
  - Couple Snapshot (short reflection)
  - Couple Reports (premium, in-depth)
  - Any future couple-specific functionalities
- Either partner may **unlink** at any time.
- Abuse prevention: only **one free snapshot per unique sync**, and a cooldown period (e.g., 30 days) before re-syncing with a new partner.

---

## 🌀 Flow

1. **Invite & Connect**
   - Partner A sends invite link or code.
   - Partner B accepts → accounts become synced.

2. **Couple Snapshot (short, instant)**
   - **Length**: 300–500 words.
   - **Content**:
     - Where partners’ traits overlap or differ (attachment, love language, mindfulness, self-acceptance).
     - 1–2 likely friction points.
     - 1–2 supportive behaviors or nudges.
   - **Availability**: free with first sync.
   - **Purpose**: immediate insight → builds trust → primes upsell.

3. **Premium Couple Reports**
   - **Relationship Compass** (1000–1500 words, AI)
     - Explores bonding, love expression, sensitivities, blind spots, and growth directions.
   - **Conflict Compass (Couple Edition)** (future add-on)
     - Explores stress patterns, protective instincts, and repair strategies.

4. **Upsell Path**
   - After Snapshot → CTA: _“Unlock your full Relationship Compass”_.
   - Premium reports require tokens; if one partner purchases, both accounts get access.

---

## 🧭 Naming Convention

- **Inner Portraits** = solo reports (Basic, Full).
- **Relational Portraits** = couple reports (require Partner Sync).
  - Couple Snapshot → short, free/low cost, instant.
  - Relationship Compass → premium, deep couple report.
  - Conflict Compass → optional future expansion.

---

# 🔗 Partner Sync Input Rules

### Free-Tier Reports (e.g., Couple Snapshot)

- Input: **trait metadata only**
  - Example: Attachment = Avoidant (score: high), Love Language = Words (primary), Mindfulness = Low, Self-Acceptance = Disconnected.
- Excludes:
  - PsychologistNotes (not generated yet)
  - UserReports from traits (too shallow to be meaningful)
- Purpose: Lightweight, quick reflection based on **raw profile**.

### Premium Reports (e.g., Relationship Compass, Conflict Compass)

- Input:
  - Trait metadata
  - PsychologistNotes (from prior premium reports or newly generated)
- Excludes:
  - Trait UserReports (replaced by richer psychologistNotes)
- Purpose: Deep synthesis across traits for long-form couple insights.

---

## 🛣️ Roadmap

- MVP: **Couple-only Partner Sync** (romantic focus).
- Future: may expand into broader **Relational Portraits** (friends, family, siblings) once core couple use case is validated.
