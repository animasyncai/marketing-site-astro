# Withinly Beta Testing Protocol - Lean & Fast

## Testing Objectives

**4 core questions:**

1. Do singles or couples show stronger product-market fit?
2. Do users prefer reports or chat? (Margin implications)
3. Will users pay for Sparks when free ones run out?
4. Is Partner Sync safe for relationships?

**Success = Clear answer to: "Who's our customer and will they pay?"**

---

## User Recruitment (30 total)

**Cohort Breakdown:**

- **10 Singles** - Test solo value proposition
- **16 Couples** (8 pairs) - Test Partner Sync + relationship features
- **4 Dating/Complicated** - Edge case validation

**Recruitment sources:**

- Personal network (ask for intros, avoid close friends)
- Reddit: r/attachment_theory, r/relationships
- Social posts targeting psychology/self-development crowd
- Indie maker/psychology professional communities

### Screening Form (Google Form Structure)

**Form Title:** Withinly Beta Application

**Form Description:**
We're running a closed beta with 30 testers. Applications reviewed daily - first come, first served until spots fill.

---

**Question 1: What's your relationship status?**
(Multiple choice - required)

[ ] Single
[ ] Couple (both partners ready to participate)
[ ] Dating / It's complicated

---

**[Section: If "Single" selected]**

Your email: \***\*\_\_\_\*\***
(Short answer - required)

Your first name: \***\*\_\_\_\*\***
(Short answer - required)

---

**[Section: If "Couple" selected]**

Your email: \***\*\_\_\_\*\***
(Short answer - required)

Your first name: \***\*\_\_\_\*\***
(Short answer - required)

Your partner's email: \***\*\_\_\_\*\***
(Short answer - required)

Your partner's first name: \***\*\_\_\_\*\***
(Short answer - required)

**Confirmation:**
(Checkbox - required)
[ ] My partner knows I'm signing us up and wants to participate

---

**[Section: If "Dating / It's complicated" selected]**

Your email: \***\*\_\_\_\*\***
(Short answer - required)

Your first name: \***\*\_\_\_\*\***
(Short answer - required)

**Note:** You'll get a solo beta slot. If your situation changes and your partner wants to join, email us at hello@withinly.app - we might have spots.

---

**[All respondents see these questions]**

Age range?
(Multiple choice - required)
[ ] 18-24
[ ] 25-34
[ ] 35-44
[ ] 45+

Have you done therapy or counseling?
(Multiple choice - required)
[ ] Yes, currently
[ ] Yes, in the past
[ ] No, but interested
[ ] No

What draws you to understanding relationship patterns?
(Paragraph - required - 1-2 sentences)

---

Available for a 20-30 min interview call in Week 3-4?
(Multiple choice - required)
[ ] Yes
[ ] No
[ ] Maybe

---

**Form closing text:**
We'll email you within 2 days if selected. Spots are limited to 30 testers.

## Questions? hello@withinly.app

---

## Sparks Distribution (Simple & Generous)

**Initial allocation:**

- Singles: 15 Sparks
- Couples: 25 Sparks (shared when synced)
- Dating: 15 Sparks

**Why generous:** Remove artificial constraints. Let them explore freely to see what they value.

**When depleted:** Manual offer (see below)

---

## Automated Emails (Minimal Dev Work)

### 1. Welcome Email (Day 0)

See `emails/0-day-welcome.md`

---

### 2. Day 3 Pulse Check

See `emails/3-day-pulsecheck.md`

---

### 3. Day 10 Check-in

See `emails/10-day-checkin`

---

### 4. Partner Sync Safety Check (Day 7 After Sync)

See `emails/7-days-aftersync.md`

---

### 5. Low Spark Warning (At 3 Sparks)

See `emails/low-spark-3.md`

---

## Manual Depletion Handling (Your Daily Task)

**Backend alert needed:** Daily email listing users at 0 Sparks

