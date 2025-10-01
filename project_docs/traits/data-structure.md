# The Trait Data Structure

This defines how we store trait data in the database and pass it into reports / consultant.

traits: {
attachment: {
completedAt: "2024-01-15",
userReport: "You approach relationships with...",
traitData: {
maxScore: 5,
primary: "AVOIDANT",
primaryScore: 4.2,
primaryIntensity: "STRONG",
secondary: "ANXIOUS",
secondaryScore: 3.1,
secondaryIntensity: "MODERATE",
allScores: { secure: 2.8, anxious: 3.1, avoidant: 4.2, disorganized: 2.9 },
behavioralProfile: "Strongly values independence and tends to withdraw..."
}
},

     loveLanguage: {
      completedAt: "2024-01-16",
      userReport: "When you feel safe and truly seen...",
      traitData: {
        maxScore: 5,
        primary: "WORDS_OF_AFFIRMATION",
        primaryScore: 3.5,
        primaryScores: {
          A: { score: 3.0, label: "Meaningful conversations" },
          B: { score: 4.0, label: "Words of affection/encouragement" }
        },

        secondary: "ACTS_OF_SERVICE",
        secondaryScore: 3.2,
        secondaryScores: {
          A: { score: 3.5, label: "Support when needed" },
          B: { score: 2.9, label: "Taking over responsibilities" }
        },

        distribution: "DUAL",

        allScores: {
          qualityTime: {
            overall: 2.1,
            scores: {
              A: { score: 2.8, label: "Shared activities/presence" },
              B: { score: 1.4, label: "Focused attention/listening" }
            }
          },
          wordsOfAffirmation: {
            overall: 3.5,
            scores: {
              A: { score: 3.0, label: "Meaningful conversations" },
              B: { score: 4.0, label: "Words of affection/encouragement" }
            }
          },
          actsOfService: {
            overall: 3.2,
            scores: {
              A: { score: 3.5, label: "Support when needed" },
              B: { score: 2.9, label: "Taking over responsibilities" }
            }
          },
          gifts: {
            overall: 1.5,
            scores: {
              A: { score: 1.6, label: "Valuable/precious gifts" },
              B: { score: 1.4, label: "Small surprises/tokens" }
            }
          },
          physicalTouch: {
            overall: 2.8,
            scores: null
          }
        },

        behavioralProfile: "Receives love primarily through words of affirmation, with a strong preference for verbal expressions of affection, encouragement, and appreciation rather than just in-depth conversations. Also values practical support when needed, especially when someone steps in to help during difficult moments rather than taking over ongoing responsibilities."
      }
    },

    mindfulness: {
      completedAt: "2024-01-17",
      userReport: "You seem to notice some of your internal experiences...",
      traitData: {
        mindfulnessLevel: "MODERATE_MINDFULNESS",
        awarenessLevel: "LOW_AWARENESS",
        mindfulnessScore: 8,
        awarenessScore: 6,
        maxMindfulnessScore: 15,
        maxAwarenessScore: 20,
        behavioralProfile: "Developing present-moment awareness but limited understanding of what internal experiences mean..."
      }
    },

    selfAcceptance: {
      completedAt: "2024-01-18",
      userReport: "You often move through life with curiosity...",
      traitData: {
        level: "DEVELOPING_SELF_ACCEPTANCE",
        score: 9,
        maxScore: 16,
        openness_to_change: "READY_TO_GROW",
        behavioralProfile: "Developing capacity for self-observation with moments of curiosity about inner experience..."
      }
    }
