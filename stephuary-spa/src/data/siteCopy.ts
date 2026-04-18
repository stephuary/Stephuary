/** Shell copy — detailed diagnostic lines live in `resultRules.ts`. */

export const brandIdentityCopy = {
  name: "Stephuary",
  diagnosticName: "Revenue Diagnostic",
  tagline: "Finish the questions. Get the problem named. Then pick a paid fix.",
} as const;

export const homeCopy = {
  headline: "See where your revenue is leaking.",
  /** One line: what the diagnostic shows (plain). */
  subtext: "18 questions. You get named problems, what they cost, and what to buy next.",
  cta: "Run Diagnostic",
  secondaryCta: "Watch Breakdown",
  sharedEntryLine: "Someone sent you this link.",
} as const;

export const resultsShareCopy = {
  prompt: "Send this page to someone with the same bottleneck.",
  cta: "Copy link",
  copied: "Copied.",
} as const;

export const resultsEmailCopy = {
  prompt: "Email this summary?",
  followUp: "Same link in your inbox.",
  send: "Send",
} as const;

export const postActionMomentCopy = {
  line1: "Same week, same habits, same numbers.",
  line2: "Pick a fix.",
} as const;

export const revenueGateModalCopy = {
  headline: "Before the form",
  bodyLead: "You finished the diagnostic.",
  bodyPick: "Pick a tier:",
  routes: [
    "$34 — one offer, one buyer, locked in writing",
    "$750 — full pass on offer, price, page, and calendar",
    "Custom — I build it with you, week by week",
  ],
  closing: "No tier = no change in how you work.",
  cta: "Continue",
} as const;

export const accessRequestCopy = {
  title: "Tell me what we're fixing",
  lead: "Three answers.",
  answerYesPrompt: "I'll reply if it's a fit.",
  bullets: ["You sell something real today", "You'll follow what we agree", "You're ready to pay for the work"],
  microLine1: "I read these in order.",
  microLine2: "Fit: I email next steps. No fit: one sentence why.",
  thanksLine1: "Got it.",
  thanksLine2: "If it's a fit, you'll hear from me.",
  labels: {
    name: "Name",
    email: "Email",
    q1: "What are you trying to get paid for right now?",
    q2: "What's in the way?",
    q3: "If we fixed it, what would change first?",
    invest: "Ready to pay for the fix this month?",
  },
  investYes: "Yes",
  investNo: "No",
  cta: "Submit",
} as const;

export const applicationConfirmationCopy = {
  headline: "Received.",
  subtext: "In the queue.",
  reframeLine1: "",
  reframeLine2: "",
  expectationLine1: "I read in order.",
  expectationLine2: "Fit gets a real reply.",
  preframeLine1: "",
  preframeLine2: "",
  optionalLead: "Context:",
  watchBreakdownCta: "Watch Breakdown",
  finalLine1: "Your answers don't change until your inputs change.",
  finalLine2: "What you buy is what changes.",
} as const;

export const accessRequestInternalFlow = [
  "Name, email",
  "Revenue focus",
  "Blocker",
  "First change if fixed",
  "Pay this month? y/n",
  "Reply by fit",
] as const;

export const exploreCopy = {
  title: "More ways in",
} as const;

export const realizationMomentCopy = {
  lines: ["Two priorities compete.", "The calendar picks neither.", "Continue."],
  cta: "Continue",
} as const;

export const diagnosticCopy = {
  progressHint: "",
  progressPsychLine: "",
  timeExpectation: "",
} as const;

export const resultsReadoutCopy = {
  openLine1: "",
  whatHeading: "What's happening",
  whyHeading: "Why",
  whyBody:
    "Your answers point to where hours and money go—usually too many priorities, delivery clogged, or the pitch doesn't match who pays.",
  costHeading: "What it costs if you don't fix it",
  consequenceBullets: [
    "Money left on work that never gets finished",
    "Hours on tasks that don't pay",
    "Growth stalls because the week won't commit",
  ],
  consequenceClose: "That loss repeats every week you wait.",
  pageTitle: "Revenue Diagnostic",
} as const;

export const exclusionAuthorityCopy = {
  line1: "No offer yet — run the diagnostic first.",
  line2: "Selling something real — use the form.",
} as const;

export const resultsDecisionMomentCopy = {
  adjustmentLines: [] as const,
  pivotLabel: "",
  pivotAction: "Pick a paid fix below.",
  ctaFilterLines: [] as const,
} as const;

export const offerTransitionCopy = {
  headline: "Pick what you want done.",
  subtext: "Three options. Same readout. Different depth.",
} as const;

export const offerSectionLabels = {
  whatYouGet: "What you get",
  whatChanges: "What changes",
  time: "When you get value",
} as const;

export const offerInstallTiers = [
  {
    id: "path" as const,
    headline: "One offer, one buyer. Stop running parallel builds.",
    whatYouGet: [
      "Written lane: one buyer, one promise, one price",
      "Cut list: what you pause or drop this month",
      "7-day sequence for what you sell first",
      "Recording or doc so the lane doesn't drift",
    ],
    whatChanges: "You sell one lane this month instead of three half-built ones.",
    time: "First pass within 5 business days of payment.",
    price: "$34",
    cta: "Get this — $34",
  },
  {
    id: "fix" as const,
    headline: "Full pass on how you describe, price, and deliver what you sell.",
    whatYouGet: [
      "Map of each offer and what it earns",
      "Pricing and scope fixes for the broken line",
      "One page or core doc rewritten for the buyer you want",
      "Calendar rules so admin stops eating the week",
      "Checklist: what's live, what's killed",
    ],
    whatChanges: "Strangers understand what you sell. Bad-fit calls drop.",
    time: "First deliverables within 10 business days of payment.",
    price: "$750",
    cta: "Get the full pass — $750",
  },
  {
    id: "breakdown" as const,
    headline: "Done-for-you: I rebuild your revenue path with you.",
    whatYouGet: [
      "Full written audit: buyers, offers, price, calendar, handoffs",
      "Ordered plan: what changes first, with rough numbers",
      "Hands-on rewrites: pages, decks, outbound where needed",
      "Weekly calls until the path is live",
      "30 days of email after handoff for tweaks",
    ],
    whatChanges: "One buyer, one main offer, one week that protects delivery.",
    time: "Scope on a call. Work starts within 2 weeks of deposit.",
    price: "Custom",
    cta: "Book a custom build",
  },
] as const;

export type OfferTierId = (typeof offerInstallTiers)[number]["id"];

export const diagnosticExitCopy = {
  title: "Leave the Revenue Diagnostic?",
  body: "You'll lose this run. Start over if you come back.",
  stay: "Continue",
  leave: "Leave",
} as const;
