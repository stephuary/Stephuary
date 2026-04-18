import type { ScoreKey } from "../lib/scoreKeys";

export type QuestionOption = {
  id: string;
  label: string;
  tags: string[];
  scoreDelta: Partial<Record<ScoreKey, number>>;
};

export type Question = {
  id: string;
  phaseIndex: number;
  prompt: string;
  options: QuestionOption[];
};

/** Five phases × five questions */
export const PHASE_LABELS = [
  "Current Work",
  "Skills + Experience",
  "Time Misuse",
  "Direction",
  "Thinking Patterns",
] as const;

export const QUESTIONS: Question[] = [
  // Phase 1 — Current Work
  {
    id: "q1",
    phaseIndex: 0,
    prompt: "Most of your working hours this month go to:",
    options: [
      { id: "q1a", label: "Jumping between clients or projects with no fixed boundary", tags: ["work:split", "boundary:weak"], scoreDelta: { focus: -8, clarity: -4 } },
      { id: "q1b", label: "One main offer, but admin and messages eat the day", tags: ["work:single_offer", "ops:heavy"], scoreDelta: { clarity: 6, focus: 4, leverage: -6 } },
      { id: "q1c", label: "Building or learning without shipping to buyers", tags: ["ship:delayed", "buyer:absent"], scoreDelta: { demand: -10, monetization: -6 } },
      { id: "q1d", label: "Delivery you already sold — the stress is backlog", tags: ["work:delivery", "demand:proven"], scoreDelta: { demand: 10, monetization: 6, leverage: -6 } },
    ],
  },
  {
    id: "q2",
    phaseIndex: 0,
    prompt: "When someone asks what you do, you usually:",
    options: [
      { id: "q2a", label: "List skills or change the answer by room", tags: ["pitch:list", "message:weak"], scoreDelta: { clarity: -10, focus: -4 } },
      { id: "q2b", label: "Name one outcome for one type of buyer", tags: ["pitch:outcome", "niche:stated"], scoreDelta: { clarity: 10, focus: 8 } },
      { id: "q2c", label: "Defer until you know their budget", tags: ["pitch:soft", "price:hide"], scoreDelta: { monetization: -6, clarity: -4 } },
      { id: "q2d", label: "Avoid the question — inbound is thin", tags: ["inbound:thin", "proof:low"], scoreDelta: { demand: -10, clarity: -6 } },
    ],
  },
  {
    id: "q3",
    phaseIndex: 0,
    prompt: "Your last few paying clients came from:",
    options: [
      { id: "q3a", label: "Referrals or people who already knew you", tags: ["lead:warm", "channel:relational"], scoreDelta: { demand: 6, focus: 4 } },
      { id: "q3b", label: "Cold outbound or random DMs", tags: ["lead:cold", "system:fragile"], scoreDelta: { demand: 2, leverage: -8 } },
      { id: "q3c", label: "Content, search, or a product page with a buy path", tags: ["lead:pull", "asset:live"], scoreDelta: { demand: 10, leverage: 8 } },
      { id: "q3d", label: "Still lining up the first paid wins", tags: ["traction:early"], scoreDelta: { demand: -4, monetization: -2 } },
    ],
  },
  {
    id: "q4",
    phaseIndex: 0,
    prompt: "The work you want to be known for is:",
    options: [
      { id: "q4a", label: "Clear to you, unclear to strangers", tags: ["position:internal"], scoreDelta: { clarity: -8, demand: -4 } },
      { id: "q4b", label: "The same line in bio, site, and sales calls", tags: ["position:aligned"], scoreDelta: { clarity: 10, focus: 8 } },
      { id: "q4c", label: "Split across two audiences you will not drop", tags: ["audience:split", "focus:divided"], scoreDelta: { focus: -12, clarity: -8 } },
      { id: "q4d", label: "Still shifting month to month", tags: ["pivot:often"], scoreDelta: { focus: -10, clarity: -8 } },
    ],
  },
  {
    id: "q5",
    phaseIndex: 0,
    prompt: "If client load doubled tomorrow, what breaks first?",
    options: [
      { id: "q5a", label: "Your calendar — everything is manual", tags: ["ops:manual", "leverage:low"], scoreDelta: { leverage: -12 } },
      { id: "q5b", label: "Quality — you are the bottleneck", tags: ["delivery:you"], scoreDelta: { leverage: -6, focus: 6 } },
      { id: "q5c", label: "Cash timing or margin", tags: ["cash:tight"], scoreDelta: { monetization: -8 } },
      { id: "q5d", label: "Not much — you have slack and systems", tags: ["ops:buffer"], scoreDelta: { leverage: 12, clarity: 4 } },
    ],
  },
  // Phase 2 — Skills + Experience
  {
    id: "q6",
    phaseIndex: 1,
    prompt: "The skill buyers already pay you for is:",
    options: [
      { id: "q6a", label: "Unclear — checks come from mixed tasks", tags: ["skill:fuzzy"], scoreDelta: { clarity: -10, monetization: -4 } },
      { id: "q6b", label: "One repeatable task with a name", tags: ["skill:named"], scoreDelta: { clarity: 8, monetization: 6 } },
      { id: "q6c", label: "Strategy or advice — delivery is thin", tags: ["skill:advice"], scoreDelta: { monetization: 4, leverage: 6 } },
      { id: "q6d", label: "Hands-on execution — heavy hours", tags: ["skill:labor"], scoreDelta: { monetization: -4, leverage: -8 } },
    ],
  },
  {
    id: "q7",
    phaseIndex: 1,
    prompt: "Proof you can show a stranger today:",
    options: [
      { id: "q7a", label: "Logos without numbers", tags: ["proof:logo_only"], scoreDelta: { demand: -4, clarity: -4 } },
      { id: "q7b", label: "Before/after metrics with context", tags: ["proof:numbers"], scoreDelta: { demand: 10, clarity: 6 } },
      { id: "q7c", label: "Named quotes — light on outcomes", tags: ["proof:soft"], scoreDelta: { demand: 2 } },
      { id: "q7d", label: "Mostly private — hard to share", tags: ["proof:hidden"], scoreDelta: { demand: -8 } },
    ],
  },
  {
    id: "q8",
    phaseIndex: 1,
    prompt: "Time in the field you sell into:",
    options: [
      { id: "q8a", label: "Under two years", tags: ["tenure:junior"], scoreDelta: { clarity: -2 } },
      { id: "q8b", label: "Two to seven years", tags: ["tenure:mid"], scoreDelta: { demand: 4 } },
      { id: "q8c", label: "Seven plus years", tags: ["tenure:senior"], scoreDelta: { demand: 6, clarity: 4 } },
      { id: "q8d", label: "Cross-industry — no single field", tags: ["tenure:generalist"], scoreDelta: { focus: -8, clarity: -4 } },
    ],
  },
  {
    id: "q9",
    phaseIndex: 1,
    prompt: "You spend more time:",
    options: [
      { id: "q9a", label: "Teaching or posting than billing delivery", tags: ["mode:teach_heavy"], scoreDelta: { monetization: -6, demand: 4 } },
      { id: "q9b", label: "Delivering paid work than creating content", tags: ["mode:delivery"], scoreDelta: { monetization: 8, focus: 6 } },
      { id: "q9c", label: "Selling and admin than building", tags: ["mode:sales_ops"], scoreDelta: { leverage: -4, clarity: 4 } },
      { id: "q9d", label: "Evenly split — no dominant lane", tags: ["mode:split"], scoreDelta: { focus: -8 } },
    ],
  },
  {
    id: "q10",
    phaseIndex: 1,
    prompt: "Buyers who pay premium care most about:",
    options: [
      { id: "q10a", label: "Speed and low risk", tags: ["buyer:risk"], scoreDelta: { monetization: 4, demand: 4 } },
      { id: "q10b", label: "Credentials or brand names", tags: ["buyer:brand"], scoreDelta: { demand: 2 } },
      { id: "q10c", label: "A metric you move", tags: ["buyer:metric"], scoreDelta: { demand: 10, clarity: 8 } },
      { id: "q10d", label: "You have not asked them directly", tags: ["buyer:unknown"], scoreDelta: { clarity: -8, demand: -4 } },
    ],
  },
  // Phase 3 — Time Misuse
  {
    id: "q11",
    phaseIndex: 2,
    prompt: "Email and Slack in a normal week:",
    options: [
      { id: "q11a", label: "Under five focused hours — templates and rules", tags: ["time:comms_light"], scoreDelta: { leverage: 10 } },
      { id: "q11b", label: "Fifteen plus hours — threads run you", tags: ["time:comms_heavy"], scoreDelta: { leverage: -12, focus: -6 } },
      { id: "q11c", label: "Bursts around launches only", tags: ["time:comms_spiky"], scoreDelta: { leverage: -4 } },
      { id: "q11d", label: "Not tracked", tags: ["time:comms_blind"], scoreDelta: { leverage: -6, clarity: -4 } },
    ],
  },
  {
    id: "q12",
    phaseIndex: 2,
    prompt: "Meetings with prospects or clients:",
    options: [
      { id: "q12a", label: "Back-to-back most days", tags: ["time:meetings_packed"], scoreDelta: { leverage: -10, monetization: 4 } },
      { id: "q12b", label: "Protected blocks for deep work", tags: ["time:deep_blocks"], scoreDelta: { leverage: 8, focus: 6 } },
      { id: "q12c", label: "Few — mostly async", tags: ["time:async"], scoreDelta: { leverage: 6 } },
      { id: "q12d", label: "Chaotic — rescheduled often", tags: ["time:chaos"], scoreDelta: { focus: -8 } },
    ],
  },
  {
    id: "q13",
    phaseIndex: 2,
    prompt: "When work is slow, you default to:",
    options: [
      { id: "q13a", label: "More courses or tutorials", tags: ["slow:consume"], scoreDelta: { leverage: -8, focus: -6 } },
      { id: "q13b", label: "Outreach to past clients", tags: ["slow:reactivate"], scoreDelta: { demand: 8, monetization: 4 } },
      { id: "q13c", label: "Tightening the offer on paper", tags: ["slow:reposition"], scoreDelta: { clarity: 8, monetization: 6 } },
      { id: "q13d", label: "Saying yes to bad-fit work", tags: ["slow:panic_yes"], scoreDelta: { focus: -10, monetization: -8 } },
    ],
  },
  {
    id: "q14",
    phaseIndex: 2,
    prompt: "Tooling and subscriptions:",
    options: [
      { id: "q14a", label: "Overlap — same job, multiple apps", tags: ["stack:overlap"], scoreDelta: { leverage: -8, monetization: -4 } },
      { id: "q14b", label: "Lean — one workflow", tags: ["stack:lean"], scoreDelta: { leverage: 8 } },
      { id: "q14c", label: "Heavy — you avoid canceling", tags: ["stack:bloat"], scoreDelta: { leverage: -6 } },
      { id: "q14d", label: "Free tiers only", tags: ["stack:free"], scoreDelta: { monetization: -2 } },
    ],
  },
  {
    id: "q15",
    phaseIndex: 2,
    prompt: "Context switching between projects:",
    options: [
      { id: "q15a", label: "Constant — rarely 90 minutes straight", tags: ["focus:fragmented"], scoreDelta: { focus: -12, leverage: -6 } },
      { id: "q15b", label: "Morning deep, afternoon reactive", tags: ["focus:split_day"], scoreDelta: { focus: 2 } },
      { id: "q15c", label: "Rare — you batch similar work", tags: ["focus:batched"], scoreDelta: { focus: 10, leverage: 6 } },
      { id: "q15d", label: "You have not noticed", tags: ["focus:blind"], scoreDelta: { clarity: -6 } },
    ],
  },
  // Phase 4 — Direction
  {
    id: "q16",
    phaseIndex: 3,
    prompt: "Your niche in one line:",
    options: [
      { id: "q16a", label: "Still writing it", tags: ["niche:draft"], scoreDelta: { clarity: -10, focus: -6 } },
      { id: "q16b", label: "Industry label only — too wide", tags: ["niche:wide"], scoreDelta: { focus: -4 } },
      { id: "q16c", label: "Pain plus buyer who pays", tags: ["niche:sharp"], scoreDelta: { clarity: 10, demand: 8 } },
      { id: "q16d", label: "One metric you improve for one seat", tags: ["niche:metric"], scoreDelta: { demand: 10, monetization: 6 } },
    ],
  },
  {
    id: "q17",
    phaseIndex: 3,
    prompt: "Your next 90-day revenue target is:",
    options: [
      { id: "q17a", label: "Written with three measurable actions", tags: ["plan:clear"], scoreDelta: { leverage: 8, clarity: 8 } },
      { id: "q17b", label: "A vague number in your head", tags: ["plan:vague"], scoreDelta: { clarity: -10, leverage: -6 } },
      { id: "q17c", label: "Project-only — no target", tags: ["plan:reactive"], scoreDelta: { demand: -4 } },
      { id: "q17d", label: "Owned by someone else", tags: ["plan:external"], scoreDelta: { focus: -4 } },
    ],
  },
  {
    id: "q18",
    phaseIndex: 3,
    prompt: "Competitors you track:",
    options: [
      { id: "q18a", label: "Daily tabs — slows shipping", tags: ["dir:comp_watch"], scoreDelta: { focus: -10, leverage: -6 } },
      { id: "q18b", label: "Named on sales calls", tags: ["dir:comp_real"], scoreDelta: { demand: 4 } },
      { id: "q18c", label: "Ignored — you study buyers", tags: ["dir:buyer_focus"], scoreDelta: { focus: 8, demand: 6 } },
      { id: "q18d", label: "Unknown — no map", tags: ["dir:comp_blind"], scoreDelta: { clarity: -6 } },
    ],
  },
  {
    id: "q19",
    phaseIndex: 3,
    prompt: "An offer you should retire:",
    options: [
      { id: "q19a", label: "Never launched clean", tags: ["offer:launch_weak"], scoreDelta: { clarity: -6 } },
      { id: "q19b", label: "Wrong audience", tags: ["offer:mismatch"], scoreDelta: { focus: -6 } },
      { id: "q19c", label: "Price wrong for value", tags: ["offer:price_wrong"], scoreDelta: { monetization: -6 } },
      { id: "q19d", label: "None — you keep adding", tags: ["offer:stacked"], scoreDelta: { focus: -10, clarity: -8 } },
    ],
  },
  {
    id: "q20",
    phaseIndex: 3,
    prompt: "Personal name vs company name:",
    options: [
      { id: "q20a", label: "Same — one story", tags: ["brand:unified"], scoreDelta: { clarity: 8 } },
      { id: "q20b", label: "Split — confuses leads", tags: ["brand:split"], scoreDelta: { clarity: -10, focus: -6 } },
      { id: "q20c", label: "You-forward, light company shell", tags: ["brand:personal"], scoreDelta: { demand: 4 } },
      { id: "q20d", label: "Company-forward — you stay hidden", tags: ["brand:hidden"], scoreDelta: { demand: -4 } },
    ],
  },
  // Phase 5 — Thinking Patterns
  {
    id: "q21",
    phaseIndex: 4,
    prompt: "Narrowing your audience feels:",
    options: [
      { id: "q21a", label: "Like turning off revenue", tags: ["think:fear_narrow"], scoreDelta: { focus: -8, clarity: -6 } },
      { id: "q21b", label: "Like faster sales and cleaner work", tags: ["think:embrace_narrow"], scoreDelta: { focus: 10, clarity: 8 } },
      { id: "q21c", label: "Confusing — labels overlap", tags: ["think:niche_confused"], scoreDelta: { clarity: -8 } },
      { id: "q21d", label: "Neutral — word feels overused", tags: ["think:niche_skeptic"], scoreDelta: { focus: -2 } },
    ],
  },
  {
    id: "q22",
    phaseIndex: 4,
    prompt: "When you name a price, the feeling underneath is:",
    options: [
      { id: "q22a", label: "Fear they will leave", tags: ["think:price_fear"], scoreDelta: { monetization: -10 } },
      { id: "q22b", label: "Relief — math works at that number", tags: ["think:price_solid"], scoreDelta: { monetization: 10 } },
      { id: "q22c", label: "Anger they push back", tags: ["think:price_resent"], scoreDelta: { monetization: -4 } },
      { id: "q22d", label: "Blank — you avoid numbers", tags: ["think:price_avoid"], scoreDelta: { monetization: -8, clarity: -6 } },
    ],
  },
  {
    id: "q23",
    phaseIndex: 4,
    prompt: "Big decisions in your business usually take:",
    options: [
      { id: "q23a", label: "Days — you decide and move", tags: ["think:fast"], scoreDelta: { leverage: 8, focus: 6 } },
      { id: "q23b", label: "Weeks — research loops", tags: ["think:slow"], scoreDelta: { leverage: -6, focus: -4 } },
      { id: "q23c", label: "Months — waiting for perfect", tags: ["think:stall"], scoreDelta: { leverage: -10, demand: -4 } },
      { id: "q23d", label: "Someone else decides", tags: ["think:defer"], scoreDelta: { focus: -6 } },
    ],
  },
  {
    id: "q24",
    phaseIndex: 4,
    prompt: "If you had ten focused hours this week, you would:",
    options: [
      { id: "q24a", label: "Finish a sellable asset or page", tags: ["think:ship_asset"], scoreDelta: { demand: 8, clarity: 6 } },
      { id: "q24b", label: "Catch up on client work", tags: ["think:catchup"], scoreDelta: { monetization: 4, leverage: -4 } },
      { id: "q24c", label: "Study or reorganize folders", tags: ["think:reorg"], scoreDelta: { leverage: -8 } },
      { id: "q24d", label: "Not know where to start", tags: ["think:stuck"], scoreDelta: { clarity: -10, focus: -8 } },
    ],
  },
  {
    id: "q25",
    phaseIndex: 4,
    prompt: "The story you tell about why it is not working yet:",
    options: [
      { id: "q25a", label: "The market is noisy", tags: ["think:blame_market"], scoreDelta: { demand: -4, clarity: -4 } },
      { id: "q25b", label: "I need one more credential", tags: ["think:blame_cred"], scoreDelta: { focus: -6 } },
      { id: "q25c", label: "My offer and calendar are misaligned", tags: ["think:own_misalign"], scoreDelta: { clarity: 8, focus: 8 } },
      { id: "q25d", label: "I have not shipped enough tests", tags: ["think:own_ship"], scoreDelta: { demand: 6, leverage: 6 } },
    ],
  },
];

export const ALL_QUESTIONS = QUESTIONS;

export function findQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

export function findOption(
  question: Question,
  optionId: string,
): QuestionOption | undefined {
  return question.options.find((o) => o.id === optionId);
}

export function phaseMeta(questionIndex: number): {
  phaseIndex: number;
  phaseLabel: string;
  questionInPhase: number;
} {
  const phaseIndex = Math.floor(questionIndex / 5);
  const questionInPhase = (questionIndex % 5) + 1;
  return {
    phaseIndex,
    phaseLabel: PHASE_LABELS[phaseIndex] ?? PHASE_LABELS[0],
    questionInPhase,
  };
}