**Your process (15-30 min/day):**

1. Check daily alert: who hit 0 Sparks?
2. Send personal offer email (template below)
3. Log in spreadsheet: User ID, Date sent, Response, Paid Y/N
4. Follow up after 3 days if no response

**Offer Email Template:**

See `emails/spark-depletion-email.md`

**Track in spreadsheet:**

- Date sent
- Response (paid/declined/reason)
- Follow-up needed? (Y/N)

---

## Interview Protocols

### Singles (20 min, 5 users)

**Selection:**

- 2 high engagement (used most features)
- 2 medium engagement
- 1 low engagement (dropped off)

**Questions:**

**Experience (8 min)**

1. Walk me through your first week. What first? Why?
2. Which report most valuable? Screenshot/save anything?
3. Tell me about chat. Worth 1 Spark per 20 messages?
4. Any insights surprise you or change thinking?

**Value (6 min)** 5. If I removed one feature, which would you miss? 6. Would you pay €4.50 for 10 Sparks regularly?

- If yes: What makes it worth that?
- If no: What price feels right? What would make you pay more?

7. Told anyone about Withinly?
   - If yes: How'd you describe it?

**Improvement (4 min)** 8. What frustrated you most? 9. One change before launch? 10. Anything else I should know?

**Note:** Exact phrases for value, features ignored, emotional reactions

---

### Couples (30 min, 4 pairs)

**Selection:**

- 2 couples who bought premium couple reports
- 1 couple used Snapshot only
- 1 couple with mixed engagement

**Questions:**

**Sync Experience (8 min)**

1. Who suggested syncing? How'd that conversation go?
   - [To other partner]: How'd you feel about suggestion?
2. Couple Snapshot accurate? Surprises?
3. Discuss insights together? How'd that go?
4. [If purchased]: Why upgrade to full report?
   - [If not]: What stopped you?

**Relationship Impact (10 min)** 5. Anything changed in communication? 6. Did insights become "ammunition" in arguments? 7. [To each separately]: Feel safer or less safe being this visible? 8. Use this for 6 months?

**Pricing (6 min)** 9. Would you pay €4.50 each for 10 Sparks when needed?

- Who'd pay if only one could?

10. Compare: €6/month Paired (daily questions), €30/month Lasting (courses)
    - Where does Withinly fit?

**Improvement (4 min)** 11. What almost made you quit? 12. Fix before launch?

**Red flags to note:**

- Power dynamics
- One partner dominates
- Defensiveness about insights
- "Proving" or "showing" language

---

### Dating/Complicated (20 min, 1 user)

**Questions:**

1. Why use without committed relationship?
2. Consider syncing? Why/why not?
3. Use differently than couples would?
4. Insights change dating approach?
5. Recommend to someone in your situation?

---

## Tracking System (Simple Spreadsheet)

### Main Sheet

**Columns:**
User ID | Cohort | Traits | Sparks: Reports/Chat/Sync | Days to 0 | Offer Sent | Paid? | Amount | Last Active | Interview | Notes

**Example:**
U001 | Single | 4/4 | 3R/6C/0S | Day 12 | Day 13 | No - too expensive | - | Day 14 | Yes | Wanted €2/10 Sparks
U002 | Couple | 4/4 | 1R/2C/6S | Day 18 | Day 18 | Yes | €3.50 | Day 25 | Yes | Bought premium couple report

### Couple Sheet

**Columns:**
Couple ID | Invite | Sync | Days to Accept | Snapshot | Premium? | Safety Flag | Interview | Notes

### Weekly Calculations

**Engagement:**

- % complete 4/4 traits
- Average days to depletion
- % return after depletion

**Spending:**

- % Sparks on: Basic Reports / Premium Reports / Chat / Couple
- Average chat messages per user
- Most popular report

**Conversion:**

- % who pay when offered
- Average amount willing to pay
- Reasons for declining

