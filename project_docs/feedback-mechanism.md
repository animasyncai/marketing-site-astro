# Feedback Mechanism

This document is a guide for how we will track user feedback and engagement.

## 🔑 Main Events

Always attach necessary identifiers (`userId`, `traitId`, `reportType`, etc.) to ensure context is preserved.

### User Lifecycle Events

- **User Registered**
  `{ userId, source }`

- **User Logged In**
  `{ userId, source }`

- **User Deleted**
  `{ userId }`

### Onboarding Events

- **Onboarding Completed** ‼️
  `{ userId, durationSeconds, startingPath, sparksRemaining }`
  - `startingPath`: 'connection_map' | 'trust_safety' | 'inner_compass' | 'skip'
  - `sparksRemaining`: Spark balance after onboarding (typically 4)

### Trait Events

- **Trait Completed** ‼️
  `{ userId, traitId, results, totalTraitsCompleted }`
  - `traitId`: 'attachment' | 'love_language' | 'mindfulness' | 'self_acceptance'
  - `results`: Full object with primary, intensity, scores, etc.
  - `totalTraitsCompleted`: Running count (1-4)

- **Trait Retaken** ‼️
  `{ userId, traitId, changed, costSparks, previousResults, currentResults }`
  - `changed`: Boolean - did primary result change?
  - `costSparks`: 0 (free after 30 days) or 1 (paid before 30 days)
  - `previousResults`: Full results object from previous completion
  - `currentResults`: Full results object from current completion

### Report Events

- **Report Generated** ‼️
  `{ userId, reportKey, reportType, tokensSpent, tokensRemaining }`
  - `reportType`: 'inner_portrait' | 'relational_portrait' (distinguishes solo vs couple)
  - `reportKey`: Unique identifier for specific report
  - `tokensRemaining`: Spark balance after generation

### Spark Economy Events

- **Sparks Deducted** ‼️
  `{ userId, featureType, featureName, sparksSpent, sparksRemaining }`
  - `featureType`: 'trait_retake' | 'basic_report' | 'premium_report' | 'chat_standard' | 'chat_depth'
  - `featureName`: Report name (e.g., 'Conflict Compass') or null for chat/traits
  - Unified event for all Spark spending across platform

- **Sparks Low Warning** ‼️
  `{ userId, sparksRemaining, actionAttempted }`
  - Triggered when balance drops to 0-2 Sparks
  - `actionAttempted`: What user tried to do when warning shown (or null)

### Partner Sync Events

- **Partner Invite Sent** ‼️
  `{ userId }`

- **Partner Invite Accepted** ‼️
  `{ userId, partnerUserId }`
  - `userId`: Person who accepted invite
  - `partnerUserId`: Person who sent invite

### Chat Events

- **Chat Session**
  `{ userId, turns, sessionLength, averageUserMessageLength, completedTraits }`
  - Fired when session ends (navigation away or timeout)

- **Chat Feedback**
  `{ userId, conversationTurn, messageLength, primaryFeedback, secondaryFeedback }`
  - Per-message feedback from user

---

## 🔁 Chat Session Logic

A chat session is defined as the period of continuous conversation between a user and the AI.

- **Start**:
  - First user message in a new conversation window
  - OR user explicitly opens chat UI after not being active
- **End**:
  - User **navigates away** from chat
  - OR **15 minutes of inactivity** pass with no new messages
- **Implementation notes**:
  - Use a background timer to detect inactivity.
  - Reset timer on every new message.
  - If timer exceeds 15 minutes, fire `Chat Session` event.
  - If user reopens chat later, a new session starts.

```jsx
// Example pseudo-code
onUserMessage() {
  if (!sessionActive) {
    startChatSession();
  }
  resetInactivityTimer();
}

onInactivityTimeout() {
  endChatSession(reason="timeout");
}

onNavigationAway() {
  if (sessionActive) {
    endChatSession(reason="navigation");
  }
}
```

---

## ⭐ Feedback Events

Feedback should be contextual, quick, and lightweight.

- **Trait Feedback (after results page)**
  `trait_accuracy: 1-5`
- **Report Feedback (at bottom of report)**
  `report_insightfulness: 1-5 stars`
