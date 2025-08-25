# Structure

The goal of this document is to lay out content architecture and content itself in order to help you understand how things are connected together.

---

# Main navigation

Main navigation consists of several menu elements (title / url / description for you) in the sidebar:

- Reflection Companion / chat / AI consultant
- Your Traits / traits / main page for trait questionnaires/cards
- Inner Portraits / inner-portrait / Main page for all individual reports
- Relational Portraits / relational-portrait / Main page for couple reports and partner sync
- My Profile / profile / Displayed at the bottom of the sidebar - goes to profile settings

---

## Reflection Companion

It's a chat window so there's no title, it's purely chat. Input area at the bottom.

UX:

- When you open it first time there are prompt suggestions. We think we should add more suggestions based on traits you have and, in the future, based on the goal that you have.
- There's also significant notes — extracted by AI from chat. This window is only seen by admins, but for now it does not work well, so it's experimental.

---

## Your Traits

[ LIST OF TRAIT CARDS IN A GRID ]

Card structure:

- Title
- Description
- Completed date
- Call to actions
- Price (each card has a price of 1 token)

Cards:

- **The Way You Stay Present**  
  Understand how aware you are of your inner world and emotions. This reveals your relationship with mindfulness and your openness to personal growth.

- **The Way You Hear Yourself**  
  Discover how you treat yourself internally — the tone of your inner voice and how compassionately you meet your own emotions and experiences.

- **The Way You Attach**  
  Explore how you form emotional bonds and what you need to feel secure in relationships. Your attachment style shapes how you handle closeness, conflict, and connection.

- **The Way You Love**  
  Discover how you naturally express care and what makes you feel most loved. Understanding your love language helps you connect more deeply with others and communicate your needs clearly.

CTAs on cards (TODO: IMPROVE):

- Start (when not done)
- Check in again (when done)

Notes:

- If less than 30 days have passed since last completion of a trait, we show a notification that it's unlikely the trait has changed.
  - Title: You completed this trait recently
  - Description: Your [trait name] results are from [date]. Psychological patterns typically don't change in under 30 days, so retaking may not provide new insights.
  - Continue anyway?
  - CTA: [Continue] [Go Back]

---

## Inner Portraits (Individual Reports)

Your Inner Portraits are a growing collection of emotionally attuned reflections based on your unique traits.  
They bring together different layers of who you are — how you connect, care, grow, and respond to the world around and within you.

[ LIST OF REPORT CARDS IN A GRID ]

Card structure:

- Title
- Description
- Completed date
- Call to actions
- Price (each card has a price of 1 token)
- Traits required for generation
- Image

CTA’s on cards:

- View insights (when done)
- Generate insights (when not done)
- Regenerate insights (when done, but traits changed)

---

## Relational Portraits (Couple Reports)

### Page Content & States

#### State 1: No Partner Sync

**Page Header:**

- Title: "Relational Portraits"
- Subtitle: "Shared reflections created when you connect your account with a partner. They show how your emotional patterns align, differ, and meet in relationship."

**Partner Sync Setup Block:**

- Title: "Connect with Your Partner"
- Description: "Sync your accounts to unlock couple insights while keeping your individual traits private."
- CTA Button: "Send Partner Invite" → **opens Invitation Modal**
- Secondary info: "Your partner will need to complete their core traits first"

**Locked Reports Grid:**
[ GRID OF LOCKED REPORT CARDS ]

- Each card grayed out with lock icons
- "Requires Partner Sync" overlay
- Preview descriptions visible but no access

---

#### State 2: Pending Invitation Sent

**Page Header:** Same as State 1

**Invitation Status Block:**

- "Invitation sent via [link/code/in-app]"
- "Sent on [date]"
- "Waiting for partner to accept and complete core traits"
- Actions: "Cancel Invitation" | "Resend Invitation"

**Locked Reports Grid:** Same as State 1

---

#### State 3: Invitation Received

**Page Header:** Same as State 1

**Invitation Received Block:**

- "[Partner Name] wants to connect with you for couple insights"
- "Your individual traits will remain private - only shared insights are visible"
- Actions: "Accept Invitation" | "Decline"
- Note: "Complete your core traits first" (if applicable)

**Locked Reports Grid:** Same as State 1

---

#### State 4: Active Partner Sync

**Page Header:** Same as State 1

**Partner Status Block:**

- "Connected with [Partner Name]"
- "Connected on [date]"
- Button: "Manage Connection" → **opens Settings Modal**

**Active Reports Grid:**
[ GRID OF REPORT CARDS ]

**Report Card Content:**

- Title
- Description
- Completion date (if generated)
- Regeneration flag (if traits changed)
- Price in Sparks
- Required traits indicator
- Access note: "Both partners can view when one pays"
- CTA button based on state:
- "Generate insights" (not done)
- "View insights" (completed)
- "Regenerate insights" (needs update)

**Available Reports:**

- Couple Snapshot (Free with first sync)
- Relationship Compass (3 Sparks)
- Conflict Compass - Couple Edition (3 Sparks, Future)

---

### Modal 1: Send Invitation

**Modal Title:** "Invite Your Partner"

**Modal Content:**

- Explanation: "Choose how to invite your partner"

**Invitation Methods:**

1. **Share Link**

- "Generate a link to send via text, email, or messaging"
- Button: "Generate Link"

2. **Share Code**

- "Generate a 6-digit code your partner can enter"
- Button: "Generate Code"

3. **Find by Email** (if partner has account)

- Email input field
- Button: "Send In-App Invitation"

IMPLEMENT WHATEVER IS THE EASIEST AT THE MOMENT.

**Modal Actions:**

- "Cancel" button
- Method-specific "Send" button

---

### Modal 2: Connection Settings

**Modal Title:** "Partner Connection Settings"

**Connection Info Section:**

- Partner's name and avatar
- "Connected on [date]"
- Status: "Active connection"

**Report Access Section:**

- "Generated Reports:"
- List of reports with purchase info:
- "Couple Snapshot - Free"
- "Relationship Compass - Paid by [You/Partner] on [date]"
- Note: "Both partners can view reports when one pays"

**Privacy Section:**

- "Privacy Protection:"
- "✓ Your individual traits remain private"
- "✓ Only shared couple insights are visible"
- "✓ Either partner can unlink at any time"

**Danger Zone:**

- Red border section
- "Unlink Partner" button
- Warning: "This removes access to all couple reports for both partners"

**Modal Actions:**

- "Close" button
- "Unlink Partner" button → **opens Confirmation Modal**

---

### Modal 3: Unlink Confirmation

**Modal Title:** "Unlink Partner?"

**Modal Content:**

- "Are you sure you want to unlink from [Partner Name]?"
- "This will:"
- "• Remove access to all couple reports for both of you"
- "• Cannot be undone"
- "• Your individual traits will remain unaffected"

**Modal Actions:**

- "Cancel" button
- "Yes, Unlink" button (red/warning style)

---

## My Profile

A page with user settings.

Blocks top to bottom:

- User box (name, avatar, email verification badge, language selector, logout button)
- Subscription block — shows plan, manage subscription button linking to Stripe, information, available tokens
- Legal & support — terms and policy
- Danger zone — delete account
