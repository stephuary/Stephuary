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
    "$34 — Fix One Area: offer, positioning, structure, or page",
    "$750 — Full Breakdown: where money leaks, what to stop, what to focus on",
    "Custom Build — I rebuild how your expertise makes you revenue",
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
  whatYouDontGet: "What you don't get",
  time: "When you get value",
} as const;

/** High-ticket only — done-with-you / done-for-you build ($1k–$10k+). */
export const highTicketSectionLabels = {
  whatIDo: "What I do",
  whatYouGet: "What you get",
  whatChanges: "What changes",
  before: "Before",
  after: "After",
  timeline: "Timeline",
  whoFor: "Who this is for",
  afterApply: "What happens after you apply",
  reviewStep: "Review",
  decisionStep: "Decision",
  nextStep: "Next action",
} as const;

export const highTicketOfferCopy = {
  headlineLead: "Custom Build",
  headline: "I rebuild how your expertise makes you revenue.",
  whatIDo: [
    "Identify what people would actually pay for right now",
    "Remove offers, pages, and work that don't lead to payment",
    "Restructure everything into one clear direction",
    "Rewrite how your offer is explained so it's understood instantly",
    "Fix the path from interest → decision → payment",
  ],
  whatYouGet: [
    "One clear offer people understand immediately",
    "A direct path from someone finding you to paying you",
    "Clear pricing and positioning",
    "A structure you can actually operate without confusion",
  ],
  whatChangesParagraphs: [
    "You stop doing work that doesn't pay.",
    "You start getting paid for what you already know how to do.",
  ],
  whatYouDontGet: [
    "Not a course, community, or template library.",
    "Ongoing ads or daily ops unless scoped separately.",
  ],
  time: "Initial breakdown within 48 hours. Build and changes begin immediately after.",
  whoFor: [
    "You already have experience or clients",
    "You're working, but it's inconsistent or unclear",
    "You're ready to change how you operate, not talk about it",
  ],
  afterApply: {
    review: "I review your current setup.",
    decision: "If there's a real opportunity, you'll get next steps.",
    nextAction: "If not, you won't be pushed into anything.",
  },
  price: "Custom investment · final scope after apply",
  cta: "Apply for custom build",
} as const;

export const offerInstallTiers = [
  {
    id: "path" as const,
    headline: "Fix One Area",
    collapsedOutcome: "One revenue area diagnosed and corrected—fast.",
    headlineSub: "Pick one part of your work that isn't turning into money.",
    pickOneIntro: "Choose one:",
    pickOneOptions: ["Your offer", "Your positioning", "Your structure", "Your landing page"],
    whatYouGet: [
      "What's not working",
      "What's causing it",
      "What to remove",
      "What to change it to",
    ],
    whatChanges: "That one area stops stalling and starts producing.",
    whatYouDontGet: ["Nothing outside of what you chose is reviewed."],
    time: "Delivered within 48 hours",
    price: "$34",
    cta: "Fix this properly",
  },
  {
    id: "fix" as const,
    headline: "Full Breakdown",
    collapsedOutcome: "Full picture of what pays, what leaks, and what to do next.",
    headlineSub: "See exactly what's working, what isn't, and where money is being lost.",
    whatYouGet: [
      "Where your time is actually going",
      "What's bringing in money",
      "What people are ignoring or not understanding",
      "What to stop doing immediately",
      "What to focus on instead",
    ],
    whatChangesParagraphs: [
      "You stop splitting effort across too many things.",
      "You see one clear direction that can actually pay.",
    ],
    whatYouDontGet: [
      "Nothing is built for you.",
      "You'll know what to do. You'll decide if you do it yourself or not.",
    ],
    time: "Clarity within 48 hours",
    price: "$750",
    cta: "See the full breakdown",
  },
  {
    id: "breakdown" as const,
    collapsedOutcome: "Custom rebuild of offer, path, and revenue structure.",
    ...highTicketOfferCopy,
  },
] as const;

export type OfferTierId = (typeof offerInstallTiers)[number]["id"];

export const diagnosticExitCopy = {
  title: "Leave the Revenue Diagnostic?",
  body: "You'll lose this run. Start over if you come back.",
  stay: "Continue",
  leave: "Leave",
} as const;
