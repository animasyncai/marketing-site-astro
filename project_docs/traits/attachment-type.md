# Attachment Type

## Overview

This trait measures how users form emotional bonds and what they need to feel secure.  
It detects their dominant **attachment regulation strategies** — pursuit, withdrawal, mixed, or balanced.

Attachment patterns shape how people handle closeness, conflict, and repair.  
This data powers key parts of Withinly’s **reports** and **consultant tone adaptation**.

---

## Questions (16 total)

### Anxious Attachment

_Focus: fear of abandonment and pursuit behaviors_

1. When my partner doesn't respond to messages quickly, I worry they're losing interest in me.
2. I need frequent attention and reassurance to feel secure in relationships.
3. When I'm upset with someone I care about, I need to resolve it right away before I can move on.
4. After conflicts or distance, I reach out multiple times until I feel reconnected.

### Avoidant Attachment

_Focus: discomfort with emotional intimacy and withdrawal strategies_

5. I find it difficult to express my feelings, even with people I'm close to.
6. I feel uncomfortable when I'm asked to open up about my feelings and vulnerabilities.
7. I'm more comfortable offering practical help than emotional support.
8. After emotionally intense moments, I need significant time alone to recharge.

### Disorganized Attachment

_Focus: push–pull conflict — wanting closeness and fearing it_

9. **I find myself wanting more closeness, then feeling uncomfortable once I get it.**
10. During conflicts, I either shut down completely or react very intensely.
11. My feelings about closeness can shift rapidly—wanting connection one moment, needing distance the next.
12. I sometimes push people away right after moments of deep connection or vulnerability.

### Secure Attachment

_Focus: trust, flexibility, and openness_

13. I maintain trust in my relationships even during conflicts or disagreements.
14. **When my partner seems distant, I can give them space without worrying about our relationship.**
15. I can stay open and curious during difficult relationship conversations without shutting down or becoming reactive.
16. I can openly share my feelings and listen respectfully to others, even when we disagree.

Scale: **1 = Completely untrue → 5 = Completely true**

---

## Evaluation Logic

### Step 1 – Attachment Type Averages

Anxious = (Q1 + Q2 + Q3 + Q4) / 4
Avoidant = (Q5 + Q6 + Q7 + Q8) / 4
Disorganized = (Q9 + Q10 + Q11 + Q12) / 4
Secure = (Q13 + Q14 + Q15 + Q16) / 4

markdown
Copy code

### Step 2 – Behavioral Subscores (averaged 1–5 scale)

| Subscore                  | Questions                 | Meaning                                    | Why it matters                                                        |
| ------------------------- | ------------------------- | ------------------------------------------ | --------------------------------------------------------------------- |
| **Protest Behavior**      | (Q2 + Q3 + Q4)/3          | Need for reassurance, urgency to reconnect | Captures hyperactivation — anxious & disorganized marker              |
| **Deactivation Strategy** | (Q5 + Q6 + Q7 + Q8)/4     | Emotional withdrawal & self-protection     | Core of avoidant defense; key to tension and distance logic           |
| **Push–Pull Pattern**     | (Q9 + Q11 + Q12)/3        | Conflict between approach & avoidance      | Identifies disorganized oscillation; used for chaos/healing detection |
| **Emotional Regulation**  | (Q13 + Q14 + Q15 + Q16)/4 | Ability to stay calm, trusting, and open   | Anchors secure & “secure-leaning” logic                               |

👉 Subscores are **internal only** (not shown to users).  
They add nuance to reports and chat without overcomplicating the trait.

Thresholds (v0.3.1):  
Low < 2.5 · Moderate 2.5–3.4 · High ≥ 3.5

---

### Step 3 – Primary / Secondary Type

- Highest average → **Primary**
- Second-highest → **Secondary**

### Step 4 – Intensity

| Average | Label     |
| ------- | --------- |
| 1.0–2.0 | Very Mild |
| 2.1–3.0 | Mild      |
| 3.1–4.0 | Moderate  |
| 4.1–5.0 | Strong    |

### Step 5 – Tie Handling

If top two within 0.3:

