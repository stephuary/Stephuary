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
  headline:
    "I restructure your offers, pricing, and week so the right buyers pay—without confusion, rework, or four competing priorities.",
  whatIDo: [
    "Rip apart overlapping offers: what stays, what merges, what dies",
    "Rewrite pricing and scope so calls stop bleeding margin",
    "Rebuild your main buyer touchpoint (page, deck, or one-pager) for one buyer",
    "Lock delivery and calendar rules so the work that pays wins the week",
    "Run weekly working sessions until the new path is live in your business",
  ],
  whatYouGet: [
    "A written map: where money comes in, where it leaks, ranked by pain",
    "A numbered change list: what moves first, who owns it, rough upside",
    "Drafted or rewritten copy for your primary sales touchpoint",
    "A price and scope table you can quote on calls",
    "30 days of async tweaks after handoff",
  ],
  beforeAfter: {
    before:
      "Too many offers, soft pricing, buyer confused, your calendar owned by everything except the work that pays.",
    after: "One primary buyer, one main offer, clear dollars, a week built around delivery.",
  },
  time: "Engagement starts within 2 weeks of cleared deposit. First working session in week one. Most builds: 4–8 weeks unless we widen scope.",
  whoFor: [
    "You're already selling—roughly $10k+ rolling revenue, not ideation",
    "You'll bring real numbers, pipeline reality, and one honest week of calendar data",
    "You can show up 60–90 minutes weekly while we build",
    "You're paying for execution and decisions, not opinions in a folder",
  ],
  afterApply: {
    review: "I read your application and diagnostic. If something's missing, you get one direct ask—not a thread.",
    decision: "Within 5 business days: yes (fit + slot) or no (one line why—usually timing or scope).",
    nextAction:
      "Yes → you get calendar, deposit invoice, and start date. No → you're not stuck on a nurture list.",
  },
  price: "$1,000–$10,000+ · final number on a 20-minute scope call after apply",
  cta: "Apply now",
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
