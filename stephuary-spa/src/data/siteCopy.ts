/** Shell copy — diagnostic output lives in `resultRules.ts`. */

export const homeCopy = {
  headline: "You're sitting on something people would pay for.",
  sub: "Find your niche, high-ticket work, and who needs it now.",
  cta: "Start",
} as const;

export const exploreCopy = {
  title: "Explore other ways to work together",
} as const;

export const resultsBridgeCopy = {
  line1: "You already have something here.",
  line2: "Now turn it into something that pays you.",
} as const;

export const offerCopy = {
  intro: {
    headline: "Start here.",
    sub: "Based on your results, the fastest way forward is to turn this into something you can sell.",
  },
  primary: {
    id: "path" as const,
    price: "$34",
    title: "Apply One Path",
    line:
      "Take one of these and turn it into something you can charge for this week.",
    subline: "Most people start here.",
    cta: "Start here",
  },
  secondary: [
    {
      id: "fix" as const,
      price: "$197",
      title: "Fix What's Not Working",
      opening:
        "Once you have direction, this fixes the part that isn't working.",
      bullets: [
        "One thing. Looked at properly.",
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
      line: "Go deeper and prioritize everything properly.",
      cta: "Continue with this",
    },
  ] as const,
  seeFullOptions: "See full options",
} as const;

export type OfferTierId =
  | typeof offerCopy.primary.id
  | (typeof offerCopy.secondary)[number]["id"];
