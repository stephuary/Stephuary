/** Shell copy — Alignment Diagnostic output lives in `resultRules.ts`. */

export const brandIdentityCopy = {
  name: "Stephuary",
  /** Shown once in footer — system naming. */
  diagnosticName: "The Alignment Diagnostic",
  tagline: "This is part of a larger system. This is the entry point.",
} as const;

export const homeCopy = {
  headline: "You already have something people would pay for.",
  supportLines: [
    "You just haven't seen it clearly yet.",
    "Most people aren't stuck.",
    "They're building in the wrong direction.",
  ],
  /** Under primary CTA — classification framing. */
  ctaFrameLines: [
    "This doesn't collect answers.",
    "It classifies where you are.",
    "Most people won't finish it.",
  ],
  sharedEntryLine: "Someone sent you this for a reason.",
  cta: "Run the Alignment Diagnostic",
} as const;

export const resultsShareCopy = {
  prompt: "Know someone stuck in this exact pattern?",
  cta: "Copy link",
  /** Single confirmation line after copy. */
  copied: "Sent before you overthink it.",
} as const;

export const resultsEmailCopy = {
  prompt: "Send this to your email?",
  followUp: "You'll get this again so you can actually use it.",
  send: "Send",
} as const;

export const postActionMomentCopy = {
  line1: "Same inputs — same output.",
  line2: "Decide.",
} as const;

/** Shown before the access form; filter, not pitch. */
export const applyQualifyModalCopy = {
  headline: "Apply to work with me",
  filterLine: "This is not for everyone.",
  prompt: "Answer yes to these:",
  unsureLine: "If you're unsure, this is not the right step.",
  bullets: [
    "You already have something real — it's not converting",
    "You'll change how you operate",
    "You want this fixed, not discussed",
  ],
  bridge: "If that's you:",
  cta: "Apply to install",
  belowButton: "It's for people ready to fix what's actually broken.",
} as const;

export const accessRequestCopy = {
  title: "Apply to work with me",
  lead: "Answer 3 questions.",
  answerYesPrompt: "If it fits, we move.",
  bullets: [
    "You see what's broken",
    "You'll act on it now",
    "You want it fixed — not adjusted again",
  ],
  microLine1: "I read every application myself.",
  microLine2: "If it's a fit, you'll hear from me.",
  thanksLine1: "Application received.",
  thanksLine2: "I read every submission. If it's a fit, you'll hear from me.",
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
  cta: "Apply to install",
} as const;

/** Post-submit confirmation (access application). */
export const applicationConfirmationCopy = {
  headline: "You're in.",
  subtext: "I've received your application.",
  reframeLine1: "Most people don't make it this far.",
  reframeLine2: "They stay in the loop instead of deciding.",
  expectationLine1: "I read every application myself.",
  expectationLine2: "If it's a fit, you'll hear from me with next steps.",
  preframeLine1: "If this moves forward, it won't be casual.",
  preframeLine2: "We'll focus on what actually changes your situation.",
  optionalLead: "If you want to understand how this works before I respond:",
  watchBreakdownCta: "System context",
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
  "Reply if fit",
] as const;

export const exploreCopy = {
  title: "Other ways to work together",
} as const;

/** Interstitial after Q4 — tension only. */
export const realizationMomentCopy = {
  lines: ["You're not stuck.", "You're split.", "That's why nothing compounds."],
  cta: "Continue",
} as const;

export const diagnosticCopy = {
  progressHint: "",
  progressPsychLine: "",
  timeExpectation: "",
} as const;

/** Results — classification + cost + share hook (no long readout). */
export const resultsReadoutCopy = {
  openLine1: "You're not confused.",
  openLine2: "You're in a known pattern.",
  classificationHeading: "You are in:",
  consequenceIntro: "If nothing changes, this costs you:",
  consequenceBullets: [
    "Revenue from work that never ships",
    "Time spent on non-paying activity",
    "Delayed growth from split focus",
  ],
  consequenceClose: "This compounds weekly.",
  pageTitle: "The Alignment Diagnostic",
  recognitionLine: "You've seen someone else do this.",
  socialProofLine: "Most people don't see this until it's named.",
} as const;

/** Slightly sharper observational lines when lander arrived via shared link. */
export const resultsReadoutCopyShared = {
  socialProofLine: "Most people don't see the pattern until someone names it.",
} as const;

/** Neutral exclusion — below primary apply CTAs (access form). */
export const exclusionAuthorityCopy = {
  line1: "Not if you're still choosing what to do.",
  line2: "Only if you already have something real and need it to work.",
} as const;

/** After consequence — before primary CTA to offer. */
export const resultsDecisionMomentCopy = {
  adjustmentLines: ["You can keep adjusting this slowly.", "Or fix it properly."],
  pivotLabel: "Next:",
  pivotAction: "Install the system.",
  ctaFilterLines: ["This is not for everyone.", "If you're not ready to fix what's broken, don't continue."],
} as const;