- **Chat Feedback (per AI message)** (NOT MVP)
  - **Primary (always visible):** 👍 Helpful / 👎 Not helpful
  - **Secondary (on click):**
    - Positive: ❤️ Resonated / 💡 New perspective / 🎯 Needed / 🤝 Good direction
    - Negative: 🤔 Missed the point / 😔 Misunderstood / 🌊 Too surface level / 🔄 Off track

---

## 📝 Example Mixpanel Code

```jsx
// Registration & onboarding
mixpanel.track('User Registered', { userId, source: 'organic' })
mixpanel.track('Onboarding Completed', {
  userId,
  durationSeconds: 240,
  startingPath: 'connection_map',
  sparksRemaining: 4
})

// Traits
mixpanel.track('Trait Completed', {
  userId,
  traitId: 'attachment',
  results: { primary: 'AVOIDANT', intensity: 'STRONG', ... },
  totalTraitsCompleted: 2
})

mixpanel.track('Trait Retaken', {
  userId,
  traitId: 'attachment',
  changed: true,
  costSparks: 1,
  previousResults: { ... },
  currentResults: { ... }
})

// Reports
mixpanel.track('Report Generated', {
  userId,
  reportKey: 'inner_portrait_abc123',
  reportType: 'inner_portrait',
  tokensSpent: 3,
  tokensRemaining: 5
})

// Sparks
mixpanel.track('Sparks Deducted', {
  userId,
  featureType: 'premium_report',
  featureName: 'Conflict Compass',
  sparksSpent: 3,
  sparksRemaining: 5
})

mixpanel.track('Sparks Low Warning', {
  userId,
  sparksRemaining: 2,
  actionAttempted: 'premium_report'
})

// Partner Sync
mixpanel.track('Partner Invite Sent', { userId })
mixpanel.track('Partner Invite Accepted', {
  userId, // acceptor
  partnerUserId // sender
})

// Chat sessions
mixpanel.track('Chat Session', {
  userId,
  turns: 12,
  sessionLength: 600,
  averageUserMessageLength: 110,
  completedTraits: ['love_language', 'attachment']
})

// Chat feedback
mixpanel.track('Chat Feedback', {
  userId,
  conversationTurn: 8,
  messageLength: 120,
  primaryFeedback: 'positive', // or 'negative'
  secondaryFeedback: 'resonated' // or null
})
```

---

## 📊 Deprecated Events

- **ChatTokenUsed** - Replaced by `Sparks Deducted` for unified Spark tracking

---

# TEXTS

## 🧩 Trait Feedback

**Prompt text:**

> "How accurate did this feel?"

**Buttons:**

- 👎 _Didn't fit me_
- 🤷 _Somewhat_
- 👍 _Felt true_

---

## 📖 Report Feedback

**Prompt text:**

> "How insightful was this?"

**Stars:**

- ⭐ _Not useful_
- ⭐⭐ _A little useful_
- ⭐⭐⭐ _Somewhat helpful_
- ⭐⭐⭐⭐ _Very helpful_
- ⭐⭐⭐⭐⭐ _Deeply insightful_

---

## 💬 Chat Feedback (NOT MVP)

**Primary prompt (always visible):**

> "Was this response helpful?"

**Buttons:**

- 👍 _Helpful_
- 👎 _Not helpful_

**Secondary (on click):**

- If 👍 Helpful →
  - ❤️ _Really resonated_
  - 💡 _New perspective_
  - 🎯 _Exactly what I needed_
  - 🤝 _Good direction_
- If 👎 Not helpful →
  - 🤔 _Missed the point_
  - 😔 _Felt misunderstood_
  - 🌊 _Too surface level_
  - 🔄 _Completely off track_

---

## 🧭 Optional Meta-Satisfaction Pulse

After 2–3 key actions (like finishing first report or 3rd chat session):

**Prompt text:**

> "How helpful has Withinly been so far?"

**Scale (1–5):**

- 1: _Not at all_
- 2: _A little_
- 3: _Somewhat_
- 4: _Very_
- 5: _Extremely helpful_

GOAL: TRACKING NPS (NET PROMOTER SCORE)
