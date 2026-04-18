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

/** Five phases — 18 questions total (4 + 3 + 4 + 3 + 4). */
export const PHASE_LABELS = [
  "Current Work",
  "Skills + Experience",
  "Time Misuse",
  "Direction",
  "Thinking Patterns",
] as const;

/** Index ranges: [0–3], [4–6], [7–10], [11–13], [14–17]. */
const PHASE_SIZES = [4, 3, 4, 3, 4] as const;

export const QUESTIONS: Question[] = [
  // Phase 0 — Current Work
  {
    id: "q1",
    phaseIndex: 0,
    prompt: "This month, most of your working hours went to:",
    options: [
      { id: "q1a", label: "Hopping clients — no real boundary", tags: ["work:split", "boundary:weak"], scoreDelta: { focus: -8, clarity: -4 } },
      { id: "q1b", label: "One offer — admin eats the calendar", tags: ["work:single_offer", "ops:heavy"], scoreDelta: { clarity: 6, focus: 4, leverage: -6 } },
      { id: "q1c", label: "Learning and building — nothing ships to buyers", tags: ["ship:delayed", "buyer:absent"], scoreDelta: { demand: -10, monetization: -6 } },
      { id: "q1d", label: "Sold work — backlog hurts, not sales", tags: ["work:delivery", "demand:proven"], scoreDelta: { demand: 10, monetization: 6, leverage: -6 } },
    ],
  },
  {
    id: "q2",
    phaseIndex: 0,
    prompt: "When someone asks what you do, you:",
    options: [
      { id: "q2a", label: "List skills — or change it by room", tags: ["pitch:list", "message:weak"], scoreDelta: { clarity: -10, focus: -4 } },
      { id: "q2b", label: "Name one outcome for one buyer", tags: ["pitch:outcome", "niche:stated"], scoreDelta: { clarity: 10, focus: 8 } },
      { id: "q2c", label: "Deflect until you know they have budget", tags: ["pitch:soft", "price:hide"], scoreDelta: { monetization: -6, clarity: -4 } },
      { id: "q2d", label: "Dodge — inbound’s thin and it’s awkward", tags: ["inbound:thin", "proof:low"], scoreDelta: { demand: -10, clarity: -6 } },
    ],
  },
  {
    id: "q3",
    phaseIndex: 0,
    prompt: "Your last paying clients came from:",
    options: [
      { id: "q3a", label: "Referrals — people who knew you already", tags: ["lead:warm", "channel:relational"], scoreDelta: { demand: 6, focus: 4 } },
      { id: "q3b", label: "Cold outbound or cold DMs", tags: ["lead:cold", "system:fragile"], scoreDelta: { demand: 2, leverage: -8 } },
      { id: "q3c", label: "Inbound: content, search, or a buy button", tags: ["lead:pull", "asset:live"], scoreDelta: { demand: 10, leverage: 8 } },
      { id: "q3d", label: "Still trying to land the first paid wins", tags: ["traction:early"], scoreDelta: { demand: -4, monetization: -2 } },
    ],
  },
  {
    id: "q4",
    phaseIndex: 0,
    prompt: "The work you want to be known for, in public, is:",
    options: [
      { id: "q4a", label: "Clear to you — fuzzy to strangers", tags: ["position:internal"], scoreDelta: { clarity: -8, demand: -4 } },
      { id: "q4b", label: "The same line on bio, site, and calls", tags: ["position:aligned"], scoreDelta: { clarity: 10, focus: 8 } },
      { id: "q4c", label: "Split across two audiences — you won’t pick", tags: ["audience:split", "focus:divided"], scoreDelta: { focus: -12, clarity: -8 } },
      { id: "q4d", label: "Rewritten every month — nothing sticks", tags: ["pivot:often"], scoreDelta: { focus: -10, clarity: -8 } },
    ],
  },
  // Phase 1 — Skills + Experience
  {
    id: "q6",
    phaseIndex: 1,
    prompt: "What buyers already pay you for is:",
    options: [
      { id: "q6a", label: "A blur — checks from unrelated tasks", tags: ["skill:fuzzy"], scoreDelta: { clarity: -10, monetization: -4 } },
      { id: "q6b", label: "One named, repeatable deliverable", tags: ["skill:named"], scoreDelta: { clarity: 8, monetization: 6 } },
      { id: "q6c", label: "You talk more than you ship.", tags: ["skill:advice"], scoreDelta: { monetization: 4, leverage: 6 } },
      { id: "q6d", label: "Hands-on execution — your hours are the product", tags: ["skill:labor"], scoreDelta: { monetization: -4, leverage: -8 } },
    ],
  },
  {
    id: "q7",
    phaseIndex: 1,
    prompt: "Proof you could show a stranger in the next hour:",
    options: [
      { id: "q7a", label: "Logo wall — no numbers", tags: ["proof:logo_only"], scoreDelta: { demand: -4, clarity: -4 } },
      { id: "q7b", label: "Before/after numbers with context", tags: ["proof:numbers"], scoreDelta: { demand: 10, clarity: 6 } },
      { id: "q7c", label: "Testimonials — praise, not outcomes", tags: ["proof:soft"], scoreDelta: { demand: 2 } },
      { id: "q7d", label: "Under NDA — you’d struggle to show it", tags: ["proof:hidden"], scoreDelta: { demand: -8 } },
    ],
  },
  {
    id: "q9",
    phaseIndex: 1,
    prompt: "The biggest share of your work time goes to:",
    options: [
      { id: "q9a", label: "Teaching or posting — more than delivery", tags: ["mode:teach_heavy"], scoreDelta: { monetization: -6, demand: 4 } },
      { id: "q9b", label: "Paid delivery — more than content", tags: ["mode:delivery"], scoreDelta: { monetization: 8, focus: 6 } },
      { id: "q9c", label: "Selling and admin — more than building", tags: ["mode:sales_ops"], scoreDelta: { leverage: -4, clarity: 4 } },
      { id: "q9d", label: "Split — no lane wins", tags: ["mode:split"], scoreDelta: { focus: -8 } },
    ],
  },
  // Phase 2 — Time Misuse
  {
    id: "q11",
    phaseIndex: 2,
    prompt: "Time on email and Slack each week:",
    options: [
      { id: "q11a", label: "Under five focused hours — boundaries + templates", tags: ["time:comms_light"], scoreDelta: { leverage: 10 } },
      { id: "q11b", label: "Fifteen-plus hours — pings run your day", tags: ["time:comms_heavy"], scoreDelta: { leverage: -12, focus: -6 } },
      { id: "q11c", label: "Spikes around launches — quiet between", tags: ["time:comms_spiky"], scoreDelta: { leverage: -4 } },
      { id: "q11d", label: "No idea — you don’t measure it", tags: ["time:comms_blind"], scoreDelta: { leverage: -6, clarity: -4 } },
    ],
  },
  {
    id: "q12",
    phaseIndex: 2,
    prompt: "Live meetings with prospects or clients:",
    options: [
      { id: "q12a", label: "Back-to-back — four or five days a week", tags: ["time:meetings_packed"], scoreDelta: { leverage: -10, monetization: 4 } },
      { id: "q12b", label: "Deep-work blocks defended on the calendar", tags: ["time:deep_blocks"], scoreDelta: { leverage: 8, focus: 6 } },
      { id: "q12c", label: "Rare live calls — async default", tags: ["time:async"], scoreDelta: { leverage: 6 } },
      { id: "q12d", label: "Chaotic — moves and cancels last minute", tags: ["time:chaos"], scoreDelta: { focus: -8 } },
    ],
  },
  {
    id: "q13",
    phaseIndex: 2,
    prompt: "When the pipeline goes quiet, you reach for:",
    options: [
      { id: "q13a", label: "Another course, video, or tutorial", tags: ["slow:consume"], scoreDelta: { leverage: -8, focus: -6 } },
      { id: "q13b", label: "Outreach to people who already paid you", tags: ["slow:reactivate"], scoreDelta: { demand: 8, monetization: 4 } },
      { id: "q13c", label: "Rewriting offer, page, or scope on paper", tags: ["slow:reposition"], scoreDelta: { clarity: 8, monetization: 6 } },
      { id: "q13d", label: "Any paid work — including bad fit", tags: ["slow:panic_yes"], scoreDelta: { focus: -10, monetization: -8 } },
    ],
  },
  {
    id: "q15",
    phaseIndex: 2,
    prompt: "Switching between projects in a day:",
    options: [
      { id: "q15a", label: "Nonstop — never 90 minutes on one thing", tags: ["focus:fragmented"], scoreDelta: { focus: -12, leverage: -6 } },
      { id: "q15b", label: "Mornings deep — afternoons reactive", tags: ["focus:split_day"], scoreDelta: { focus: 2 } },
      { id: "q15c", label: "Batched — similar work grouped", tags: ["focus:batched"], scoreDelta: { focus: 10, leverage: 6 } },
      { id: "q15d", label: "You haven’t clocked it — one blur", tags: ["focus:blind"], scoreDelta: { clarity: -6 } },
    ],
  },
  // Phase 3 — Direction
  {
    id: "q16",
    phaseIndex: 3,
    prompt: "Your niche, in one line, today:",
    options: [
      { id: "q16a", label: "Still in a doc — not live anywhere", tags: ["niche:draft"], scoreDelta: { clarity: -10, focus: -6 } },
      { id: "q16b", label: "An industry label — too wide to buy from", tags: ["niche:wide"], scoreDelta: { focus: -4 } },
      { id: "q16c", label: "Named pain + named buyer who pays", tags: ["niche:sharp"], scoreDelta: { clarity: 10, demand: 8 } },
      { id: "q16d", label: "One metric — one seat — one owner", tags: ["niche:metric"], scoreDelta: { demand: 10, monetization: 6 } },
    ],
  },
  {
    id: "q17",
    phaseIndex: 3,
    prompt: "Your next 90-day revenue number:",
    options: [
      { id: "q17a", label: "On paper — three measurable weekly moves", tags: ["plan:clear"], scoreDelta: { leverage: 8, clarity: 8 } },
      { id: "q17b", label: "A round figure — no plan attached", tags: ["plan:vague"], scoreDelta: { clarity: -10, leverage: -6 } },
      { id: "q17c", label: "Per project only — no 90-day target", tags: ["plan:reactive"], scoreDelta: { demand: -4 } },
      { id: "q17d", label: "Set by someone else — not you", tags: ["plan:external"], scoreDelta: { focus: -4 } },
    ],
  },
  {
    id: "q19",
    phaseIndex: 3,
    prompt: "One offer line you should kill or merge:",
    options: [
      { id: "q19a", label: "Launched messy — story never finished", tags: ["offer:launch_weak"], scoreDelta: { clarity: -6 } },
      { id: "q19b", label: "Pulls the wrong buyer", tags: ["offer:mismatch"], scoreDelta: { focus: -6 } },
      { id: "q19c", label: "Underpriced or overbuilt for what it earns", tags: ["offer:price_wrong"], scoreDelta: { monetization: -6 } },
      { id: "q19d", label: "None — you keep stacking new ones", tags: ["offer:stacked"], scoreDelta: { focus: -10, clarity: -8 } },
    ],
  },
  // Phase 4 — Thinking Patterns
  {
    id: "q21",
    phaseIndex: 4,
    prompt: "Narrowing who you serve feels like:",
    options: [
      { id: "q21a", label: "Closing a door on money", tags: ["think:fear_narrow"], scoreDelta: { focus: -8, clarity: -6 } },
      { id: "q21b", label: "Shortening the cycle — cleaner work", tags: ["think:embrace_narrow"], scoreDelta: { focus: 10, clarity: 8 } },
      { id: "q21c", label: "Impossible — every label overlaps", tags: ["think:niche_confused"], scoreDelta: { clarity: -8 } },
      { id: "q21d", label: "A buzzword — you tune it out", tags: ["think:niche_skeptic"], scoreDelta: { focus: -2 } },
    ],
  },
  {
    id: "q22",
    phaseIndex: 4,
    prompt: "Right after you say a price out loud, you feel:",
    options: [
      { id: "q22a", label: "They’ll leave — you said too much", tags: ["think:price_fear"], scoreDelta: { monetization: -10 } },
      { id: "q22b", label: "Calm — the math works at that number", tags: ["think:price_solid"], scoreDelta: { monetization: 10 } },
      { id: "q22c", label: "Heat — they shouldn’t push on this", tags: ["think:price_resent"], scoreDelta: { monetization: -4 } },
      { id: "q22d", label: "Nothing — you change the subject before numbers", tags: ["think:price_avoid"], scoreDelta: { monetization: -8, clarity: -6 } },
    ],
  },
  {
    id: "q23",
    phaseIndex: 4,
    prompt: "From first idea to committed action, big decisions take:",
    options: [
      { id: "q23a", label: "Days — you pick and move", tags: ["think:fast"], scoreDelta: { leverage: 8, focus: 6 } },
      { id: "q23b", label: "Weeks — stuck in research tabs", tags: ["think:slow"], scoreDelta: { leverage: -6, focus: -4 } },
      { id: "q23c", label: "Months — waiting until it’s perfect", tags: ["think:stall"], scoreDelta: { leverage: -10, demand: -4 } },
      { id: "q23d", label: "Someone else signs off — not you", tags: ["think:defer"], scoreDelta: { focus: -6 } },
    ],
  },
  {
    id: "q24",
    phaseIndex: 4,
    prompt: "Ten focused hours land on your calendar this week. You spend them on:",
    options: [
      { id: "q24a", label: "A sellable page, asset, or packaged thing", tags: ["think:ship_asset"], scoreDelta: { demand: 8, clarity: 6 } },
      { id: "q24b", label: "Clearing client backlog", tags: ["think:catchup"], scoreDelta: { monetization: 4, leverage: -4 } },
      { id: "q24c", label: "Studying, sorting files, rearranging tools", tags: ["think:reorg"], scoreDelta: { leverage: -8 } },
      { id: "q24d", label: "Frozen — no clear first move", tags: ["think:stuck"], scoreDelta: { clarity: -10, focus: -8 } },
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
  let start = 0;
  for (let p = 0; p < PHASE_SIZES.length; p++) {
    const size = PHASE_SIZES[p];
    if (questionIndex >= start && questionIndex < start + size) {
      return {
        phaseIndex: p,
        phaseLabel: PHASE_LABELS[p] ?? PHASE_LABELS[0],
        questionInPhase: questionIndex - start + 1,
      };
    }
    start += size;
  }
  return {
    phaseIndex: 0,
    phaseLabel: PHASE_LABELS[0],
    questionInPhase: 1,
  };
}
