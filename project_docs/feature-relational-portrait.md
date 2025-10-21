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

# Relational Portrait Reports

**Purpose:** Reports generated when two partners sync their accounts. Focus on how individual patterns interact in relationship dynamics.

### Free Report

#### Couple Snapshot

A first glimpse into how your patterns overlap and contrast — highlighting shared strengths and natural differences.

- **Cost:** Free with first Partner Sync
- **Length:** 300-500 words
- **Input:** Trait metadata only (no psychologist notes)
- **Focus:** Basic pattern alignment and differences
- **Value:** Immediate recognition of relationship dynamics and hook for premium reports
- **Prompt:** `/prompts/report-couple-snapshot.md`

### Premium Reports

#### Relationship Compass (Couple Edition)

Two personalized guides that help each partner understand their role in creating deeper connection with their specific partner.

- **Cost:** 5-6 Sparks (generates two personalized reports)
- **Focus:** How each person can love their partner better, relationship-specific behavioral changes, daily connection tools
- **Length:** 1200-1500 words
- **Input:** Both partners' trait metadata + psychologist notes
- **Value:** Comprehensive guide to relationship patterns with actionable insights for both partners
- **Prompt:** `/prompts/report-couple-relationship-compass.md`

#### Conflict Compass (Couple Edition)

A guide to your shared conflict patterns — what triggers tension between you, how each person protects themselves, and your unique path back to connection.

- **Cost:** TBD
- **Length:** 1200-1500 words
- **Input:** Both partners' conflict-related traits and patterns
- **Focus:** Couple-specific conflict cycles, triggers, and repair strategies
- **Value:** Practical tools for fighting better and reconnecting faster
- **Prompt:** `/prompts/report-couple-conflict-compass.md`

## Relational Report Requirements

**Privacy Protection:**

- Individual traits never shown directly to partner
- Only synthesized couple insights are visible
- Either partner can unlink at any time
- Both partners get access if one pays for premium reports

**Content Focus:**

- How patterns complement or clash
- Specific behavioral examples couples will recognize
- Practical strategies for working with differences
- Validation of both partners' perspectives

**Upsell Strategy:**

- Free Couple Snapshot creates immediate value and relationship curiosity
- Premium reports provide depth worth paying for
- Partner who pays feels they're investing in the relationship
- Non-paying partner gets value, creating gratitude and potential future conversion

## Flow for invitation and acceptance

When Sending Invite

1. User enters email (no dropdown, no validation feedback)
2. System checks silently:
   If account exists → Send in-app notification + email
   If no account → Send email with invitation to join + explanation

3. User sees generic success: "Invitation sent to [email]"
4. Once accepted the user sees account name and other inforamtion.

Email templates:
[couple-sync-account-exists.md](emails/couple-sync-account-exists.md)
[couple-sync-no-account.md](emails/couple-sync-no-account.md)

## User safety checks

Before sending or accepting a partner sync we will show this modal:

**Before You Connect With Your Partner**

When you sync accounts:

- Your individual traits and chat history stay private
- Only couple insights (reports, snapshots) are visible to both of you
- **If either of you unlinks, all couple reports are deleted** and both lose access
- Use these insights to understand each other better, not to manipulate or control

**Don't sync if:**

- You feel pressured or coerced by your partner
- Your relationship involves abuse or coercion
- You're not comfortable sharing relationship insights

[Cancel] [I Understand, Continue]
