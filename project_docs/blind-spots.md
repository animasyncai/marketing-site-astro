# Blind Spots & Critical Risk Assessment

This document identifies potential vulnerabilities in the product, business model, and operational strategy.
Last updated: January 2025 - Post-critical issues resolution, pre-beta launch.

---

## 🚨 Critical (Immediate Attention Required)

### 1. Data Privacy, Security & GDPR Compliance ✅ ADDRESSED

**Status:** Core compliance achieved for MVP

**Completed:**

- Privacy Policy updated with GDPR-compliant language (`privacy-policy.md`)
- Third-party processors disclosed (OpenAI, Stripe, Mixpanel, Mailjet)
- EU data storage confirmed (AWS EU-Central)
- User rights clearly documented (access, deletion, export, correction)
- Data retention policies defined
- Breach notification process outlined

**Remaining for later:**

- Professional security audit
- Penetration testing
- Advanced encryption review
- Cookie consent banner (if needed)

---

### 2. Content Moderation, Crisis Response & Mandatory Reporting ✅ ADDRESSED

**Status:** MVP crisis handling in place

**Completed:**

- Crisis detection added to consultant prompt (`consultant.md`)
- Crisis resources provided inline (988, 112, crisis text line)
- Internal protocol documented (`internal-crisis-handling-protocol.md`)
- Clear "not a crisis service" disclaimers throughout

**Approach:** Lightweight - AI detects and redirects, no complex monitoring infrastructure for MVP

**Remaining for later:**

- Lawyer consultation on mandatory reporting obligations
- Mixpanel event tracking for crisis responses
- Human review sampling process

---

### 3. Professional Liability & Terms of Service ✅ ADDRESSED

**Status:** Strong legal protection in place

**Completed:**

- Terms of Service updated with comprehensive disclaimers (`terms-of-service.md`)
- "Not therapy" language strengthened
- AI limitations explicitly stated
- User responsibility for decisions clarified
- Liability limitations added
- Version tracking system designed
- Onboarding disclaimers created (`warning-liability-terms.md`)

**Remaining for later:**

- Professional liability insurance consultation
- Lawyer review of final terms before public launch

---

### 4. Partner Sync Safety & Toxic Relationship Dynamics ✅ ADDRESSED

**Status:** Safety warnings implemented

**Completed:**

- Warning modal designed and documented (`warning-liability-terms.md`)
- "Don't sync if" abuse prevention language
- Unlink = data deletion clearly communicated
- Terms of Service includes Partner Sync clauses
- Checkbox confirmation required before connecting

**Implementation:** Ready to code, design complete

**Remaining for later:**

- Abuse pattern detection research
- Enhanced safety protocols for vulnerable users

---

## ⚠️ High Priority (Address Before Scale)

### 5. Quality Control & AI Response Monitoring at Scale

**Risk:** Highly personalized AI responses can't be manually reviewed. Bad advice could spread undetected.

**Questions:**

- How do you ensure quality when you can't review every conversation?
- What if the AI gives harmful relationship advice?
- How do you detect when consultant responses go off-rails?
- What's your QA sampling strategy? (random audits, flagged content review)
- Who reviews concerning AI behaviors?
- How do you update consultant prompt when issues emerge?

**Impact:** User harm, reputation damage, scaling blocked by quality concerns.

**Action needed:** QA protocol, automated quality metrics, human review system.

---

### 6. AI Vendor Lock-in & Cost Volatility

**Risk:** Heavy OpenAI dependency with thin margins (especially on chat).

**Questions:**

- What if GPT-4.1 pricing increases 3x?
- What if model behavior changes after updates, breaking your prompts?
- What if OpenAI restricts psychological use cases in their terms?
- Can you migrate to alternative models without rebuilding everything?
- What's your break-even if AI costs double?

**Impact:** Margin destruction, forced price increases, business model failure.

**Action needed:** Cost monitoring alerts, alternative model testing, margin sensitivity analysis.

---

### 7. Relationship Status Changes & Data Relevance

**Risk:** Life changes (breakups, new relationships) make existing data outdated or emotionally painful.

**Questions:**

- User breaks up with partner they synced with—what happens to couple data?
- Do reports become irrelevant after breakup?
- Should you offer "post-relationship reflection" reports?
- How do you handle Partner Sync unlinking gracefully?
- What if someone enters a new relationship—do they start fresh or carry old data?
- Can past relationship patterns inform future ones without being traumatic?

**Impact:** User churn, emotional harm, data relevance decay.

**Action needed:** Relationship status change UX flow, data archival vs deletion options.

---

### 8. Trait Validity & Professional Credibility

**Risk:** Simplified psychological frameworks may not withstand professional scrutiny or user skepticism.

**Questions:**

- Are 12 questions enough for valid attachment assessment?
- What happens when users don't recognize themselves in results?
- How will licensed therapists react to your simplified frameworks?
- Can you defend your methodology against academic critique?
- What if users feel "mis-typed" and lose trust?
- Should you publish validation studies or methodology transparency?

