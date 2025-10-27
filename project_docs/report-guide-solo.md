# 🧭 Withinly — Solo Report Framework (Core & QA Guide)

**Purpose:**  
Define, differentiate, and quality-check all **solo premium reports**.  
Each report solves a **different user need at a different moment**.

**Last Updated:** 2025-XX-XX  
**Use For:**

- Prompt creation / review
- Report QA before deployment
- Team onboarding (quick orientation)

---

## 1. Report Architecture

| Category                        | Focus                              | Reports                                                                         |
| ------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------- |
| **Comprehensive Understanding** | Identity integration (who you are) | Inner Portrait                                                                  |
| **Situational Application**     | Reactive → proactive → depth       | Conflict Compass / Communication Decoder / Trust & Vulnerability Map (post-MVP) |

---

## 2. Core Differentiation

| Report                                     | User Need                                 | Moment                      | Traits                                                  | Primary Focus               | Tone                   |
| ------------------------------------------ | ----------------------------------------- | --------------------------- | ------------------------------------------------------- | --------------------------- | ---------------------- |
| **Inner Portrait**                         | “I want to understand myself completely.” | Any time                    | Attachment, Love Language, Mindfulness, Self-Acceptance | Identity & integration      | Reflective, validating |
| **Conflict Compass**                       | “We’re fighting / I shut down.”           | During / after conflict     | Attachment, Mindfulness, Self-Acceptance                | Reactivity & repair         | Grounded, calm         |
| **Communication Decoder**                  | “We’re off / I can’t express myself.”     | Daily life, before conflict | Love Language, Attachment, Mindfulness                  | Expression & prevention     | Practical, warm        |
| **Trust & Vulnerability Map** _(Post-MVP)_ | “I struggle to open up.”                  | Building intimacy over time | Attachment, Self-Acceptance, Mindfulness                | Intimacy & emotional safety | Gentle, intimate       |

---

## 3. Scope & Boundaries

### Territory Rules

| Phrase Appears                  | Belongs To            | Avoid In              |
| ------------------------------- | --------------------- | --------------------- |
| “During a fight”                | Conflict Compass      | Communication Decoder |
| “After a fight”                 | Conflict Compass      | Inner Portrait        |
| “Before resentment builds”      | Communication Decoder | Conflict Compass      |
| “Opening up emotionally”        | Trust Map             | Others                |
| “Who you are / across contexts” | Inner Portrait        | Others                |

**If unsure → ask:**

> “What is the user doing or feeling when they read this?”  
> That determines the correct report.

---

## 4. Trait Usage Matrix

| Report                | Attachment | Love Lang | Mindfulness | Self-Acceptance | Primary Driver |
| --------------------- | ---------- | --------- | ----------- | --------------- | -------------- |
| Inner Portrait        | ✓          | ✓         | ✓           | ✓               | Identity       |
| Conflict Compass      | ✓✓         | —         | ✓           | ✓               | Stress pattern |
| Communication Decoder | ✓          | ✓✓        | ✓           | —               | Expression     |
| Trust Map             | ✓✓         | —         | ✓           | ✓               | Intimacy       |

**✓✓ = primary**, **✓ = supporting**, **— = excluded**

---

## 5. Deliverable Definition

### Each Report Must:

- **Educate** → Explain pattern in plain language
- **Reveal** → Show blind spots, aha moments
- **Activate** → Offer 2-3 practical reflections or tools

### Each Report Must Avoid:

- Clinical labels (“avoidant”, “quality time”)
- Generic advice (“communicate better”)
- Cross-report territory
- Redundant insight already in another report

---

## 6. Voice Profiles

| Report                | Voice Anchor                                           |
| --------------------- | ------------------------------------------------------ |
| Inner Portrait        | “The wise mirror — reflective, integrative.”           |
| Conflict Compass      | “The calm responder — grounded, stabilizing.”          |
| Communication Decoder | “The translator — practical, warm, clear.”             |
| Trust Map             | “The gentle depth diver — validating, slow, intimate.” |

Use this to align tone and phrasing.

---

## 7. Prompt Structure Template

SYSTEM PROMPT
Role: [Guide type — e.g. reflective insight / communication coach / etc.]
Goal: [Clear objective in one line]
Scope: [What it covers + what it explicitly avoids]

OUTPUT STRUCTURE
Opening / validation (recognition)

Key behavioral pattern(s)

Core insight(s)

Practical reflection or step

Closing tone aligned to report type

STYLE RULES
Second person ("you")

Behavioral, not abstract

Avg sentence ≤ 15 words

Avoid metaphors & poetic phrasing

Concrete examples (2–4)

Markdown headings only

yaml
Copy code

---

## 8. QA Checklist (Before Publishing)

| #   | Check                                                  | Yes/No |
| --- | ------------------------------------------------------ | ------ |
| 1   | Report stays inside its defined territory              |
| 2   | Traits used match the matrix                           |
| 3   | Contains 5–10 recognizable behaviors                   |
| 4   | Delivers one clear emotional insight per 150–200 words |
| 5   | Tone matches voice profile                             |
| 6   | Ends with distinct emotional payoff (not summary)      |
| 7   | No overlap with other reports                          |
| 8   | Reading level ~8th grade                               |
| 9   | Word count within range                                |
| 10  | User would think “that’s exactly me”                   |

---

## 9. MVP Launch Scope

| Stage            | Reports                                                   | Notes                                  |
| ---------------- | --------------------------------------------------------- | -------------------------------------- |
| **Launch (MVP)** | Inner Portrait / Conflict Compass / Communication Decoder | Core coverage                          |
| **Post-MVP**     | Trust & Vulnerability Map                                 | Add if users request intimacy guidance |

---

## 10. Maintenance Rules

- Update when: new report added / overlap detected / user confusion noted
- Keep “Last Updated” field current
- Maintain one-page format for internal clarity

---

**Quick Reference Summary**

| User Says             | Recommend             |
| --------------------- | --------------------- |
| “Who am I?”           | Inner Portrait        |
| “We’re fighting.”     | Conflict Compass      |
| “We’re disconnected.” | Communication Decoder |
| “I can’t open up.”    | Trust Map (later)     |

---

_End of Framework — concise, operational, ready for use._
