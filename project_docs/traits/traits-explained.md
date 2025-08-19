# Complete Traits Overview - Questionnaires & Evaluations

## Overview

Withinly uses 4 core psychological traits to understand users' emotional and relational patterns. Each trait consists of a questionnaire that generates both user-facing reports and internal "psychologist notes" for the AI consultant.

---

## 1. Love Language Trait

### Questionnaire Structure

**Questions 1-4: Love Language Detection**

- **Q1**: How you primarily recognize expressions of love
- **Q2**: How you show love to others
- **Q3**: How you prefer to receive love when feeling emotional distance
- **Q4**: How you show love when you feel you matter to someone

**Options for Q1-4:**

- A: Quality Time
- B: Words of Affirmation
- C: Acts of Service
- D: Gifts
- E: Physical Touch

**Questions 5-6: Expression Archetype**

- **Q5**: Self-expression in loving relationships
- **Q6**: How communication changes when things are going well

**Options for Q5-6:**

- A: Guide/Visionary (deep thinking, structure, strategy)
- B: Artist/Creative (art, beauty, aesthetics)
- C: Healer/Caregiver (helping others, healing, serving)
- D: Teacher/Inspirer (talking with people, raising awareness)
- E: Child/Playful (play, joking, feeling free)

### Evaluation Logic

1. **Count letter frequency** in Q1-4 to determine love languages
2. **Primary**: Most frequent letter
3. **Secondary**: Second most frequent letter
4. **Distribution patterns**:
   - **DOMINANT**: All 4 questions same letter
   - **DUAL**: Only 1-point difference between primary/secondary
   - **MULTIPLE**: Three+ languages same count OR top three within 1 point

5. **Expression archetype** from Q5-6:
   - **STRONG**: Both questions same letter
   - **MIXED**: Different but adjacent responses
   - **UNIVERSAL**: Very different responses

### Possible Values

**Primary/Secondary Love Languages:**

- `QUALITY_TIME`
- `WORDS_OF_AFFIRMATION`
- `ACTS_OF_SERVICE`
- `GIFTS`
- `PHYSICAL_TOUCH`

**Distribution:**

- `DOMINANT`
- `DUAL`
- `MULTIPLE`

**Expression Archetype:**

- `VISIONARY` (Guide/Visionary)
- `ARTIST` (Artist/Creative)
- `HEALER` (Healer/Caregiver)
- `TEACHER` (Teacher/Inspirer)
- `CHILD` (Child/Playful)

**Archetype Strength:**

- `STRONG`
- `MIXED`
- `UNIVERSAL`

---

## 2. Attachment Type Trait

### Questionnaire Structure

**12 statements across 4 attachment styles** (3 statements each):

**Anxious Attachment (fear of abandonment):**

1. When partner takes long to respond, fears being unwanted/abandoned
2. Needs frequent attention and reassurance to feel secure
3. Frequently doubts partner's love and commitment

**Avoidant Attachment (intimacy is threatening):**

1. Difficulty expressing feelings, even with close people
2. Desires to withdraw when others seek emotional closeness
3. Values maintaining independence even in close relationships

**Disorganized Attachment (conflict between desire/fear of intimacy):**

1. Fluctuates between strongly desiring and fearing closeness
2. Reacts intensely to conflicts - either shuts down or explodes
3. Wants closeness but struggles to fully trust others

**Secure Attachment (trust and flexibility):**

1. Maintains trust in relationship stability even during conflicts
2. Feels calm and accepted even when partner is emotionally distant
3. Can openly express feelings and listen to others with differing opinions

**Scale:** 1-5 (Completely untrue → Completely true)

### Evaluation Logic

1. **Calculate average score** for each attachment style (sum ÷ 3)
2. **Primary**: Highest average score
3. **Secondary**: Second highest average score
4. **Intensity levels** based on average score:
   - 1-2: `VERY_MILD`
   - 2-3: `MILD`
   - 3-4: `MODERATE`
   - 4-5: `STRONG`

5. **Tie-breaking rules**:
   - If Secure tied with another: prioritize non-Secure as primary
   - If two non-Secure tied: use higher intensity as primary
   - Exact tie priority: Disorganized > Anxious > Avoidant > Secure

### Possible Values

**Primary/Secondary Types:**

- `ANXIOUS`
- `AVOIDANT`
- `DISORGANIZED`
- `SECURE`

**Intensity Levels:**

- `VERY_MILD`
- `MILD`
- `MODERATE`
- `STRONG`

---

## 3. Mindfulness Level Trait

### Questionnaire Structure

**Questions 1-3: Mindfulness Assessment**

**Q1**: Frequency of noticing internal states (emotions, sensations)

- A: Rarely/never aware (1 point)
- B: Occasionally notices but often misses (2 points)
- C: Frequently aware but not consistently (3 points)
- D: Consistently aware with some dedicated attention (4 points)
- E: Highly attuned with continuous awareness (5 points)

**Q2**: Response to unpleasant emotions or tension

- A: Avoids through distraction (1 point)
- B: Expresses but may not process fully (2 points)
- C: Aware but finds challenging to process (3 points)
- D: Processes with acceptance and understanding (4 points)
- E: Advanced non-attachment to emotional states (5 points)

**Q3**: Time dedicated to mindfulness/self-knowledge/inner growth

- A: No dedicated time (1 point)
- B: Sporadic engagement (2 points)
- C: Regular but limited time (3 points)
- D: Consistent dedicated practice (4 points)
- E: Fully integrated lifestyle (5 points)

**Q4**: Openness to change (separate evaluation)

- A: Too tired/skeptical about change (1 point)
- B: Feels need but uncertain how to begin (2 points)
- C: Desires change, ready for small steps (3 points)
- D: Ready to take action with right tools (4 points)
- E: Ready for deep exploration and transformation (5 points)

