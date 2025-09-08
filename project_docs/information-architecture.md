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

The Reflection Companion is the chat interface.

### UX

- When opened for the first time, shows **3–4 curated prompt suggestions** (based on traits and universals).
- Prompts can also be accessed at any time via a floating ✨ button, opening a filtered library.
- Input area at the bottom for user messages.

### Chat Modes

- **Standard (default):** 1 Spark = 20 messages
- **Depth (toggle):** 1 Spark = 5 messages
- Free tier: first 3 standard messages after onboarding

### Balance & Feedback

- Sparks balance always visible in the sidebar and profile
- After each deduction, show confirmation:
  - Success → “✨ Message sent. [X Sparks left]”
  - Low balance (<3 Sparks) → refill suggestion
  - At 0 Sparks → blocking prompt “✨ Time to Refill Sparks”

---

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

## Inner Portraits (Individual Reports)

Your Inner Portraits are a growing collection of emotionally attuned reflections based on your unique traits.  
They bring together different layers of who you are — how you connect, care, grow, and respond to the world around and within you.

[ LIST OF REPORT CARDS IN A GRID ]

Card structure:

- Title
- Description
- Completed date
- Call to actions
- Price in Sparks
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

- Header: “Relational Portraits — Shared reflections when you connect with a partner”
- Partner Sync Setup Block → invite partner (link/code/email)
- Locked Reports Grid → grayed-out previews

#### State 2: Pending Invitation Sent

- Invitation status + actions (cancel/resend)
- Locked Reports Grid

#### State 3: Invitation Received

- Invitation block with accept/decline
- Note: partner must complete core traits first
- Locked Reports Grid

#### State 4: Active Partner Sync

- Connected partner status
- “Manage Connection” modal available
- Active Reports Grid (Couple Snapshot free, Relationship Compass paid, etc.)

**Report Cards include:**

- Title
- Description
- Completion date
- Price in Sparks
- Required traits indicator
- Access note: “Both partners can view when one pays”
- CTA based on state (Generate / View / Regenerate)

---

## My Profile

A page with user settings.

Blocks top to bottom:

- User box (name, avatar, email, language selector, logout)
- Sparks balance + purchase packs
- Legal & support links
- Danger zone — delete account

---

## Order Success Page

✨ Sparks Successfully Added!

Your Purchase:

- 50 Sparks ✨ — €17.99
- Transaction ID: #12345

Your Balance: 53 Sparks ✨  
(Previous: 3 Sparks + 50 new Sparks)

Ready to explore deeper?  
[Generate Premium Report] [Continue Reflection Chat] [Return to Profile]

Support: hello@withinly.app
