# Structure

The goal of this document is to layout content architecture and content itself in order to help you understand how things are connected together

# Main navigation

Main navigation consistts of several menu elements (title / url / description for you) in the sidebar:

- Relection companion / chat / AI consultant
- Your traits / traits / main page for trait questionnaires/cards
- Inner Portrait / inner-portrait / Main page for all reports
- Relational Portrait / relational-portrait / Main page for vibe reports and partner symc
- My profile / profile / Displated at the bottom of the sidebar - goes to profile settings

## Reflection companion

It's a chat window so there's no title, it's purely chat. Input area at the bottom.

UX:

- When you open it first time there are prompt suggestions. We think we should add more suggestiuons based on traits you have and in the future, based on the goal that you have.
- There's also signficant notes - extracted by AI from chat, a window that is only seen by admins, but for now it does not work well, so it's experimental.

## Your traits

[ LIST OF TRAIT CARDS IN A GRID ]

Cards structure:

- Title
- Description
- Completed date
- Call to actions
- Price (each card has a price of 1 token)

Cards:

- The Way You Stay Present
  - Understand how aware you are of your inner world and emotions. This reveals your relationship with mindfulness and your openness to personal growth.
- The Way You Hear Yourself
  - Discover how you treat yourself internally - the tone of your inner voice and how compassionately you meet your own emotions and experiences.
- The way You attach
  - Explore how you form emotional bonds and what you need to feel secure in relationships. Your attachment style shapes how you handle closeness, conflict, and connection.
- The way You love
  - Discover how you naturally express care and what makes you feel most loved. Understanding your love language helps you connect more deeply with others and communicate your needs clearly.

CTAs on cards (TODO: IMPROVE):

- Start (when not done)
- Check in again (when done)

Notes:

- If less than 30 days have passed since last completion of a trait, we show a notification that it's unlikely that the trait has changed.
  - Title: You completed this trait recently
  - Description: Your [trait name] results are from [date]. Psychological patterns typically don't change in under 30 days, so retaking may not provide new insights.
  - Continue anyway?
  - CTA: [Continue] [Go Back]

## Inner Portrait

Your Inner Portrait is a growing collection of emotionally attuned reflections based on your unique traits.

It brings together different layers of who you are — how you connect, care, grow, and respond to the world around and within you.

[ LIST OF REPORTS CARDS IN A GRID ]

Cards:

- Inner portrait (basic)
  - A gentle summary of your traits — how you tend to connect, protect, and care in relationships. A soft introduction to your emotional patterns.
  - Cost: 1 token (first free)
  - Traits: Attachment, Mindfulness, Self-acceptance
  - Prompt: `/prompts/report_inner-portrait-basic.md`
- Inner Portrait
  - A rich, personalized reflection of your emotional world — how you connect with others, express care, stay grounded, and meet yourself. Includes metaphors.. (Too long, need to shorten)
  - Traits: Attachment, Love Language, Mindfulness, Self-acceptance
  - Cost: 3 tokens
  - Prompt: `/prompts/report_inner-portrait.md`
- Conflict compass
  - A personal guide to how you move through conflict — what unsettles you, what shields you, and what brings you back to connection.
  - Traits: Attachment, Mindfulness
  - Cost: 2 tokens
  - Prompt: `/prompts/report-conflict-map.md`
- Relationship Blueprint
  - A map of how you form, maintain, and experience emotional bonds — what draws you closer, what pushes you away, and what you need to feel safe in connection.
  - Traits: Attachment, Love Language
  - Cost: 2 tokens
  - Prompt: `/prompts/report-relationship-blueprint.md`
- Trust & Vulnerability Map
  - A map of how you open up, build trust, handle emotional intimacy.
  - Traits: Attachment, Self-acceptance
  - Cost: 3 tokens
  - Prompt: `/prompts/report-trust-vulnerability-map.md`
- Communication Decoder
  - A guide to your communication patterns — how you express care, what patterns take over, and what helps you return to balance.
  - Traits: Love Language, Attachment
  - Cost: 2 tokens
  - Prompt: `/prompts/report-communication-decoder.md`

Notes:

- Each card has a display of required traits for it to be generated
- Each card has a display of cost

CTA's on cards:

- View insights (when done)
- Generate insights (when not done)
- Regenerate insights (when done, but traits changed)

## Relational Portrait

TODO: TO BE DESCRIBED LATER

## My Profile

A page with user settings.

Blocks top to bottom:

- User box (name, avatar, email verification badge, language selector, logout button)
- Subscribtion block - shows plan, manage subscribtion button linking to stripe, information, available tokens)
- Legal & support - terms and policy
- Danger zone - delete account