- Secure + other → choose other
- Two non-secure → higher intensity wins
- Exact tie → priority = Disorganized > Anxious > Avoidant > Secure

---

## Step 6 – Pattern Detection

### Pattern Rules (v0.1)

#### Avoidant Primary

- High Deactivation + Low Protest → `pureAvoidantWithdrawal`
- High Deactivation + Moderate Protest → `avoidantWithHiddenAnxiety`
- Moderate Deactivation + High Regulation → `secureLeaningAvoidant`
- High Deactivation + Low Regulation → `defensiveShutdown`

#### Anxious Primary

- High Protest + Low Deactivation → `pureAnxiousPursuit`
- High Protest + Moderate Deactivation → `conflictedAnxious`
- Moderate Protest + High Regulation → `secureLeaningAnxious`
- High Protest + Low Regulation → `reactivePursuit`

#### Disorganized Primary

- High PushPull + High Protest → `chaoticAnxious`
- High PushPull + High Deactivation → `chaoticAvoidant`
- High PushPull + Low Regulation → `unstableRegulation`
- Moderate PushPull + Moderate/High Regulation → `healingDisorganized`

#### Secure Primary

- Regulation ≥ 4.0 and others < 2.5 → `integratedSecure`
- Regulation 3.5–3.9 and (Protest or Deactivation 2.5–3.4) → `secureWithTendencies`

#### Cross-Type Patterns (global)

| Pattern                    | Logic                              | Use                                        |
| -------------------------- | ---------------------------------- | ------------------------------------------ |
| `highInternalConflict`     | Protest ≥ 3.5 & Deactivation ≥ 3.5 | Drives "push–pull tension" in reports/chat |
| `strongRegulationCapacity` | Regulation ≥ 3.5 & others < 2.0    | Enables calm / stability tone              |
| `balancedButActivated`     | All four ≈ 3.0 ± 0.5               | Triggers balanced but ambivalent narrative |

→ Patterns stored in detectedPatterns array (max 3):

1. Cross-type pattern (only one can fire, mutually exclusive)
2. Primary-type patterns (priority: defensive/reactive > conflicted > pure > leaning)
3. Keep max 2 primary patterns

---

## Step 7 – Behavioral Profile Generation

Combine:

- Primary + intensity
- Secondary interaction
- Subscore context
- Detected patterns (if any)

**Pattern Modifiers (examples – used as narrative building blocks):**
| Name | Adds this nuance |
|------|------------------|
| `avoidantWithHiddenAnxiety` | "Withdraws to stay safe, but underlying anxiety makes distance painful." |
| `reactivePursuit` | "Reaches out urgently when feeling unseen; intensity masks fear of loss." |
| `defensiveShutdown` | "Disengages under stress to prevent overload; needs calm time before reconnection." |
| `chaoticAnxious` | "Swings between closeness and panic; connection feels both vital and threatening." |
| `integratedSecure` | "Balances closeness and autonomy; regains calm quickly after tension." |

👉 Patterns are stored in the detectedPatterns array AND their behavioral
implications are woven into the behavioralProfile text for AI to reference.

---

Note: Q1 measures anxious worry (cognitive) rather than protest behavior
(behavioral), so it contributes to type score but not subscore. Similarly,
Q10 measures conflict response extremes but not push-pull oscillation.

## Example Data Structure

```js
attachment: {
  "primary": "AVOIDANT",
  "secondary": "SECURE",
  "primaryIntensity": "MODERATE",
  "secondaryIntensity": "MODERATE",
  "maxScore": 5,
  "primaryScore": 4,
  "secondaryScore": 3.7,
  allScores: { secure: 2.8, anxious: 3.1, avoidant: 4.2, disorganized: 2.9 },
  subscores: {
    protestBehavior: 2.8,
    deactivationStrategy: 4.2,
    pushPullPattern: 2.6,
    emotionalRegulation: 2.9,
    metadata: { thresholdsVersion: "v0.1", low: 2.5, high: 3.5 }
  },
  detectedPatterns: ["highInternalConflict", "avoidantWithHiddenAnxiety"],
  behavioralProfile:
    "Maintains strong emotional distance through self-sufficiency... (includes integrated pattern nuances)"
}
```