**Partner Sync:**

- % couples who sync
- % buy premium after Snapshot
- % report tension (safety flags)

---

## Decision Framework (Week 5)

### 1. Market: Singles vs Couples?

**Compare:**

- Engagement: Trait completion, active days, feature usage
- Conversion: % paid, average willing to pay
- Retention: % still active Week 4
- Interview feedback: Value perception, recommendations

**If Couples Win (2x better metrics):**

- Focus all marketing on couples
- Keep pricing: Pay-per-Spark with couple reports
- Position: "Understand why you fight - and how to reconnect"
- Deprioritize solo features

**If Singles Win:**

- Partner Sync secondary feature
- Position: "Understand your patterns before next relationship"
- Consider therapy-adjacent positioning
- Expand solo report library

**If Neither Wins (<15% convert both):**

- Major pivot required
- Consider: B2B (therapist tool), niche focus, or cut losses

---

### 2. Feature: Reports vs Chat?

**Compare:**

- Spark spending: % on reports vs chat
- Interview mentions: Which feature most valuable
- Margins: Chat eating profits?

**If Chat >70% of spend:**

- **Problem:** Margin collapse at scale
- **Solutions:**
  - Reduce free chat (1 Spark = 10 messages, not 20)
  - Add chat subscription option (€4.99/month unlimited)
  - Restrict to prompt library only

**If Reports Win:**

- Good: High-margin business
- Expand report library
- De-emphasize chat in marketing

---

### 3. Pricing: Will They Pay?

**Analyze offers:**

- % who paid €3.50 for 10 Sparks
- % who said "too expensive" and what they'd pay
- % who were "satisfied" vs "not valuable"

**If ≥20% convert at €3.50:**

- Token model validated
- Launch with: 5/10/25/50 Spark bundles
- Consider slight price increase (€4.50 for 10)

**If 10-20% convert:**

- Model barely viable
- Must improve: feature value OR lower costs OR raise prices
- Test different bundle sizes

**If <10% convert:**

- Token model failed
- Pivot options:
  - Subscription: €4.99/month unlimited
  - Freemium: Free basic, €9.99 premium tier
  - B2B: Therapist dashboard model

---

### 4. Safety: Partner Sync Viable?

**Analyze safety checks:**

- # reports of tension/arguments
- # felt pressured
- # felt unsafe continuing

**Green Light (0-1 incidents):**

- Launch as-is
- Monitor closely post-launch

**Yellow Light (2-3 incidents, resolved):**

- Add relationship health check before sync
- Stronger unlinking language
- Cooldown before re-sync with new partner

**Red Light (4+ incidents or serious harm):**

- Do NOT launch Partner Sync
- Delay to Phase 2
- Consult relationship therapist on design
- Focus solo features first

---

## Success Metrics

### Minimum Viable

- ≥50% complete all 4 traits
- ≥15% pay when offered
- Clear winner: singles OR couples (not both equal)
- Reports ≥3.5 stars average
- Chat <60% of Spark spend
- 0-1 Partner Sync safety incidents

### Strong Success

- ≥70% complete all 4 traits
- ≥25% pay when offered
- Winner shows ≥30% conversion
- ≥3 couples buy premium reports
- Users recommend unprompted
- Clear pricing validation

### Red Flags (Pivot Required)

- <40% complete traits (onboarding broken)
- <10% pay (value problem)
- Chat >70% spend (margin crisis)
- Multiple safety incidents (ethical problem)
- No cohort winner (market confusion)

---

## Timeline & Effort

### Week 0 (Pre-Launch) - 2-3 days setup

- [ ] Recruit 8 couples (both partners confirmed)
- [ ] Recruit 10 singles + 4 dating
- [ ] Set up automated emails (5 emails total)
- [ ] Create backend alert: Daily 0-Spark user list
- [ ] Prepare tracking spreadsheet
- [ ] Write depletion offer template
- [ ] Block calendar for interviews

