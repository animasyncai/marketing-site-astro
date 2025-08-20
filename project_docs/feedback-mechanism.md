# Feedback Mechanism

This document is a guide for how we will track user feedback and engagement.

## 🔑 Main Events

Always attach necessary identifiers (`user_id`, `trait_type`, `report_type`, `message_pair_id`, etc.) to ensure context is preserved.

- **User Registered (source we will add later)**
  `{ user_id, source }`
- **Onboarding Completed (timers can be added in later stage, now just add event)**
  `{ user_id, duration_sec, steps_completed }`
- **Trait Completed** ‼️
  `{ trait_type, result_label, user_id }`
- **Trait Retaken** ‼️
  `{ trait_type, old_label, new_label, user_id }`
- **Report Generated** ‼️
  `{ report_type, user_id, wi_tokens_spent, success: true/false }`

**NOT MVP:**

- **Chat Session Started**
  `{ user_id, traits_available, has_reports }`
- **Chat Session Ended** (Hybrid logic, see below)
  `{ user_id, turns, duration_sec, avg_msg_length }`

---

## 🔁 Hybrid Chat Session Logic (NOT MVP)

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
  - If timer exceeds 15 minutes, fire `Chat Session Ended` event.
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
mixpanel.track('User Registered', { user_id, source: 'organic' })
mixpanel.track('Onboarding Completed', { user_id, duration_sec: 120, steps_completed: 8 })

// Traits
mixpanel.track('Trait Completed', { trait_type: 'attachment', result_label: 'anxious', user_id })
mixpanel.track('Trait Retaken', { trait_type: 'attachment', old_label: 'anxious', new_label: 'secure', user_id })

// Reports
mixpanel.track('Report Generated', { report_type: 'inner_portrait', user_id, wi_tokens_spent: 3, success: true })

// Chat sessions (NOT MVP)
mixpanel.track('Chat Session Started', {
  user_id,
  traits_available: ['love_language', 'attachment'],
  has_reports: true,
})
mixpanel.track('Chat Session Ended', { user_id, turns: 12, duration_sec: 600, avg_msg_length: 110 })

// Chat feedback
mixpanel.track('Chat Response Reaction', {
  user_id,
  message_pair_id: 'msg_123_response_124',
  primary_reaction: 'positive', // or 'negative'
  response_length: 120,
  time_to_react: 5000,
  conversation_turn: 8,
})

mixpanel.track('Chat Response Detailed Reaction', {
  user_id,
  message_pair_id: 'msg_123_response_124',
  primary_reaction: 'positive',
  detailed_reaction: 'resonated',
  time_to_detail: 2000,
  conversation_turn: 8,
})
```

# TEXTS

## 🧩 Trait Feedback

**Prompt text:**

> “How accurate did this feel?”

**Buttons:**

- 👎 _Didn’t fit me_
- 👍 _Felt true_

---

## 📖 Report Feedback

**Prompt text:**

> “How insightful was this?”

**Stars:**

- ⭐ _Not useful_
- ⭐⭐ _A little useful_
- ⭐⭐⭐ _Somewhat helpful_
- ⭐⭐⭐⭐ _Very helpful_
- ⭐⭐⭐⭐⭐ _Deeply insightful_

---

## 💬 Chat Feedback (NOT MVP)

**Primary prompt (always visible):**

> “Was this response helpful?”

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

> “How helpful has Withinly been so far?”

**Scale (1–5):**

- 1: _Not at all_
- 2: _A little_
- 3: _Somewhat_
- 4: _Very_
- 5: _Extremely helpful_

GOAL: TRACKING NPS (NET PROMOTER SCORE)
