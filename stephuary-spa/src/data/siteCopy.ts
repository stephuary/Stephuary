/** Shell copy — diagnostic output lives in `resultRules.ts`. */

export const homeCopy = {
  headline: "You already have something people would pay for.",
  bodyHook: "You just haven't seen it clearly yet.",
  bodyShows: "This shows you what it is, who pays for it, and where it's breaking.",
  bodyTension: "Most people don't finish this.",
  cta: "Start diagnostic",
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
  title: "Apply to work with me",
  lead: "If this matches what you're dealing with, don't overthink it.",
  answerYesPrompt: "Answer yes to these 3:",
  bullets: [
    "You see exactly what's not working",
    "You're ready to act on it now",
    "You want this fixed properly, not adjusted again",
  ],
  microLine1: "I review every application personally.",
  microLine2: "If it's a fit, you'll hear from me.",
  thanksLine1: "Application received.",
  thanksLine2: "I review every submission personally. If it's a fit, you'll hear from me.",
  labels: {
    name: "Name",
    email: "Email",
    q1: "What are you trying to turn into revenue right now?",
    q2: "What's been getting in the way?",
    q3: "If this worked, what would change immediately?",
    invest: "Are you ready to invest in fixing this now?",
  },
  investYes: "Yes",
  investNo: "No",
  cta: "Submit application",
} as const;

/** Post-submit confirmation (access application). */
export const applicationConfirmationCopy = {
  headline: "You're in.",
  subtext: "I've received your application.",
  reframeLine1: "Most people don't make it this far.",
  reframeLine2: "They stay in the loop instead of deciding.",
  expectationLine1: "I review every application personally.",
  expectationLine2: "If it's a fit, you'll hear from me with next steps.",
  preframeLine1: "If this moves forward, it won't be casual.",
  preframeLine2: "We'll focus on what actually changes your situation.",
  optionalLead: "If you want to understand how this works before I respond:",
  watchBreakdownCta: "Watch breakdown",
  finalLine1: "You already know what's not working.",
  finalLine2: "Now we decide what to do about it.",
} as const;

/** Internal — embedded for operator reference; not shown in the UI. */
export const accessRequestInternalFlow = [
  "Collect: name, email",
  "Q1: revenue focus",
  "Q2: blockers",
  "Q3: immediate change if it worked",
  "Optional: ready to invest (yes/no)",
  "Review → reply if fit",
] as const;

export const exploreCopy = {
  title: "Other ways to work together",
} as const;

/** Interstitial after Q5: observation, not instruction. */
export const realizationMomentCopy = {
  lines: [
    "You're starting to see it now.",
    "It's not that nothing works.",
    "It's that everything is split.",
    "That's why nothing compounds.",
  ],
  cta: "Continue",
} as const;

export const diagnosticCopy = {
  progressHint: "Clarity builds as you go.",
  nearComplete: "You're close. Most people don't get this far.",
  timeExpectation: "This takes about 3 minutes.",
  midpointMomentum: "Most people drop here. Keep going.",
  authorityFilter:
    "This is where most people realize they've been solving the wrong problem.",
} as const;

export const resultsAuthorityLead = {
  line1: "Most people don't see this clearly.",
  line2: "That's why nothing changes.",
} as const;

/** Final results: tension, fork, identity filter (before email + primary CTA). */
export const resultsDecisionMomentCopy = {
  openLines: ["If nothing changes,", "this is exactly how next month looks too."],
  sameLines: ["Same effort.", "Same confusion.", "Same result."],
  pivotLabel: "Or—",
  pivotAction: "you can fix it now.",
  ctaFilterLines: [
    "This is for people who want to move this week.",
    "If that's not you,",
    "don't buy it.",
  ],
} as const;

export const resultsScaleCopy = "This scales beyond one person." as const;

export const offerBeforeOptionsCopy = {
  line1: "You already know what's wrong now.",
  line2: "The only question is whether you fix it.",
} as const;

export const operatorOSGateCopy = {
  header: "This can be run as a system.",
  sub: "Not just for you. Across your work.",
  cta: "Apply",
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
  "For deeper builds or full system installs, apply to work together." as const;

export const highTicketGateCopy = {
  header: "This isn't a simple fix.",
  sub: "You're dealing with something more complex than one path.",
  customLabel: "Custom build",
  oscLabel: "Only Sometimes Club",
  cta: "Apply",
} as const;

export const offerPostPricingAccess = {
  line: "If this doesn't fit what you need, apply to work together.",
  cta: "Apply",
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
