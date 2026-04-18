/** Shell copy — diagnostic output lives in `resultRules.ts`. */

export const homeCopy = {
  headline: "You already have something people would pay for.",
  sub: "This shows you what it is, who pays for it, and what's stopping it from working.",
  micro: "25-question diagnostic. Clear direction in minutes.",
  qualifier: "For people with experience, skills, or ideas that aren't translating into money yet.",
  cta: "Start diagnostic",
} as const;

export const exploreCopy = {
  title: "Explore other ways to work together",
} as const;

export const diagnosticCopy = {
  progressHint: "Clarity builds as you go.",
  nearComplete: "You're close. Most people don't get this far.",
} as const;

export const resultsTransitionCopy =
  "This is where most people realize what's actually been happening." as const;

export const resultsBridgeCopy = {
  line1: "You already have something here.",
  line2: "Now turn it into something that pays you.",
} as const;

export const resultsStakesCopy =
  "If nothing changes, this is exactly how next month looks too." as const;

export const offerFrictionCopy =
  "Doing nothing keeps everything the same." as const;

export const offerCopy = {
  intro: {
    headline: "Start here.",
    bridge: "You don't need more ideas. You need to apply one path.",
    sub: "Based on your results, the fastest way forward is to turn this into something you can sell.",
  },
  primary: {
    id: "path" as const,
    price: "$34",
    title: "Turn This Into Something You Can Charge For This Week",
    line:
      "This takes what you just saw and turns it into something you can sell immediately.",
    urgency: "Most people wait. That's why nothing changes.",
    bullets: [
      "You pick one path from your results",
      "It gets turned into a clear offer",
      "You leave with something you can actually charge for",
    ],
    cta: "Turn this into an offer",
  },
  secondary: [
    {
      id: "fix" as const,
      price: "$197",
      title: "Fix What's Not Working",
      trustLine: "One thing. Looked at properly.",
      opening:
        "Once you have direction, this fixes the part that isn't working.",
      bullets: [
        "Not broad. Not general.",
        "This is built to be used, not read.",
        "Most people try to fix everything at once. That is why nothing improves.",
      ],
      cta: "Continue with this",
    },
    {
      id: "breakdown" as const,
      price: "$750",
      title: "Full Breakdown",
      trustLine: "For when one issue isn't the problem.",
      line: "Go deeper and prioritize everything properly.",
      cta: "Continue with this",
    },
  ] as const,
  seeFullOptions: "See full options",
} as const;

export type OfferTierId =
  | typeof offerCopy.primary.id
  | (typeof offerCopy.secondary)[number]["id"];