export const resultsScaleCopy = "Built to run beyond one person." as const;

export const offerBeforeOptionsCopy = {
  line1: "You already know what's wrong.",
  line2: "The only question is whether you install the fix.",
} as const;

export const offerGovernanceCopy = {
  line: "This doesn't just fix the problem. It prevents it from coming back.",
} as const;

export const offerPricingFrameCopy = {
  lead: "This is not time-based.",
  bullets: ["revenue", "output", "decision speed"],
} as const;

export const offerFilterNearCtaCopy = {
  line1: "This is not for everyone.",
  line2: "It's for people ready to fix what's actually broken.",
} as const;

/** Before tier cards. */
export const offerPressureBeforeCopy = {
  lines: ["System installation.", "We don't tune what you have. We restructure it to produce revenue."],
} as const;

/** After tier cards. */
export const offerPressureAfterCopy = {
  lines: ["Pick a depth. Then we install."],
} as const;

export const operatorOSGateCopy = {
  header: "This can be run as a system.",
  sub: "Not just for you. Across your work.",
  cta: "Apply to install",
} as const;

export const offerFrictionCopy = "No install — no change." as const;

export const offerTierLead = {
  entry: "One lane. One revenue path.",
  focused: "One failure type gets installed out.",
  full: "Full stack — no loose ends.",
} as const;

export const offerValueAnchor = {
  line1: "This is not time-based.",
  line2: "It's built to increase revenue, output, and decision speed.",
} as const;

export const offerMomentumCopy = {
  line1: "Classification is done.",
  line2: "Install or stay split.",
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

export const offerScopePrimaryLabel = {
  path: "Apply to install",
  fix: "Apply to install",
  breakdown: "Apply to install",
} as const;

export const offerScopeInlineCopy = {
  header: "Stay narrow or go full stack?",
  keepFocused: "Stay narrow",
  lookAcross: "Full stack",
  fixOne: "Single-thread install",
} as const;

export const offerPostPathUpsell = {
  line1: "Most people come back for the deeper install.",
  line2: "You can skip that and go deeper now.",
  ctaUpgrade: "Upgrade install depth",
  ctaContinue: "Continue with this",
} as const;

export const offerPostFixUpsell = {
  line1: "You'll likely need more than one install thread.",
  ctaUpgrade: "Full-stack install",
  ctaContinue: "Continue with this",
} as const;

export const offerHighTicketShadow =
  "For deeper builds or full system installs, apply to work together." as const;

export const highTicketGateCopy = {
  header: "This isn't a simple fix.",
  sub: "You're dealing with something more complex than one path.",
  customLabel: "Custom build",
  oscLabel: "Only Sometimes Club",
  cta: "Apply to install",
} as const;

export const offerPostPricingAccess = {
  line: "If none of this fits, apply direct.",
  cta: "Apply to work with me",
} as const;

export const offerScrollNudge = {
  line1: "Adjust slowly — or install.",
  line2: "No third path.",
} as const;

export const offerCopy = {
  intro: {
    headline: "System installation",
    bridge: "We don't tune your work. We restructure it so it produces revenue.",
  },
  whatYouGetHeading: "What gets installed",
  primary: {
    id: "path" as const,
    price: "$34",
    title: "Single-lane install",
    collapsedTagline: "One path, one buyer",
    bodyLines: [
      "Takes your classification",
      "and forces one revenue lane.",
      "",
      "No parallel builds.",
      "No competing offers.",
    ],
    whatYouGet: ["Lane lock", "Cut list", "Revenue sequence"],
    subtextLines: ["Move this week or don't buy.", "Still exploring — don't buy."],
  },
  secondary: [
    {
      id: "fix" as const,
      price: "$197",
      title: "Thread install",
      collapsedTagline: "One failure type, removed",
      bodyLines: [
        "Pick one thread.",
        "We install the fix end-to-end.",
        "",
        "Not the whole business.",
        "One break — sealed.",
      ],
      whatYouGet: ["Failure thread", "Install spec", "Ship checklist"],
      process: {
        intro: "Pick one surface:",
        areas: ["offer", "positioning", "structure", "landing page"],
        closing: "Then we install on that surface only.",
      },
      subtextLines: ["Trying to fix everything is why nothing moves.", "One thread only."],
    },
    {
      id: "breakdown" as const,
      price: "$750",
      title: "Full-stack install",
      collapsedTagline: "Everything tied to revenue",
      bodyLines: [
        "Crosses every lane you're running.",
        "",
        "Install order:",
        "what conflicts, what ships first, what waits.",
      ],
      whatYouGet: ["Stack map", "Conflict kills", "Install order"],
      subtextLines: ["When one thread won't stay in a box."],
    },
  ] as const,
} as const;

export type OfferTierId =
  | typeof offerCopy.primary.id
  | (typeof offerCopy.secondary)[number]["id"];
