/** Shell copy — Alignment Diagnostic output lives in `resultRules.ts`. */

export const brandIdentityCopy = {
  name: "Stephuary",
  tagline: "Intentional life design through clarity and work that pays.",
} as const;

export const homeCopy = {
  headline: "You already have something people would pay for.",
  subtext: "You just haven't seen it clearly yet.",
  showsLead: "This shows you:",
  showsLines: ["what it is,", "who pays for it,", "and where it's breaking."],
  bodyTension: "Most people don't finish this.",
  cta: "Run the Alignment Diagnostic",
  videoTeaseCta: "Watch breakdown",
} as const;

export const resultsShareCopy = {
  prompt: "Know someone stuck in this exact spot?",
  cta: "Copy link",
  copied: "Link copied",
  sendNudge: "Send it before you overthink it",
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

/** Shown before the access form; filter, not pitch. */
export const applyQualifyModalCopy = {
  headline: "This is where we fix it properly.",
  filterLine: "Not everyone gets in.",
  prompt: "Answer yes to these:",
  unsureLine: "If you're unsure, this is not the right step.",
  bullets: [
    "You already have something real — it's just not converting",
    "You're ready to change how you're operating",
    "You want this solved, not discussed",
  ],
  bridge: "If that's you:",
  cta: "Apply now",
  belowButton: "I review every submission personally.",
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
  cta: "Apply now",
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

/** Interstitial after Q4: observation, not instruction. */
export const realizationMomentCopy = {
  lines: [
    "You're starting to see it now.",
    "It's not that nothing works.",
    "It's that everything is split.",
    "That's why nothing compounds.",
  ],
  cta: "Continue",
  shareNudgeLines: ["If someone else comes to mind,", "send this to them."],
} as const;

export const diagnosticCopy = {
  /** Shown under progress bar; empty hides the hint row in `ProgressBar`. */
  progressHint: "",
  progressPsychLine: "You're closer than it feels.",
  microCommitment: "You're already further than most people get.",
  midpointPressure: "Most people stop around here.",
  nearComplete: "Finish this. It only works if you see it fully.",
  timeExpectation: "About two minutes.",
} as const;

/** Static results readout — four sections, no scoring UI. */
export const resultsReadoutCopy = {
  ownershipLine: "This is based on what you actually chose.",
  recognitionLine: "You've seen someone else do this too.",
  socialProofLine: "Most people don't see this until it's pointed out.",
  sendEasierLine: "This is easier to send than explain.",
  pageTitle: "Your Alignment Diagnostic results",
  authority: {
    line1: "I've seen this play out the same way repeatedly.",
    line2: "Most people are one decision away from fixing this.",
  },
  sections: [
    {
      id: "happening",
      title: "What's actually happening",
      paragraphs: [
        "You're not stuck.",
        "You're split.",
        "You're running multiple directions at once, so nothing compounds.",
        "Some of what you're doing works.",
        "But it's buried under everything else.",
      ],
    },
    {
      id: "time",
      title: "Where you're losing time",
      paragraphs: [
        "Your time isn't the issue.",
        "It's where it's going.",
        "You're spending it on things that don't convert, or things that don't finish.",
        "You're switching too often.",
      ],
    },
    {
      id: "money",
      title: "Where money actually is",
      paragraphs: [
        "Money isn't in doing more.",
        "It's in narrowing.",
        "There's already a version of your work that people will pay for.",
        "You just haven't committed to it.",
      ],
    },
    {
      id: "now",
      title: "What to do now",
      paragraphs: [
        "You don't need to fix everything.",
        "You need to pick one direction and structure it so it sells.",
        "One offer.",
        "One outcome.",
        "One buyer.",
      ],
    },
  ],
} as const;

/** Neutral exclusion — below primary apply CTAs (access form). */
export const exclusionAuthorityCopy = {
  line1: "This won't help if you're still figuring out what you want to do.",
  line2: "It's for people who already have something real, and need to make it work.",
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

/** Calm pressure — before tier cards (not salesy). */
export const offerPressureBeforeCopy = {
  lines: [
    "You already know what's not working.",
    "The only question is whether you fix it.",
  ],
} as const;

/** Calm certainty — after tier cards. */
export const offerPressureAfterCopy = {
  lines: ["Nothing here is new.", "You've already seen it.", "This just makes it usable."],
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
  entry: "The obvious next step is to turn what you saw into one path.",
  focused: "One problem is loud enough to fix on its own.",
  full: "When everything connects, you need the full map — not another patch.",
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

/** Collapsed card — expands to show price + full copy. */
export const offerSeeDetailsCta = "Details" as const;

/** Primary action in scope row (matches tier CTA intent). */
export const offerScopePrimaryLabel = {
  path: "Start here",
  fix: "Fix this properly",
  breakdown: "See the full system",
} as const;

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
  cta: "Apply to work with me",
} as const;

export const offerScrollNudge = {
  line1: "You don't need more time.",
  line2: "You need a decision.",
} as const;

export const offerCopy = {
  intro: {
    headline: "Next step",
    bridge: "This continues what you just saw — pick how deep you want to go.",
  },
  whatYouGetHeading: "What you get",
  primary: {
    id: "path" as const,
    price: "$34",
    title: "Fix the direction",
    collapsedTagline: "One clear path forward",
    bodyLines: [
      "This takes what you just saw",
      "and turns it into one clear path.",
      "",
      "Not more options.",
      "Not more ideas.",
      "",
      "One direction that actually converts.",
    ],
    whatYouGet: ["What to focus on", "What to stop", "What actually leads to money"],
    subtextLines: [
      "This is for people who want to move this week.",
      "If you're still exploring, don't buy it.",
    ],
  },
  secondary: [
    {
      id: "fix" as const,
      price: "$197",
      title: "Fix one thing properly",
      collapsedTagline: "Solve one real problem",
      bodyLines: [
        "You don't need everything reviewed.",
        "",
        "You need the right thing fixed.",
        "",
        "This isolates one part of your work",
        "and shows exactly what's breaking it.",
      ],
      whatYouGet: ["What's actually wrong", "Why it's not working", "What to change immediately"],
      process: {
        intro: "You choose one area:",
        areas: ["offer", "positioning", "structure", "landing page"],
        closing: "Then it gets reviewed directly.",
      },
      subtextLines: ["Most people try to fix everything.", "That's why nothing improves."],
    },
    {
      id: "breakdown" as const,
      price: "$750",
      title: "Fix the full system",
      collapsedTagline: "Remove confusion entirely",
      bodyLines: [
        "This looks across everything you're running",
        "— not one piece in isolation.",
        "",
        "You get the full map:",
        "what conflicts, what to fix first, and what can wait.",
      ],
      whatYouGet: ["The whole picture", "Where things work against each other", "A clear order of operations"],
      subtextLines: ["Use this when one problem won't stay in a box."],
    },
  ] as const,
} as const;

export type OfferTierId =
  | typeof offerCopy.primary.id
  | (typeof offerCopy.secondary)[number]["id"];
