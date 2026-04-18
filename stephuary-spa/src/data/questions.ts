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
    prompt: "This month, most of your working hours went to:",
    options: [
      { id: "q1a", label: "Hopping clients or projects — no written boundary", tags: ["work:split", "boundary:weak"], scoreDelta: { focus: -8, clarity: -4 } },
      { id: "q1b", label: "One main offer — admin and messages eat the calendar", tags: ["work:single_offer", "ops:heavy"], scoreDelta: { clarity: 6, focus: 4, leverage: -6 } },
      { id: "q1c", label: "Learning and building — nothing ships to people who can pay", tags: ["ship:delayed", "buyer:absent"], scoreDelta: { demand: -10, monetization: -6 } },
      { id: "q1d", label: "Work you already sold — the pain is backlog, not sales", tags: ["work:delivery", "demand:proven"], scoreDelta: { demand: 10, monetization: 6, leverage: -6 } },
    ],
  },
  {
    id: "q2",
    phaseIndex: 0,
    prompt: "When someone asks what you do, you:",
    options: [
      { id: "q2a", label: "List skills — or change the answer depending on the room", tags: ["pitch:list", "message:weak"], scoreDelta: { clarity: -10, focus: -4 } },
      { id: "q2b", label: "Name one outcome for one buyer type", tags: ["pitch:outcome", "niche:stated"], scoreDelta: { clarity: 10, focus: 8 } },
      { id: "q2c", label: "Deflect until you know if they have budget", tags: ["pitch:soft", "price:hide"], scoreDelta: { monetization: -6, clarity: -4 } },
      { id: "q2d", label: "Dodge — because inbound is thin and it feels awkward", tags: ["inbound:thin", "proof:low"], scoreDelta: { demand: -10, clarity: -6 } },
    ],
  },
  {
    id: "q3",
    phaseIndex: 0,
    prompt: "Your last paying clients came from:",
    options: [
      { id: "q3a", label: "Referrals — people who already knew your name", tags: ["lead:warm", "channel:relational"], scoreDelta: { demand: 6, focus: 4 } },
      { id: "q3b", label: "Cold outbound or cold DMs to strangers", tags: ["lead:cold", "system:fragile"], scoreDelta: { demand: 2, leverage: -8 } },
      { id: "q3c", label: "Inbound: content, search, or a page with a buy button", tags: ["lead:pull", "asset:live"], scoreDelta: { demand: 10, leverage: 8 } },
      { id: "q3d", label: "You are still trying to land the first paid wins", tags: ["traction:early"], scoreDelta: { demand: -4, monetization: -2 } },
    ],
  },
  {
    id: "q4",
    phaseIndex: 0,
    prompt: "The work you want to be known for, in public, is:",
    options: [
      { id: "q4a", label: "Obvious to you — invisible or fuzzy to strangers", tags: ["position:internal"], scoreDelta: { clarity: -8, demand: -4 } },
      { id: "q4b", label: "The same sentence on bio, site, and sales calls", tags: ["position:aligned"], scoreDelta: { clarity: 10, focus: 8 } },
      { id: "q4c", label: "Split across two audiences — you refuse to pick one", tags: ["audience:split", "focus:divided"], scoreDelta: { focus: -12, clarity: -8 } },
      { id: "q4d", label: "You rewrite it every month — nothing gets to stick", tags: ["pivot:often"], scoreDelta: { focus: -10, clarity: -8 } },
    ],
  },
  {
    id: "q5",
    phaseIndex: 0,
    prompt: "If client load doubled tomorrow, what breaks first?",
    options: [
      { id: "q5a", label: "The calendar — every step is still manual", tags: ["ops:manual", "leverage:low"], scoreDelta: { leverage: -12 } },
      { id: "q5b", label: "Quality — you are the throughput limit", tags: ["delivery:you"], scoreDelta: { leverage: -6, focus: 6 } },
      { id: "q5c", label: "Cash — timing, margin, or getting paid on time", tags: ["cash:tight"], scoreDelta: { monetization: -8 } },
      { id: "q5d", label: "Not much — you still have slack and documented systems", tags: ["ops:buffer"], scoreDelta: { leverage: 12, clarity: 4 } },
    ],
  },
  // Phase 2 — Skills + Experience
  {
    id: "q6",
    phaseIndex: 1,
    prompt: "What buyers already pay you for is:",
    options: [
      { id: "q6a", label: "A blur — checks come from unrelated tasks", tags: ["skill:fuzzy"], scoreDelta: { clarity: -10, monetization: -4 } },
      { id: "q6b", label: "One named, repeatable deliverable", tags: ["skill:named"], scoreDelta: { clarity: 8, monetization: 6 } },
      { id: "q6c", label: "Advice or strategy — thin on shipped work", tags: ["skill:advice"], scoreDelta: { monetization: 4, leverage: 6 } },
      { id: "q6d", label: "Hands-on execution — your hours are the product", tags: ["skill:labor"], scoreDelta: { monetization: -4, leverage: -8 } },
    ],
  },
  {
    id: "q7",
    phaseIndex: 1,
    prompt: "Proof you can show a stranger in the next hour:",
    options: [
      { id: "q7a", label: "Logo wall — no numbers on it", tags: ["proof:logo_only"], scoreDelta: { demand: -4, clarity: -4 } },
      { id: "q7b", label: "Before/after numbers with context", tags: ["proof:numbers"], scoreDelta: { demand: 10, clarity: 6 } },
      { id: "q7c", label: "Testimonials — heavy praise, light outcomes", tags: ["proof:soft"], scoreDelta: { demand: 2 } },
      { id: "q7d", label: "Under NDA or messy — you would struggle to share it", tags: ["proof:hidden"], scoreDelta: { demand: -8 } },
    ],
  },
  {
    id: "q8",
    phaseIndex: 1,
    prompt: "Time in the field you sell into:",
    options: [
      { id: "q8a", label: "Under two years in one field", tags: ["tenure:junior"], scoreDelta: { clarity: -2 } },
      { id: "q8b", label: "Two to seven years in one field", tags: ["tenure:mid"], scoreDelta: { demand: 4 } },
      { id: "q8c", label: "Seven-plus years in one field", tags: ["tenure:senior"], scoreDelta: { demand: 6, clarity: 4 } },
      { id: "q8d", label: "You jump industries — no one field owns you", tags: ["tenure:generalist"], scoreDelta: { focus: -8, clarity: -4 } },
    ],
  },
  {
    id: "q9",
    phaseIndex: 1,
    prompt: "The biggest share of your work time goes to:",
    options: [
      { id: "q9a", label: "Teaching or posting — more than billed delivery", tags: ["mode:teach_heavy"], scoreDelta: { monetization: -6, demand: 4 } },
      { id: "q9b", label: "Delivering paid work — more than content", tags: ["mode:delivery"], scoreDelta: { monetization: 8, focus: 6 } },
      { id: "q9c", label: "Selling and admin — more than building", tags: ["mode:sales_ops"], scoreDelta: { leverage: -4, clarity: 4 } },
      { id: "q9d", label: "Split evenly — no lane clearly wins", tags: ["mode:split"], scoreDelta: { focus: -8 } },
    ],
  },
  {
    id: "q10",
    phaseIndex: 1,
    prompt: "Buyers who pay top dollar care about:",
    options: [
      { id: "q10a", label: "Speed and downside protection", tags: ["buyer:risk"], scoreDelta: { monetization: 4, demand: 4 } },
      { id: "q10b", label: "Brand names and credentials on the slide", tags: ["buyer:brand"], scoreDelta: { demand: 2 } },
      { id: "q10c", label: "A number you move — they can track it", tags: ["buyer:metric"], scoreDelta: { demand: 10, clarity: 8 } },
      { id: "q10d", label: "You have not asked — you are guessing", tags: ["buyer:unknown"], scoreDelta: { clarity: -8, demand: -4 } },
    ],
  },
  // Phase 3 — Time Misuse
  {
    id: "q11",
    phaseIndex: 2,
    prompt: "Time on email and Slack each week:",
    options: [
      { id: "q11a", label: "Under five focused hours — templates and boundaries", tags: ["time:comms_light"], scoreDelta: { leverage: 10 } },
      { id: "q11b", label: "Fifteen-plus hours — threads and pings run your day", tags: ["time:comms_heavy"], scoreDelta: { leverage: -12, focus: -6 } },
      { id: "q11c", label: "Spikes around launches — quiet between", tags: ["time:comms_spiky"], scoreDelta: { leverage: -4 } },
      { id: "q11d", label: "No idea — you do not measure it", tags: ["time:comms_blind"], scoreDelta: { leverage: -6, clarity: -4 } },
    ],
  },
  {
    id: "q12",
    phaseIndex: 2,
    prompt: "Live meetings with prospects or clients:",
    options: [
      { id: "q12a", label: "Stacked back-to-back — four or five days a week", tags: ["time:meetings_packed"], scoreDelta: { leverage: -10, monetization: 4 } },
      { id: "q12b", label: "Deep-work blocks defended on the calendar", tags: ["time:deep_blocks"], scoreDelta: { leverage: 8, focus: 6 } },
      { id: "q12c", label: "Rare live calls — async is the default", tags: ["time:async"], scoreDelta: { leverage: 6 } },
      { id: "q12d", label: "Chaotic — meetings move or cancel last minute", tags: ["time:chaos"], scoreDelta: { focus: -8 } },
    ],
  },
  {
    id: "q13",
    phaseIndex: 2,
    prompt: "When the pipeline goes quiet, you reach for:",
    options: [
      { id: "q13a", label: "Another course, video, or tutorial", tags: ["slow:consume"], scoreDelta: { leverage: -8, focus: -6 } },
      { id: "q13b", label: "Outreach to people who already paid you", tags: ["slow:reactivate"], scoreDelta: { demand: 8, monetization: 4 } },
      { id: "q13c", label: "Rewriting the offer, page, or scope on paper", tags: ["slow:reposition"], scoreDelta: { clarity: 8, monetization: 6 } },
      { id: "q13d", label: "Any paid work — including bad fit", tags: ["slow:panic_yes"], scoreDelta: { focus: -10, monetization: -8 } },
    ],
  },
  {
    id: "q14",
    phaseIndex: 2,
    prompt: "Your tooling and subscriptions:",
    options: [
      { id: "q14a", label: "Duplicate apps for the same job", tags: ["stack:overlap"], scoreDelta: { leverage: -8, monetization: -4 } },
      { id: "q14b", label: "One lean stack — one workflow end to end", tags: ["stack:lean"], scoreDelta: { leverage: 8 } },
      { id: "q14c", label: "Paid on every card — you dread the audit", tags: ["stack:bloat"], scoreDelta: { leverage: -6 } },
      { id: "q14d", label: "Free tiers and hacks — no paid core yet", tags: ["stack:free"], scoreDelta: { monetization: -2 } },
    ],
  },
  {
    id: "q15",
    phaseIndex: 2,
    prompt: "Switching between projects in a day:",
    options: [
      { id: "q15a", label: "Nonstop — you never get 90 minutes on one thing", tags: ["focus:fragmented"], scoreDelta: { focus: -12, leverage: -6 } },
      { id: "q15b", label: "Mornings deep — afternoons reactive", tags: ["focus:split_day"], scoreDelta: { focus: 2 } },
      { id: "q15c", label: "Batched — similar work grouped in blocks", tags: ["focus:batched"], scoreDelta: { focus: 10, leverage: 6 } },
      { id: "q15d", label: "You have not clocked it — it all feels like one blur", tags: ["focus:blind"], scoreDelta: { clarity: -6 } },
    ],
  },
  // Phase 4 — Direction
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
      { id: "q17a", label: "On paper — with three measurable weekly moves", tags: ["plan:clear"], scoreDelta: { leverage: 8, clarity: 8 } },
      { id: "q17b", label: "A round figure in your head — no plan attached", tags: ["plan:vague"], scoreDelta: { clarity: -10, leverage: -6 } },
      { id: "q17c", label: "You only plan per project — no 90-day target", tags: ["plan:reactive"], scoreDelta: { demand: -4 } },
      { id: "q17d", label: "Set by a boss, client, or partner — not you", tags: ["plan:external"], scoreDelta: { focus: -4 } },
    ],
  },
  {
    id: "q18",
    phaseIndex: 3,
    prompt: "How you use competitor intel:",
    options: [
      { id: "q18a", label: "Daily tabs — shipping slows down", tags: ["dir:comp_watch"], scoreDelta: { focus: -10, leverage: -6 } },
      { id: "q18b", label: "Named when a buyer brings them up", tags: ["dir:comp_real"], scoreDelta: { demand: 4 } },
      { id: "q18c", label: "Barely tracked — you study buyers instead", tags: ["dir:buyer_focus"], scoreDelta: { focus: 8, demand: 6 } },
      { id: "q18d", label: "You can't name three — no map", tags: ["dir:comp_blind"], scoreDelta: { clarity: -6 } },
    ],
  },
  {
    id: "q19",
    phaseIndex: 3,
    prompt: "One offer line you should kill or merge:",
    options: [
      { id: "q19a", label: "Launched messy — never finished the story", tags: ["offer:launch_weak"], scoreDelta: { clarity: -6 } },
      { id: "q19b", label: "Pulls the wrong buyer", tags: ["offer:mismatch"], scoreDelta: { focus: -6 } },
      { id: "q19c", label: "Underpriced or overbuilt for what it earns", tags: ["offer:price_wrong"], scoreDelta: { monetization: -6 } },
      { id: "q19d", label: "None — you keep stacking new ones", tags: ["offer:stacked"], scoreDelta: { focus: -10, clarity: -8 } },
    ],
  },
  {
    id: "q20",
    phaseIndex: 3,
    prompt: "Your name on the door vs the company name:",
    options: [
      { id: "q20a", label: "Same brand — one story everywhere", tags: ["brand:unified"], scoreDelta: { clarity: 8 } },
      { id: "q20b", label: "Two brands — leads land on the wrong one", tags: ["brand:split"], scoreDelta: { clarity: -10, focus: -6 } },
      { id: "q20c", label: "Your face forward — light company wrapper", tags: ["brand:personal"], scoreDelta: { demand: 4 } },
      { id: "q20d", label: "Company forward — you stay off the page", tags: ["brand:hidden"], scoreDelta: { demand: -4 } },
    ],
  },
  // Phase 5 — Thinking Patterns
  {
    id: "q21",
    phaseIndex: 4,
    prompt: "Narrowing who you serve feels like:",
    options: [
      { id: "q21a", label: "Closing a door on money", tags: ["think:fear_narrow"], scoreDelta: { focus: -8, clarity: -6 } },
      { id: "q21b", label: "Shortening the sales cycle — cleaner work", tags: ["think:embrace_narrow"], scoreDelta: { focus: 10, clarity: 8 } },
      { id: "q21c", label: "Impossible — every label overlaps another", tags: ["think:niche_confused"], scoreDelta: { clarity: -8 } },
      { id: "q21d", label: "A buzzword — you tune it out", tags: ["think:niche_skeptic"], scoreDelta: { focus: -2 } },
    ],
  },
  {
    id: "q22",
    phaseIndex: 4,
    prompt: "Right after you say a price out loud, you feel:",
    options: [
      { id: "q22a", label: "They will leave — you said too much", tags: ["think:price_fear"], scoreDelta: { monetization: -10 } },
      { id: "q22b", label: "Calm — the math works at that number", tags: ["think:price_solid"], scoreDelta: { monetization: 10 } },
      { id: "q22c", label: "Heat — they should not push on this", tags: ["think:price_resent"], scoreDelta: { monetization: -4 } },
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
      { id: "q23c", label: "Months — waiting until it is perfect", tags: ["think:stall"], scoreDelta: { leverage: -10, demand: -4 } },
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
      { id: "q24c", label: "Studying, sorting files, or rearranging tools", tags: ["think:reorg"], scoreDelta: { leverage: -8 } },
      { id: "q24d", label: "Frozen — no clear first move", tags: ["think:stuck"], scoreDelta: { clarity: -10, focus: -8 } },
    ],
  },
  {
    id: "q25",
    phaseIndex: 4,
    prompt: "The reason you tell yourself it is not working yet:",
    options: [
      { id: "q25a", label: "The market is too crowded", tags: ["think:blame_market"], scoreDelta: { demand: -4, clarity: -4 } },
      { id: "q25b", label: "You need one more certificate first", tags: ["think:blame_cred"], scoreDelta: { focus: -6 } },
      { id: "q25c", label: "The offer and the calendar do not match", tags: ["think:own_misalign"], scoreDelta: { clarity: 8, focus: 8 } },
      { id: "q25d", label: "You have not shipped enough real tests", tags: ["think:own_ship"], scoreDelta: { demand: 6, leverage: 6 } },
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
