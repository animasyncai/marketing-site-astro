# Structure
The goal of this document is to layout content architecture and content itself in order to help you understand how things are connected together

# Main navigation
Main navigation consistts of several menu elements (title / url / description for you) in the sidebar:
- Relection companion / chat / AI consultant
- Your traits / traits / main page for trait questionnaires/cards
- Inner Portrait / inner-portrait / Main page for all reports
- Relational Portrait / relational-portrait / Main page for vibe reports and partner symc
- My profile / profile / Displated at the bottom of the sidebar - goes to profile settings

# Reflection companion
It's a chat window so there's no title, it's purely chat. Input area at the bottom.

UX:
- When you open it first time there are prompt suggestions. We think we should add more suggestiuons based on traits you have and in the future, based on the goal that you have. 
- There's also signficant notes - extracted by AI from chat, a window that is only seen by admins, but for now it does not work well, so it's experimental.

# Your traits

TODO: No description yet, need to generate

[ LIST OF TRAIT CARDS IN A GRID ]

Cards structure:
- Title
- Report (300-400 words)
- Completed date
- Call to actions

Cards:
- The Way You Stay Present
- The Way You Hear Yourself
- The way You attach
- The way You love

CTAs on cards (TODO: IMPROVE):
- Start (when not done)
- Check in again (when done)

TODO: SHOW PRICE SOMEWHERE WHICH IS 1 TOKEN FOR EACH TRAIT
THOUGHTS:
- Show we maybe display the amount of questions or some sort of description for each if not complete? Currently not needed as we actually force to do them in onboading,but that will likely change.


# Inner Portrait

Your Inner Portrait is a growing collection of emotionally attuned reflections based on your unique traits.

It brings together different layers of who you are — how you connect, care, grow, and respond to the world around and within you.

[ LIST OF REPORTS CARDS IN A GRID ]

Cards:
- Inner portrait (basic)
  - A gentle summary of your traits — how you tend to connect, protect, and care in relationships. A soft introduction to your emotional patterns.
  - Cost: 1 token
- Inner Portrait
  - A rich, personalized reflection of your emotional world — how you connect with others, express care, stay grounded, and meet yourself. Includes metaphors.. (Too long, need to shorten)
  - Cost: 3 tokens
- Conflict compass
  - A personal guide to how you move through conflict — what unsettles you, what shields you, and what brings you back to connection.
  - Cost: 3 tokens
- Relationship Blueprint
  - A map of how you form, maintain, and experience emotional bonds — what draws you closer, what pushes you away, and what you need to feel safe in connection.
  -  Cost: 3 tokens
- Stress signals map
  - A guide to your emotional warning signs — how tension shows up in your body and mind, what patterns take over, and what helps you return to balance.
  -  Cost: 3 tokens

CTA's on cards:
- View insights (when done)
- Generate insights (when not done)

# Relational Portrait

TODO: TO BE DESCRIBED LATER

# My Profile

A page with user settings.

Blocks top to bottom:
- User box (name, avatar, email verification badge, language selector, logout button)
- Subscribtion block - shows plan, manage subscribtion button linking to stripe, information, available tokens)
- Legal & support - terms and policy
- Danger zone - delete account