### Week 1 - 30 min/day

- [ ] Send welcome emails (first 10 users: 3 couples, 4 singles)
- [ ] Monitor trait completions
- [ ] Send Day 3 pulse checks
- [ ] Respond to support questions

### Week 2 - 45 min/day

- [ ] Onboard remaining 20 users
- [ ] Send Day 3 pulse checks to new users
- [ ] Send Day 10 checks to Week 1 users
- [ ] Watch couple sync rates
- [ ] Start manual depletion offers (if anyone hits 0)

### Week 3 - 1-2 hours/day

- [ ] Send Day 10 checks to Week 2 users
- [ ] Send Partner Sync safety checks (7 days after sync)
- [ ] Handle depletion offers (daily check + emails)
- [ ] Schedule and conduct 5 single interviews (20 min each)
- [ ] Track conversion in spreadsheet

### Week 4 - 1-2 hours/day

- [ ] Continue depletion offers
- [ ] Conduct 4 couple interviews (30 min each)
- [ ] Conduct 1 dating/complicated interview
- [ ] Monitor late adopters
- [ ] Note patterns in spreadsheet

### Week 5 (Analysis) - 1 full day

- [ ] Calculate all metrics
- [ ] Synthesize interview themes
- [ ] Make market decision: singles/couples/pivot
- [ ] Make feature decision: reports/chat balance
- [ ] Make pricing decision: keep tokens/pivot
- [ ] Document findings
- [ ] Plan next steps

**Total time investment:**

- Setup: 2-3 days
- Running: ~30-60 min daily for 4 weeks
- Interviews: 10 hours total (Week 3-4)
- Analysis: 1 day (Week 5)

---

## What You Actually Build

**Automated (worth dev time):**

- 5 email templates with scheduled sends
- Backend alert: Daily list of 0-Spark users
- €3.50 payment link for 10 Sparks

**Manual (you handle):**

- Depletion offer emails (daily task)
- Interview scheduling
- Tracking spreadsheet updates
- Safety flag follow-ups

**You DON'T build:**

- Complex A/B/C splits
- Automated voucher system
- Multiple pricing tests
- Subscription infrastructure

---

## Post-Beta Next Steps

### If Clear Winner

1. Fix critical UX issues from feedback
2. Focus marketing on winning cohort
3. Adjust pricing based on conversion data
4. Prepare launch materials
5. Set up proper analytics
6. Build referral system

### If Pivot Needed

1. Document what failed and why
2. Explore alternatives:
   - B2B therapist dashboard
   - Niche focus (specific attachment style)
   - Free basic + premium tier
   - Different pricing model
3. Validate pivot with 5 more interviews
4. Decide: iterate or cut losses

---

## Critical Mindset

**You're testing:** Will people pay repeatedly?

**Success looks like:** Clear answer to "who pays and why?"

**Failure looks like:** Everyone lukewarm, no clear winner, nobody pays

**Your job:** Learn fast, kill what doesn't work, double down on what does

**Remember:** This validates market fit, not your vision. Be ready to pivot ruthlessly.

---

## Quick Reference Checklist

**Before starting:**

- [ ] 30 users recruited (8 couples locked in)
- [ ] 5 automated emails set up
- [ ] Daily 0-Spark alert working
- [ ] Tracking spreadsheet ready
- [ ] Interview calendar blocked

**Daily (15-30 min):**

- [ ] Check 0-Spark alert
- [ ] Send depletion offers
- [ ] Update spreadsheet
- [ ] Respond to safety flags

**Weekly:**

- [ ] Calculate engagement metrics
- [ ] Review spending patterns
- [ ] Note emerging themes

**Week 3-4:**

- [ ] Conduct 10 interviews
- [ ] Document quotes and insights

**Week 5:**

- [ ] Full analysis
- [ ] Make decisions
- [ ] Document next steps
