# Sparks & Pricing Strategy

Withinly uses **✨ Sparks** as the in-app currency for unlocking reports, chat, and partner insights.  
This balances **user clarity**, **fair value**, and **sustainable margins**.

---

## 💸 Original AI Costs (Reference Only)

(All costs are approximate averages in USD, based on GPT-4.1 usage unless stated otherwise.)

- **Basic report** → $0.015
- **Premium solo report** → $0.04
- **Couple snapshot** → $0.016
- **Couple premium report** → $0.025
- **Chat message** → $0.03 (GPT-4.1) / $0.0077 (GPT-4.1 mini)
- **Translations** → negligible, $0.0005 with GPT-4.1 mini (absorbed)
- **Infrastructure** → ~$0.05 per user/month

---

## ⚡ Model Strategy

- **Reports** → GPT-4.1 (fast, sophisticated, premium quality)
- **Chat** → Default = GPT-4.1 mini (cost-efficient), optional toggle to GPT-4.1 “Pro Depth”
- **Translations** → GPT-4.1 mini (absorbed)
- **Consultant recommendations (trait completion/change)** → invisible background calls, absorbed into margin (controlled by cooldowns + batching to prevent bleed)

---

## 🎯 Feature Pricing (User-Facing)

- **Traits (initial run)** → Free
- **Trait retake (after 30 days)** → 1 Spark
- **Basic report** → 1 Spark
- **Premium solo report** → 3 Sparks
  - Inner Portrait Full may later rise to 4 Sparks
- **Couple Snapshot** → Free (first sync), then 1 Spark
- **Premium couple report** → 3 Sparks
  - (Future: may rise to 4–5 Sparks due to higher value perception)
- **Chat (Mini)** → 1 Spark = 20 messages
- **Chat (Pro Depth)** → 1 Spark = 5 messages

---

## 🆓 Free Tier

- **3 Sparks** on signup
- **First Couple Snapshot free**
- Growth hooks: +1 Spark if partner connects, +1 if both finish traits quickly

This ensures users taste **solo reports, couple insights, and chat** before hitting a paywall.

---

## 💰 Spark Value

- Target retail price: **€0.40–0.50 per Spark** (depending on bundle size)
- Gross margins:
  - **Reports** → 95–98%
  - **Chat** → ~65–70%
- This blend ensures reports subsidize higher-frequency chat usage.

---

## 📦 Bundles

- 5 Sparks — €2.50
- 10 Sparks — €4.50
- 25 Sparks — €9.99
- 50 Sparks — €17.99

---

## 📅 Subscriptions (Phase 2, Not MVP)

- **Solo** — €7.99 / month → 25 Sparks
- **Couples** — €14.99 / month → 60 Sparks
- **Rollover**: unused Sparks carry for 1 month
- Framed as **“value packs”**, not paywalls

---

## 🖥️ UX Considerations

- Always show both **Sparks** and **€ equivalent** (based on user’s bundle).
- Spark balance always visible (sidebar + profile).
- Feedback after each action:
  - Success → “Report generated. ✨ 6 Sparks left.”
  - Failure → “Something went wrong. Sparks not deducted. ✨ 6 Sparks left.”
- Low-balance nudges:
  - <3 Sparks → show subtle refill prompt
  - 0 Sparks → blocking prompt “✨ Time to Refill Sparks”

---

## 🧭 Strategic Notes

- **Start conservative** (lower couple pricing) → leaves room to increase later.
- **Anchor value in couple reports** — strongest conversion driver.
- **Traits free** for first run — keeps onboarding smooth. Retakes + advanced insights monetize later.
- **Consultant recommendations** → treated as infrastructure cost. Cooldowns + batching reduce bleed.
- **Long-term retention** will rely on:
  - New premium reports (Conflict, Communication, Trust, etc.)
  - Partner Sync as a repeat-purchase hook
  - Subscriptions as stability layer

# UX CONSIDERATIONS AROUND SPARKS:

1. After successful report generation user needs to receive feedback message identifying success and telling how much sparks are left.
   Ex. Report has been generated. [X] ✨ Sparks remaining.
2. After unsuccessful report generation user needs to receive feedback message identifying failure and telling that sparks have not been deducted.
   Ex. There was a mistake - [ERROR]. Report has not been generated. Sparks have not been deducted. [X] ✨ Sparks remaining.
3. Sparks balance is always visible in the left sidebar above profile. "You have [X] Sparks"
   3.1 Clicking on it opens a modal with the following content:
   {TODO WRITE DOWN THE CONTENT OF THE MODAL}
   3.2 Every time sparks are deducted, the balance is updated and the spark pulses (animation).
   3.3 If balance is < 3 sparks - it changes color
4. Sparks balance is always visible in the profile itself.
5. If sparks are < 3 we start showing a notification box (which can be turned off - local storage) that says..
   5.1 {TODO WRITE DOWN THE CONTENT OF THE NOTIFICATION BOX}
6. If sparks are 0 show a notificion box (not togglable) that says...
   Time to Refill Sparks ✨
   You've used all your Sparks exploring your patterns. Ready to go deeper?
   [Get more Sparks ✨]
7. In settings show a breakdown of sparks usage (Recent activity). A simple table with the following columns: - Feature (Chat - [X messages], Report - [Name], Trait - [Name]) - Cost - Date
   7.1 Group chat events together if they happen one after another

## Final copy for displaying sparks

### ✨ Sparks Balance

Available: 32 Sparks

5 Sparks — €2.50
Quick top-up for quick reflection or a premium report

10 Sparks — €4.50
Enough for 3 premium reports or ~200 reflectionmessages

25 Sparks — €9.99
Most popular — balanced for regular use

50 Sparks — €17.99
Best value — ideal for deep dives or couples

Notes (below packs, small text)

- Bigger packs = lower price per Spark
- Sparks never expire
- Couple reports unlock for both partners when one pays
