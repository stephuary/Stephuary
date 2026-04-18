/** Shell copy — diagnostic output lives in `resultRules.ts`. */

export const homeCopy = {
  headline: "You already have something people would pay for.",
  sub: "You'll see what you can sell, who already pays for it, and what's blocking it.",
  micro: "25-question diagnostic. Clear direction in minutes.",
  qualifier: "For people with experience, skills, or ideas that aren't translating into money yet.",
  cta: "Start diagnostic",
  videoTeaseLead: "If you want to understand how this works first:",
  videoTeaseCta: "Watch breakdown",
} as const;

export const resultsShareCopy = {
  prompt: "Know someone dealing with this?",
  cta: "Copy link",
  copied: "Copied",
} as const;

export const resultsEmailCopy = {
  prompt: "Send this to your email?",
  followUp: "You'll get this again so you can actually use it.",
  send: "Send",
} as const;

export const postActionMomentCopy = {
  line1: "You don't need more time.",
  line2: "You need a decision.",
} as const;

export const accessRequestCopy = {
  fixingLabel: "What specifically are you trying to fix right now?",
  thanksLine1: "Your request was received.",
  thanksLine2: "You'll hear back with next steps based on what you submitted.",
} as const;

/** Internal — embedded for operator reference; not shown in the UI. */
export const accessRequestInternalFlow = [
  "What are you trying to fix?",
  "What have you tried?",
  "What's not working?",
  "Confirm real issue",
  "Then offer",
] as const;

export const exploreCopy = {
  title: "Other ways to work together",
} as const;

export const diagnosticCopy = {
  progressHint: "Clarity builds as you go.",
  nearComplete: "You're close. Most people don't get this far.",
  timeExpectation: "This takes about 3 minutes.",
  midpointMomentum: "Most people drop here. Keep going.",
} as const;

export const resultsTransitionCopy =
  "This is where most people realize what's actually been happening." as const;

export const resultsBridgeCopy = {
  line1: "You already have something here.",
  line2: "Now turn it into something that pays you.",
} as const;

export const resultsStakesCopy =
  "If nothing changes, this is exactly how next month looks too." as const;

export const resultsAuthorityCopy =
  "Some situations don't get solved in a single pass." as const;

export const resultsScaleCopy = "This scales beyond one person." as const;

export const resultsReadoutCloseCopy = {
  line1: "Most people never see this clearly.",
  line2: "That's why they stay stuck repeating it.",
} as const;

export const offerBeforeOptionsCopy = {
  line1: "Now you have two options:",
  line2: "apply it, or keep guessing.",
} as const;

export const operatorOSGateCopy = {
  header: "This can be run as a system.",
  sub: "Not just for you. Across your work.",
  cta: "Request access",
} as const;

export const offerFrictionCopy =
  "Doing nothing keeps everything the same." as const;

/** Lead line under intro bridge — keyed by `RecommendedTier` from `resolveRecommendedTier`. */
export const offerTierLead = {
  entry: "The fastest way forward is to turn this into something you can charge for.",
  focused: "One thing is clearly off. Fix that first.",
  full: "There's more than one issue here. This shows you everything at once.",
} as const;

/** True value anchor — time + complexity, not money. */
export const offerValueAnchor = {
  line1: "This is the same work usually done across multiple sessions.",
  line2: "Here, it's compressed into one decision.",
} as const;

export const offerMomentumCopy = {
  line1: "You already did the hard part.",
  line2: "Now you either apply it or stay where you are.",
} as const;

/** Time-cost anchor — no price mention. */
export const offerInvisibleAnchor =
  "Most people spend months trying to figure this out." as const;

/** Decision shortcuts under each tier (not feature lists). */
export const offerDecisionShortcut = {
  entry: "Fastest way to move",
  focused: "Fix it once, properly",
  full: "Stop guessing entirely",
} as const;

export const offerSeeDetailsCta = "See details" as const;

export const offerScopeInlineCopy = {
  header: "Do you want to keep this focused or go deeper?",
  keepFocused: "Keep this focused",
  lookAcross: "Look across everything",
  fixOne: "Fix one thing properly",
} as const;

export const offerPostPathUpsell = {
  line1: "Most people come back to fix what this reveals.",
  line2: "You can skip that step and fix it properly now.",
  ctaUpgrade: "Upgrade to focused review",
  ctaContinue: "Continue with this",
} as const;

export const offerPostFixUpsell = {
  line1: "You'll likely uncover more than one issue.",
  ctaUpgrade: "See everything at once",
  ctaContinue: "Continue with this",
} as const;

export const offerHighTicketShadow =
  "For deeper builds or full system installs, request access." as const;

export const highTicketGateCopy = {
  header: "This isn't a simple fix.",
  sub: "You're dealing with something more complex than one path.",
  customLabel: "Custom build",
  oscLabel: "Only Sometimes Club",
  cta: "Request access",
} as const;

export const offerPostPricingAccess = {
  line: "If this doesn't fit what you need, request access.",
  cta: "Request access",
} as const;

export const offerScrollNudge = {
  line1: "You don't need more time.",
  line2: "You need a decision.",
} as const;

export const offerCopy = {
  anchor: {
    line1: "Most people try to fix everything at once.",
    line2: "That's why nothing changes.",
    line3: "This is layered so you only pay for what you actually need.",
  },
  intro: {
    headline: "Start here.",
    bridge: "You don't need more ideas. You need to apply one path.",
  },
  primary: {
    id: "path" as const,
    price: "$34",
    label: "START HERE",
    subline: "This is the fastest way to move right now.",
    collapsedOutcome: "A clear offer you can sell this week.",
    collapsedTeaser: "Turns your readout into one thing you can charge for.",
    title: "Turn This Into Something You Can Charge For This Week",
    line:
      "This takes what you just saw and turns it into something you can sell immediately.",
    urgency: "Most people wait. That's why nothing changes.",
    bullets: [
      "You pick one path from your results",
      "It gets turned into a clear offer",
      "You leave with something you can actually charge for",
    ],
    decisionGuide: "Use this if you want to move immediately.",
    socialCue: "Most people start here.",
    cta: "Start here",
  },
  secondary: [
    {
      id: "fix" as const,
      price: "$197",
      label: "WHEN SOMETHING STILL ISN'T WORKING",
      title: "Fix What's Not Working",
      collapsedOutcome: "One problem fixed properly — not a full review.",
      collapsedTeaser: "Isolates the right issue so you stop patching symptoms.",
      trustLine: "One thing. Looked at properly.",
      opening: "This isolates one problem and fixes it properly.",
      lines: [
        "You don't need everything reviewed.",
        "You need the right thing fixed.",
      ],
      bullets: ["Built to be used, not read."],
      decisionGuide: "Use this if one thing is clearly off.",
      cta: "Fix this",
    },
    {
      id: "breakdown" as const,
      price: "$750",
      label: "WHEN IT'S NOT ONE ISSUE",
      title: "Full Breakdown",
      collapsedOutcome: "See the whole system at once.",
      collapsedTeaser: "Maps every layer so you stop guessing what to fix next.",
      line: "This looks across everything and shows you what's actually happening.",
      timeSave: "If you're dealing with multiple problems, this is faster than guessing.",
      decisionGuide: "Use this if everything feels unclear.",
      cta: "See everything clearly",
    },
  ] as const,
  seeFullOptions: "Or go deeper if needed.",
} as const;

export type OfferTierId =
  | typeof offerCopy.primary.id
  | (typeof offerCopy.secondary)[number]["id"];