**Impact:** Credibility loss, professional backlash, user distrust.

**Action needed:** Methodology documentation, potential validation study, expert advisory board.

---

### 9. Retention After Free Tier Exhaustion

**Risk:** Your break-even scenarios assume 4-8% conversion. Actual could be <2%.

**Questions:**

- What if actual conversion is <2% in beta?
- Is your free tier too generous? (3 Sparks + free Couple Snapshot + free traits)
- What's your fallback monetization if pay-per-Spark doesn't work?
- Should you introduce a low-tier subscription ($2.99/month) for retention?
- How do you re-engage users who exhausted free Sparks and didn't buy?

**Impact:** Revenue model failure, runway burn, forced pivot.

**Action needed:** Beta conversion tracking, fallback monetization options, re-engagement experiments.

---

## 📋 Medium Priority (Monitor & Plan)

### 10. Competitor Response & Moat Defensibility

**Observation:** Your psychological prompts are your main moat, but large players could replicate quickly.

**Questions:**

- What stops Paired, Lasting, or BetterHelp from adding trait assessments?
- What stops OpenAI from offering "relationship coaching" with ChatGPT?
- Can you patent or protect your methodology?
- What's your 2-year advantage window?

**Impact:** Competition erosion, forced differentiation, market share loss.

**Strategy:** Build brand + community moat, focus on couples market they ignore, consider B2B (therapists).

---

### 11. Multi-Language Quality & Cultural Adaptation

**Risk:** Psychological concepts don't translate 1:1 across cultures.

**Questions:**

- Will Lithuanian translations maintain nuance of English prompts?
- Do "love languages" have cultural validity outside Western contexts?
- Are attachment styles universal or culturally influenced?
- Cost of maintaining prompt quality across languages?
- Do you need culturally-adapted assessments vs direct translations?

**Impact:** Poor user experience in non-English markets, wasted translation investment.

**Strategy:** Start with English-speaking markets, pilot Lithuanian carefully, learn before expanding.

---

### 12. Trait Staleness & Data Validity Over Time

**Risk:** User completed traits 8 months ago but consultant is working with outdated data.

**Questions:**

- How do you detect when traits are stale?
- Should you auto-prompt retakes after 6 months?
- What if users have genuinely changed but don't realize it?
- Do you discount older data in consultant responses?
- How do you encourage retakes without being annoying?

**Impact:** Poor AI guidance, user frustration ("This doesn't fit me anymore").

**Strategy:** Add "last updated" timestamps, gentle retake prompts, version tracking for reports.

---

### 13. Polyamorous & Non-Traditional Relationships (Future Scope)

**Observation:** Partner Sync is 1:1 only, but alternative relationship structures exist.

**Questions:**

- Market opportunity or scope creep?
- Could you support polyamorous relationships (multiple syncs)?
- What about chosen family, non-romantic deep friendships?
- Is this a differentiation opportunity or distraction?

**Impact:** Market expansion vs focus dilution.

**Strategy:** Monitor demand signals in beta, keep as Phase 2+ feature.

---

## 📊 Monitoring (Partially Addressed, Track Metrics)

### 14. Chat Pricing Perception (Addressed by tiered model)

**Status:** You have 20 msgs/Spark (Standard) vs 5 msgs/Spark (Depth).

**Monitor:** Do users perceive this as fair value? Track Spark spending ratio (chat vs reports).

---

### 15. User Expectation Management (Addressed in positioning)

**Status:** Clear "not therapy" positioning in copy.

**Monitor:** Do users still push boundaries? Track support tickets asking for diagnosis/advice.

---

### 16. Chat Conversation Limits (Addressed by pricing tiers)

**Status:** Standard mode = affordable depth, Depth mode = premium quality.

**Monitor:** Are users satisfied with message limits? Do they feel nickeled-and-dimed?

---

## 🎯 Pre-Beta Launch Checklist

**Critical Items - COMPLETE:**

- [x] Crisis response system (prompt + protocol)
- [x] Terms of Service updated with strong disclaimers
- [x] Privacy Policy GDPR-compliant
- [x] Partner Sync safety warnings designed
- [x] Onboarding disclaimers created

**Before Beta:**

- [ ] Implement version tracking for Terms/Privacy acceptance
- [ ] Add onboarding disclaimer screen
- [ ] Add Partner Sync warning modal
- [ ] Test crisis detection in consultant
- [ ] Update website footer with Terms/Privacy links

**During Beta:**

- [ ] Monitor conversion rates carefully
- [ ] Track quality issues in AI responses
- [ ] Collect feedback on trait accuracy
- [ ] Test relationship status change flows

**Before Public Launch:**

- [ ] Professional liability insurance consultation
- [ ] Lawyer review of Terms/Privacy
- [ ] Security audit consideration
- [ ] QA protocol for AI responses

---

**Note:** Critical legal and safety issues are addressed for MVP. Focus now shifts to implementation and beta testing. Post-beta, prioritize based on user feedback and actual risk manifestation.
