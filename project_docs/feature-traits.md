# Complete Traits Overview - Questionnaires & Evaluations

## Overview

Withinly uses 4 core psychological traits to understand users' emotional and relational patterns. Each trait consists of a questionnaire that generates both user-facing reports and internal "psychologist notes" for the AI consultant.

---

## 1. Love Language Trait

User facing title: _The Way You Love_

Description and details can be found in `/traits/love-language.md` file.

---

## 2. Attachment Type Trait

User facing title: _The Way You Attach_

Description and details can be found in `/traits/attachment-type.md` file.

---

## 3. Mindfulness Level Trait

User facing title: _The Way You Stay Present_

Description and details can be found in `/traits/mindfulness-level.md` file.

---

## 4. Self-Acceptance Trait

User facing title: _The Way You Hear Yourself_

Description and details can be found in `/traits/self-acceptance.md` file.

---

# The Traits page content

## Your Traits

[ LIST OF TRAIT CARDS IN A GRID ]

Card structure:

- Title
- Description
- User reflection access (permanent)
- Completed date
- Call to actions
- Price (initial = free, retake after 30 days = 1 Spark)

Cards:

- **The Way You Stay Present**  
  Understand how aware you are of your inner world and emotions. This reveals your relationship with mindfulness and your openness to personal growth.

- **The Way You Hear Yourself**  
  Discover how you treat yourself internally — the tone of your inner voice and how compassionately you meet your own emotions and experiences.

- **The Way You Attach**  
  Explore how you form emotional bonds and what you need to feel secure in relationships. Your attachment style shapes how you handle closeness, conflict, and connection.

- **The Way You Love**  
  Discover how you naturally express care and what makes you feel most loved. Understanding your love language helps you connect more deeply with others and communicate your needs clearly.

CTAs on cards:

- Start (when not done)
- Check in again (when done)

Notes:

- If less than 30 days since last completion, show a notice discouraging early retake.
- Retakes after 30 days → 1 Spark.

---

## Key Implementation Notes

1. **No Labels**: Despite having structured values, the product avoids labeling users directly - the users are never exposed to the values directly.
2. **Storytelling Focus**: Results are presented through narrative reports rather than trait focused reports or summaries.
3. **Dual Output**: Each trait generates a short predefined user report
4. **Re-evaluation**: Users can retake traits, with meaningful change detection logic (change of intesity or type)
5. **Report Dependencies**: Different reports require different combinations of completed traits

## Behavioral Profiles

Each trait generates a behavioral profile for reports/consultant

The way it works can be understood from `trait-report-demo` folder and `src/trait-report-demo/index.js` file. Each trait has its own generator function. Generators are responsible for generating the behavioral profile and user facing reflection.

**Usage:**

- Reports: Get rich behavioral context for AI generation
- Consultant: Combined with AI-generated integrated guidance

---

## Predefined Reports & Change Evaluation

- **Mini Reports** are fully predefined. When a user first completes a trait, they receive one of these pregenerated reflections. No AI is used.
- **Progress Feedback**: When a user retakes a questionnaire, the system compares **labels only** (e.g. attachment = _Avoidant → Anxious_, or love language = _Words → Touch_).
  - If the label is unchanged → show a predefined “stable” reflection.
  - If the label has changed → show a predefined “changed” reflection specific to the transition.
- This MVP approach avoids complex scoring logic and keeps costs low.
- If a trait changes significantly, the system can also flag associated reports (e.g. Master Report) as **recommended to regenerate**.
