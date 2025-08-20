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

## Relational Portraits

Relational Portraits are shared reflections created when you connect your account with a partner.  
They show how your emotional patterns align, differ, and meet in relationship.

[ LIST OF REPORT CARDS IN A GRID ]

Card structure:

- Title
- Description
- Completed date
- Call to actions
- Price (each card has a price of 1 token)
- Traits required for generation
- Image

Notes:

- CTA’s on cards:
  - View insights (when done)
  - Generate insights (when not done)
  - Regenerate insights (when traits changed)

---

## My Profile

A page with user settings.

Blocks top to bottom:

- User box (name, avatar, email verification badge, language selector, logout button)
- Subscription block — shows plan, manage subscription button linking to Stripe, information, available tokens
- Legal & support — terms and policy
- Danger zone — delete account
