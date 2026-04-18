import type { ScoreKey } from "../lib/scoreKeys";

export const SECTION_IDS = [
  "wrong",
  "wasting",
  "niche",
  "money",
  "charge",
  "stop",
  "focus",
  "first",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type RuleMatch = {
  allTags?: string[];
  anyTags?: string[];
  minTagHits?: { tags: string[]; count: number };
  minScore?: Partial<Record<ScoreKey, number>>;
  maxScore?: Partial<Record<ScoreKey, number>>;
};

export type ResultRule = {
  id: string;
  priority: number;
  match: RuleMatch;
  lines: string[];
};

export type SectionRules = {
  title: string;
  defaults: string[];
  rules: ResultRule[];
};

export const resultRules: Record<SectionId, SectionRules> = {
  wrong: {
    title: "What you're doing wrong",
    defaults: [
      "The story keeps changing before the same room hears it twice.",
      "You're running two lanes at once.",
      "Neither one finishes.",
    ],
    rules: [
      {
        id: "wr-split-pitch-list",
        priority: 96,
        match: { allTags: ["work:split", "pitch:list"] },
        lines: [
          "Clients split across the week — the pitch is still a skill list.",
          "Nobody sees a lane or a checkout.",
          "Same pattern: busy calendar, thin receipt.",
        ],
      },
      {
        id: "wr-audience-split-pitch-soft",
        priority: 95,
        match: { allTags: ["audience:split", "pitch:soft"] },
        lines: [
          "Two audiences. Price stays off the table.",
          "Deals stretch — nobody knows what they’re buying.",
          "I’ve watched this stall the same way: two pages, one nervous calendar.",
        ],
      },
      {
        id: "wr-audience-split",
        priority: 92,
        match: { allTags: ["audience:split"] },
        lines: [
          "Two directions at once.",
          "Neither lane lands.",
          "Same fork: split attention, split proof.",
        ],
      },
      {
        id: "wr-pitch-list",
        priority: 90,
        match: { allTags: ["pitch:list"] },
        lines: [
          "The answer is still a list of skills.",
          "No named outcome to buy.",
          "The intro dies in the first sentence — every time.",
        ],
      },
      {
        id: "wr-work-split",
        priority: 88,
        match: { allTags: ["work:split"] },
        lines: [
          "Client-hopping with nothing in writing.",
          "Scope leaks in the thread.",
          "The boundary never shows up — only the ping.",
        ],
      },
      {
        id: "wr-offer-stacked",
        priority: 86,
        match: { allTags: ["offer:stacked"] },
        lines: [
          "New lines ship before old ones die.",
          "Three offers, one calendar.",
          "Same clutter: more SKUs, same hours.",
        ],
      },
      {
        id: "wr-brand-split",
        priority: 84,
        match: { allTags: ["brand:split"] },
        lines: [
          "Two names. Two doors.",
          "Search and intros land on the wrong one.",
          "Money already picked a door — the traffic didn’t.",
        ],
      },
      {
        id: "wr-ship-delayed",
        priority: 80,
        match: { allTags: ["ship:delayed"] },
        lines: [
          "Building where nobody pays yet.",
          "Buyers only show up for dated outcomes.",
          "The ship date stays private — so the check does too.",
        ],
      },
      {
        id: "wr-message-churn",
        priority: 48,
        match: { maxScore: { clarity: 40 } },
        lines: [
          "The story edits itself before anyone hears the same line twice.",
          "Trust never sticks.",
          "Same churn: new words, same thin pipeline.",
        ],
      },
    ],
  },
  wasting: {
    title: "What's wasting your time",
    defaults: [
      "The same explanation retyped in three threads.",
      "**You are the throughput limit.**",
      "The week disappears — the asset doesn’t move.",
    ],
    rules: [
      {
        id: "wa-delivery-you",
        priority: 93,
        match: { allTags: ["delivery:you"] },
        lines: [
          "Every pass-through still hits your hands.",
          "**You are the throughput limit.**",
          "Delivery looks busy — leverage never compounds.",
        ],
      },
      {
        id: "wa-comms-stack",
        priority: 96,
        match: { allTags: ["time:comms_heavy", "stack:overlap"] },
        lines: [
          "Threads and duplicate apps own the morning.",
          "Noise eats the slot where build was supposed to be.",
          "Same stack: two tools, one job, zero truth.",
        ],
      },
      {
        id: "wa-comms-heavy",
        priority: 92,
        match: { allTags: ["time:comms_heavy"] },
        lines: [
          "Replies to people who already paid for a result.",
          "Access ate the delivery window.",
          "The inbox runs the day — the work waits.",
        ],
      },
      {
        id: "wa-meetings-packed",
        priority: 90,
        match: { allTags: ["time:meetings_packed"] },
        lines: [
          "Back-to-back — no block left to build.",
          "The calendar is the product now.",
          "I’ve seen this exact wall: zero contiguous hours.",
        ],
      },
      {
        id: "wa-stack-overlap",
        priority: 88,
        match: { allTags: ["stack:overlap"] },
        lines: [
          "Two subscriptions. Same job.",
          "Two truths in two dashboards.",
          "Money leaks in duplicate — attention leaks with it.",
        ],
      },
      {
        id: "wa-focus-fragmented",
        priority: 86,
        match: { allTags: ["focus:fragmented"] },
        lines: [
          "Ninety minutes never shows up intact.",
          "Context-switch is the real bill.",
          "Fragments look like hustle — they read as delay.",
        ],
      },
      {
        id: "wa-lead-cold-inbound-thin",
        priority: 84,
        match: { allTags: ["lead:cold", "inbound:thin"] },
        lines: [
          "Cold volume while warm sits quiet.",
          "Effort scatters — nothing compounds.",
          "Same pattern: loud outreach, empty relationship row.",
        ],
      },
      {
        id: "wa-lead-cold",
        priority: 82,
        match: { allTags: ["lead:cold"] },
        lines: [
          "Cold without a tight list or one clean line.",
          "Volume masks bad fit.",
          "The spreadsheet looks full — the bank doesn’t.",
        ],
      },
      {
        id: "wa-comp-watch",
        priority: 78,
        match: { allTags: ["dir:comp_watch"] },
        lines: [
          "Competitors get daily tabs.",
          "Ship dates slip.",
          "Same loop: scroll, compare, stall.",
        ],
      },
      {
        id: "wa-systems-low",
        priority: 45,
        match: { maxScore: { leverage: 38 } },
        lines: [
          "Onboarding still live in your head every time.",
          "Leverage can’t compound — you’re the system.",
          "Repeat work never becomes an asset — just more you.",
        ],
      },
    ],
  },
  niche: {
    title: "Who pays you",
    defaults: [
      "Small teams already buying this shape of help.",
      "They needed it last quarter — not after another deck.",
      "The receipt already named them — the sentence didn’t.",
    ],
    rules: [
      {
        id: "ni-sharp-metric",
        priority: 96,
        match: { allTags: ["niche:sharp", "niche:metric"] },
        lines: [
          "Budget owner + one number you move inside a month.",
          "That’s who signs when the outcome isn’t abstract.",
          "Same clarity every time I’ve seen this land: number first.",
        ],
      },
      {
        id: "ni-sharp",
        priority: 95,
        match: { anyTags: ["niche:sharp", "niche:metric"] },
        lines: [
          "People who already cut checks in this category.",
          "Cold traffic isn’t your leak — fit is.",
          "The buyer who paid last time is still the signal.",
        ],
      },
      {
        id: "ni-warm-proof",
        priority: 90,
        match: { allTags: ["lead:warm", "proof:numbers"] },
        lines: [
          "One referral away — proof still buried.",
          "Warm stalls when math stays off the page.",
          "Same stall: trust in the thread, doubt on the site.",
        ],
      },
      {
        id: "ni-outcome-pitch",
        priority: 86,
        match: { allTags: ["pitch:outcome"] },
        lines: [
          "They’ll pay for the outcome you name — when the buy is visible.",
          "Calls stay mushy — the price never arrives.",
          "The pattern: strong outcome language, weak close.",
        ],
      },
      {
        id: "ni-delivery",
        priority: 82,
        match: { allTags: ["work:delivery"] },
        lines: [
          "They’re buying the slot — not another slide.",
          "Backlog is the product — the deck isn’t.",
          "Start date talks — everything else is noise.",
        ],
      },
      {
        id: "ni-wide",
        priority: 70,
        match: { allTags: ["niche:wide"] },
        lines: [
          "Industry label on the page — nobody self-selects.",
          "Pain reads cheap — nobody moves.",
          "Same wide net: traffic, thin yes.",
        ],
      },
      {
        id: "ni-draft",
        priority: 65,
        match: { allTags: ["niche:draft"] },
        lines: [
          "Who paid you in ninety days is already the draft.",
          "The cluster is visible — the sentence isn’t.",
          "Receipts say one thing — the bio says another.",
        ],
      },
      {
        id: "ni-scattered-focus",
        priority: 50,
        match: { maxScore: { focus: 42 } },
        lines: [
          "Fastest close — fewest questions — same buyer.",
          "That’s the signal — not the funnel.",
          "Proof keeps scattering before it stacks.",
        ],
      },
    ],
  },
  money: {
    title: "Where money is",
    defaults: [
      "Past buyers asking for a smaller paid step before the big one.",
      "Strangers get the outreach — receipts get silence.",
      "The last invoice already showed who pays.",
    ],
    rules: [
      {
        id: "mo-pull-delivery",
        priority: 94,
        match: { allTags: ["lead:pull", "work:delivery"] },
        lines: [
          "Inbound hits — the queue is full.",
          "Revenue caps when nobody can buy a slot.",
          "Same choke: demand without a dated slot.",
        ],
      },
      {
        id: "mo-pull",
        priority: 92,
        match: { allTags: ["lead:pull"] },
        lines: [
          "Traffic clumps on one topic.",
          "**You split attention before you double what works.**",
          "The pattern: new topic before the old one pays twice.",
        ],
      },
      {
        id: "mo-warm",
        priority: 90,
        match: { allTags: ["lead:warm"] },
        lines: [
          "Warm intros — receipts in past work.",
          "The second yes is quieter than the first.",
          "Same miss: relationship row full, invoice row thin.",
        ],
      },
      {
        id: "mo-delivery",
        priority: 88,
        match: { allTags: ["work:delivery"] },
        lines: [
          "Backlog and start dates are what they buy.",
          "Meetings sell — throughput doesn’t.",
          "The slot is the product — the deck isn’t.",
        ],
      },
      {
        id: "mo-metric-buyer",
        priority: 86,
        match: { allTags: ["buyer:metric"] },
        lines: [
          "They track the number you move — or they don’t buy.",
          "Generic pitches bounce off that wall.",
          "Fee without delta is a conversation — not a check.",
        ],
      },
      {
        id: "mo-early",
        priority: 72,
        match: { allTags: ["traction:early"] },
        lines: [
          "Small shops with one expensive manual step you remove.",
          "Early money — speed wins.",
          "Same early-stage shape: one case, one price, one week.",
        ],
      },
      {
        id: "mo-cold",
        priority: 68,
        match: { allTags: ["lead:cold"] },
        lines: [
          "Cold only works when the list is tight.",
          "Activity reads like progress — the account doesn’t.",
          "Volume hides the wrong names.",
        ],
      },
    ],
  },
  charge: {
    title: "What to charge",
    defaults: [
      "Hours quoted — nobody does the math but you.",
      "The ask stays soft — money stays hypothetical.",
      "Same table: vague total, quiet invoice.",
    ],
    rules: [
      {
        id: "ch-price-solid-named",
        priority: 92,
        match: { allTags: ["think:price_solid", "skill:named"] },
        lines: [
          "You know the number — the call still ends without it.",
          "Checks stall when price is last.",
          "I’ve seen this exact stall: solid work, soft close.",
        ],
      },
      {
        id: "ch-price-solid",
        priority: 90,
        match: { allTags: ["think:price_solid"] },
        lines: [
          "Floor is clear — DMs carve exceptions.",
          "The rule breaks in private first.",
          "Same pattern: public floor, private discount.",
        ],
      },
      {
        id: "ch-skill-named",
        priority: 88,
        match: { allTags: ["skill:named"] },
        lines: [
          "Expertise sold — retainer left open.",
          "They get “let me think” — nothing is easy to buy.",
          "Named deliverable — unnamed receipt.",
        ],
      },
      {
        id: "ch-skill-labor",
        priority: 84,
        match: { allTags: ["skill:labor"] },
        lines: [
          "Hourly is how the work gets mined.",
          "Every week negotiates itself again.",
          "Same leak: open clock, closed margin.",
        ],
      },
      {
        id: "ch-price-fear-soft",
        priority: 82,
        match: { allTags: ["think:price_fear", "pitch:soft"] },
        lines: [
          "Price cuts before scope does.",
          "They learned to push — you taught them how.",
          "Same dance: smaller number, same scope.",
        ],
      },
      {
        id: "ch-advice",
        priority: 78,
        match: { allTags: ["skill:advice"] },
        lines: [
          "Advice without edges becomes a leash.",
          "Access ate leverage.",
          "The calendar fills — the line item doesn’t.",
        ],
      },
      {
        id: "ch-revenue-tight",
        priority: 48,
        match: { maxScore: { monetization: 40 } },
        lines: [
          "Cash tight — the ask shrinks, the scope doesn’t.",
          "Small checks feel safe — the math stays broken.",
          "Same squeeze: thin revenue, full brief.",
        ],
      },
    ],
  },
  stop: {
    title: "What to stop",
    defaults: [
      "Calls with no band — no scope in writing.",
      "New channel opens before one channel pays.",
      "Same habit: more surface area, same deposit row.",
    ],
    rules: [
      {
        id: "st-panic-yes",
        priority: 92,
        match: { allTags: ["slow:panic_yes"] },
        lines: [
          "Pipeline dips — yes lands on bad fit.",
          "Panic picks the terms.",
          "Same signature: urgency, soft boundary.",
        ],
      },
      {
        id: "st-offer-stacked",
        priority: 90,
        match: { allTags: ["offer:stacked"] },
        lines: [
          "New line ships before the old one dies.",
          "Three offers — one calendar.",
          "Same clutter: more doors, one tired buyer.",
        ],
      },
      {
        id: "st-consume",
        priority: 88,
        match: { allTags: ["slow:consume"] },
        lines: [
          "Invoices thin — another curriculum opens.",
          "Consumption ate the execution window.",
          "Same swap: learning for earning.",
        ],
      },
      {
        id: "st-blame",
        priority: 84,
        match: { anyTags: ["think:blame_market", "think:blame_cred"] },
        lines: [
          "Market’s crowded — or the credential’s next.",
          "Blame ships quieter than a test.",
          "Same stall: story about forces, thin artifact.",
        ],
      },
      {
        id: "st-comp-watch",
        priority: 82,
        match: { allTags: ["dir:comp_watch"] },
        lines: [
          "Competitors get daily attention.",
          "Ship dates slip.",
          "Comparison eats the afternoon — again.",
        ],
      },
      {
        id: "st-price-avoid",
        priority: 78,
        match: { allTags: ["think:price_avoid"] },
        lines: [
          "Proposals leave late — or not at all.",
          "Deals die in the quiet.",
          "Same ending: strong meeting, missing number.",
        ],
      },
    ],
  },
  focus: {
    title: "What to focus on",
    defaults: [
      "One offer — one page.",
      "New starts instead of depth in one lane.",
      "Same drift: another channel, same thin proof.",
    ],
    rules: [
      {
        id: "fo-buyer-metric",
        priority: 90,
        match: { allTags: ["buyer:metric"] },
        lines: [
          "They think in the number you move.",
          "Proposals bounce — the metric never made the header.",
          "Same miss: strong body, buried math.",
        ],
      },
      {
        id: "fo-plan-vague",
        priority: 88,
        match: { allTags: ["plan:vague"] },
        lines: [
          "Tasks without a revenue shape.",
          "Quarters leave — nothing tied to a count.",
          "Same fog: busy calendar, fuzzy target.",
        ],
      },
      {
        id: "fo-embarrass-narrow",
        priority: 86,
        match: { allTags: ["think:embrace_narrow"] },
        lines: [
          "One lane already closes.",
          "The wrong work never starves.",
          "Narrow wins — breadth hides that.",
        ],
      },
      {
        id: "fo-fear-narrow",
        priority: 84,
        match: { allTags: ["think:fear_narrow"] },
        lines: [
          "Smallest list — the one that already paid.",
          "Breadth covers weak proof.",
          "Same fear: visible range, thin case.",
        ],
      },
      {
        id: "fo-reactivate",
        priority: 82,
        match: { allTags: ["slow:reactivate"] },
        lines: [
          "Past buyers sit in the asset column.",
          "Revenue swings — trust sits quiet.",
          "Same gap: relationship row full, reactivation row empty.",
        ],
      },
      {
        id: "fo-scattered",
        priority: 48,
        match: { maxScore: { focus: 42 } },
        lines: [
          "Channels multiply before one page converts.",
          "**You split attention before you double what works.**",
          "Same pattern: new surface, old conversion.",
        ],
      },
    ],
  },
  first: {
    title: "What to do first",
    defaults: [
      "The next move is already obvious — it’s waiting for a date.",
      "Nothing moves without an artifact with a date on it.",
      "Same gap: clear head, empty calendar row.",
    ],
    rules: [
      {
        id: "fi-stuck-split",
        priority: 94,
        match: { allTags: ["think:stuck", "work:split"] },
        lines: [
          "Split across clients — stuck in the middle.",
          "The last invoice already named who pays.",
          "Same stuck shape: many threads, one nervous close.",
        ],
      },
      {
        id: "fi-stuck",
        priority: 90,
        match: { allTags: ["think:stuck"] },
        lines: [
          "Waiting for clarity — the last payer already had it.",
          "Motion reads busy — the ship date doesn’t.",
          "Same loop: research tabs, thin send.",
        ],
      },
      {
        id: "fi-plan-vague",
        priority: 88,
        match: { allTags: ["plan:vague"] },
        lines: [
          "Goals without a ship cadence.",
          "The plan dissolves — the calendar stays empty.",
          "Same fog: round number in the head, zero dated blocks.",
        ],
      },
      {
        id: "fi-ship-asset",
        priority: 86,
        match: { allTags: ["think:ship_asset"] },
        lines: [
          "The asset is mostly done — buyers never see the buy.",
          "Checkout stays hypothetical.",
          "Same stall: almost shipped, never priced.",
        ],
      },
      {
        id: "fi-niche-draft",
        priority: 84,
        match: { allTags: ["niche:draft"] },
        lines: [
          "Who paid — not an abstract niche.",
          "Messaging stays mushy — receipts stay ignored.",
          "Same miss: payers in the data, strangers in the copy.",
        ],
      },
      {
        id: "fi-inbound-thin",
        priority: 80,
        match: { allTags: ["inbound:thin"] },
        lines: [
          "Inbound thin — waiting became the strategy.",
          "Outreach never became a number.",
          "Same quiet: empty pipe, busy prep.",
        ],
      },
    ],
  },
};
