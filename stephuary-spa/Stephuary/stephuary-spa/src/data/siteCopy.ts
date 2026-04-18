/** Shell copy — diagnostic output lives in `resultRules.ts`. */

export const entryCopy = {
  headline: "You saw how this works. Run it for yourself.",
  sub: "Answer the questions. See what to stop, what to focus on, and what this turns into.",
  cta: "Start",
} as const;

export const offerCopy = {
  headline: "If you want help doing this faster:",
  cta: "Choose your next step",
  tiers: [
    {
      id: "path",
      price: "$34",
      title: "Apply One Path",
      line: "Turn one of these into something you can sell.",
    },
    {
      id: "structure",
      price: "$197",
      title: "Structure Everything",
      line: "Organize this into one clear plan.",
    },
    {
      id: "breakdown",
      price: "$750",
      title: "Full Breakdown",
      line: "Deeper direction and prioritization.",
    },
  ] as const,
} as const;
