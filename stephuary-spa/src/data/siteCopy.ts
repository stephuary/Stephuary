/** Shell copy — Alignment Diagnostic output lives in `resultRules.ts`. */

export const brandIdentityCopy = {
  name: "Stephuary",
  diagnosticName: "The Alignment Diagnostic",
  tagline: "Entry point. Revenue system runs after install.",
} as const;

export const homeCopy = {
  headline: "You already have something people would pay for.",
  supportLines: ["Revenue path isn't mapped yet.", "Wrong direction masquerades as stuck."],
  ctaFrameLines: ["Classifies position.", "Incomplete runs are common."],
  sharedEntryLine: "Shared link. Same diagnostic.",
  cta: "Run the Alignment Diagnostic",
} as const;

export const resultsShareCopy = {
  prompt: "Send this classification.",
  cta: "Copy link",
  copied: "Copied.",
} as const;

export const resultsEmailCopy = {
  prompt: "Email this readout?",
  followUp: "Same link. Your inbox.",
  send: "Send",
} as const;

export const postActionMomentCopy = {
  line1: "Same inputs — same output.",
  line2: "Pick an install.",
} as const;

export const installQualifyModalCopy = {
  headline: "Install the system",
  bodyLead: "You've already seen what's breaking.",
  bodyPick: "Pick how you want it fixed.",
  routes: [
    "Fix one constraint → Single-thread install",
    "Fix the system → Full-stack install",
    "Build it with me → Custom system",
  ],
  closing: "Same inputs produce the same output.",
  cta: "Choose the install",
} as const;

export const accessRequestCopy = {
  title: "Install intake",
  lead: "Three answers.",
  answerYesPrompt: "One route out.",
  bullets: ["Revenue asset exists", "You ship what gets installed", "Single-thread execution"],
  microLine1: "Intake is read in order.",
  microLine2: "Fit: next steps. No fit: one line.",
  thanksLine1: "Intake logged.",
  thanksLine2: "Fit gets a reply with next steps.",
  labels: {
    name: "Name",
    email: "Email",
    q1: "What are you turning into revenue right now?",
    q2: "What's blocking install?",
    q3: "If this worked, what changes first?",
    invest: "Ready to fund the install now?",
  },
  investYes: "Yes",
  investNo: "No",
  cta: "→ Submit intake",
} as const;

export const applicationConfirmationCopy = {
  headline: "Intake logged.",
  subtext: "Queued.",
  reframeLine1: "",
  reframeLine2: "",
  expectationLine1: "Read in order.",
  expectationLine2: "Fit: reply with slot.",
  preframeLine1: "",
  preframeLine2: "",
  optionalLead: "Context:",
  watchBreakdownCta: "System context",
  finalLine1: "Inputs unchanged — pattern holds.",
  finalLine2: "Install is the variable.",
} as const;

export const accessRequestInternalFlow = [
  "Collect: name, email",
  "Q1: revenue focus",
  "Q2: blockers",
  "Q3: first change if installed",
  "Optional: fund ready (y/n)",
  "Route by fit",
] as const;

export const exploreCopy = {
  title: "Other entry points",
} as const;

export const realizationMomentCopy = {
  lines: ["You're not stuck.", "You're split.", "That's why nothing compounds."],
  cta: "Continue",
} as const;

export const diagnosticCopy = {
  progressHint: "",
  progressPsychLine: "",
  timeExpectation: "",
} as const;

export const resultsReadoutCopy = {
  openLine1: "Pattern locked.",
  openLine2: "Not confusion.",
  classificationHeading: "Classification:",
  consequenceIntro: "No change costs:",
  consequenceBullets: [
    "Revenue on work that never ships",
    "Time on non-paying motion",
    "Growth delay from split focus",
  ],
  consequenceClose: "Compounds weekly.",
  pageTitle: "The Alignment Diagnostic",
} as const;

export const exclusionAuthorityCopy = {
  line1: "Diagnostic classifies.",
  line2: "Intake schedules install.",
} as const;

export const resultsDecisionMomentCopy = {
  adjustmentLines: ["Slow fixes leak.", "Install holds."],
  pivotLabel: "Next:",
  pivotAction: "Pick the install.",
  ctaFilterLines: [] as const,
} as const;

/** After diagnostic — before install cards. */
export const offerTransitionCopy = {
  headline: "Pick the install.",
  subtext: "You've seen what's breaking. Choose how you want it fixed.",
} as const;

export const offerInstallTiers = [
  {
    id: "path" as const,
    title: "Single-thread install",
    price: "$34",
    bodyLines: [
      "Fix one constraint.",
      "",
      "We isolate the break,",
      "remove interference,",
      "and install one clean revenue path.",
      "",
      "No overlap.",
      "No competing priorities.",
    ],
    cta: "→ Install single thread",
  },
  {
    id: "fix" as const,
    title: "Full-stack install",
    price: "$750",
    bodyLines: [
      "Fix the system.",
      "",
      "We restructure everything that touches revenue:",
      "offer, positioning, flow, and execution.",
      "",
      "What conflicts gets removed.",
      "What works gets reinforced.",
      "Everything aligns to one output.",
    ],
    cta: "→ Install full system",
  },
  {
    id: "breakdown" as const,
    title: "Custom system build",
    price: "Custom scope",
    bodyLines: [
      "You don't need pieces fixed.",
      "",
      "You need the system rebuilt.",
      "",
      "This takes what you have,",
      "removes what doesn't convert,",
      "and installs one clear revenue path.",
      "",
      "Built with you.",
      "Implemented with you.",
      "No guesswork.",
    ],
    cta: "→ Build my system",
  },
] as const;

export type OfferTierId = (typeof offerInstallTiers)[number]["id"];