### Evaluation Logic

**Mindfulness Level** (Q1-3 total score):

- 3-5 points: `MAP_BEGINNING`
- 6-9 points: `AWAKENING_POINT`
- 10-12 points: `PATH_SEEKER`
- 13-15 points: `MINDFULNESS_TRAVELER`

**Openness to Change** (Q4 score):

- 1-2: `NOT_YET_TIME`
- 3: `INTERNAL_CONFLICT`
- 4: `GROWTH_READINESS`
- 5: `TRANSFORMATIONAL_PHASE`

### Possible Values

**Mindfulness Levels:**

- `MAP_BEGINNING`
- `AWAKENING_POINT`
- `PATH_SEEKER`
- `MINDFULNESS_TRAVELER`

**Openness to Change:**

- `NOT_YET_TIME`
- `INTERNAL_CONFLICT`
- `GROWTH_READINESS`
- `TRANSFORMATIONAL_PHASE`

---

## 4. Self-Acceptance Trait

### Questionnaire Structure

**Q1**: Reflection on strong emotions (anger, jealousy, sadness, fear)

- A: Usually not - I feel what I feel (1 point)
- B: Sometimes catch there's something more, but vague (2 points)
- C: Often connect emotions with inner stories/old wounds (3 points)
- D: Usually recognize which inner parts/experiences trigger this (4 points)

**Q2**: Recognition of inner parts (impulse reflection)

- A: Rarely - it just happens (1 point)
- B: Sometimes think about it, but answers unclear (2 points)
- C: Often recognize behavioral patterns and can name them (3 points)
- D: Can identify which inner parts were active (4 points)

**Q3**: Self-observation/inner witness capacity

- A: Rarely - more often just react (1 point)
- B: Sometimes catch moments, but short-lived (2 points)
- C: Often listen to myself with curiosity (3 points)
- D: Connected with inner voice - helps me be gentler (4 points)

**Q4**: Dissociation vs. engagement in experience

- A: Often feel like someone else is living my life (1 point)
- B: Sometimes lose connection with what I truly feel (2 points)
- C: Occasionally detached, but quickly return to myself (3 points)
- D: Most of time feel connected to myself and experience (4 points)

### Evaluation Logic

**Total Score** (sum of all 4 questions):

- 4-6 points: `ACCEPTANCE_LOW`
- 7-9 points: `ACCEPTANCE_TRANSITIONAL`
- 10-12 points: `ACCEPTANCE_REFLECTIVE`
- 13-16 points: `ACCEPTANCE_INTEGRATED`

### Possible Values

**Self-Acceptance Levels:**

- `ACCEPTANCE_LOW`
- `ACCEPTANCE_TRANSITIONAL`
- `ACCEPTANCE_REFLECTIVE`
- `ACCEPTANCE_INTEGRATED`

---

## Summary of All Possible Trait Values

### Love Language

- **Primary/Secondary**: `QUALITY_TIME`, `WORDS_OF_AFFIRMATION`, `ACTS_OF_SERVICE`, `GIFTS`, `PHYSICAL_TOUCH`
- **Distribution**: `DOMINANT`, `DUAL`, `MULTIPLE`
- **Expression Archetype**: `VISIONARY`, `ARTIST`, `HEALER`, `TEACHER`, `CHILD`
- **Archetype Strength**: `STRONG`, `MIXED`, `UNIVERSAL`

### Attachment Type

- **Primary/Secondary Types**: `ANXIOUS`, `AVOIDANT`, `DISORGANIZED`, `SECURE`
- **Intensity**: `VERY_MILD`, `MILD`, `MODERATE`, `STRONG`

### Mindfulness Level

- **Level**: `MAP_BEGINNING`, `AWAKENING_POINT`, `PATH_SEEKER`, `MINDFULNESS_TRAVELER`
- **Openness**: `NOT_YET_TIME`, `INTERNAL_CONFLICT`, `GROWTH_READINESS`, `TRANSFORMATIONAL_PHASE`

### Self-Acceptance

- **Level**: `ACCEPTANCE_LOW`, `ACCEPTANCE_TRANSITIONAL`, `ACCEPTANCE_REFLECTIVE`, `ACCEPTANCE_INTEGRATED`

---

## Key Implementation Notes

1. **No Labels**: Despite having structured values, the product avoids labeling users directly
2. **Storytelling Focus**: Results are presented through narrative reports rather than categories
3. **Dual Output**: Each trait generates user-facing reports + internal psychologist notes
4. **Re-evaluation**: Users can retake traits, with meaningful change detection logic
5. **Report Dependencies**: Different reports require different combinations of completed traits

## Validation Hooks

1. Purpose of Validation Hooks

Validation hooks are checkpoints to make sure trait results are psychologically valid and not random clicking or contradictory answers.
They help you:

Prevent garbage-in → garbage-out (bad data ruining reports).

Signal to the user when results are shaky or need retaking.

Keep trust in the system by not giving “deep reflections” on invalid inputs.

2. When Validation Hooks Trigger

Inconsistent answers (e.g., answering “always” and “never” to parallel questions).

Random clicking patterns (too fast completion, no variation).

Contradictory trait logic (e.g., scoring both “very secure” and “very anxious” equally high).

Invalid completion time (finished in 10 seconds when avg is 1–2 min).

3. System Behavior

When validation fails:

Block deep outputs — don’t generate psychologist notes or detailed reports.

Fallback to lightweight reflection — a predefined text like:

“It looks like your answers were a bit inconsistent. That happens sometimes. You can retake the questionnaire when you feel ready — this way the reflections will feel more accurate.”

Offer Retake — button CTA “Retake assessment” (free, no tokens deducted).

Log the event — mark in backend that this attempt was invalid (for analytics).
