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
      "Meetings pile up before one offer is locked.",
      "Three answers to ‘what do you do’ in one week.",
      "One package, one page, one price band — live the page.",
    ],
    rules: [
      {
        id: "wr-split-pitch-list",
        priority: 96,
        match: { allTags: ["work:split", "pitch:list"] },
        lines: [
          "You split clients and still pitch a skill list.",
          "Buyers see no lane and no checkout.",
          "One buyer sentence + one boundary. Say no once this week.",
        ],
      },
      {
        id: "wr-audience-split-pitch-soft",
        priority: 95,
        match: { allTags: ["audience:split", "pitch:soft"] },
        lines: [
          "Two audiences, price hidden.",
          "Deals drag — nobody knows what they’re buying.",
          "One price band, one audience. Park the other page.",
        ],
      },
      {
        id: "wr-audience-split",
        priority: 92,
        match: { allTags: ["audience:split"] },
        lines: [
          "Two directions at once.",
          "Neither lane lands.",
          "Split pages or park one lane 60 days.",
        ],
      },
      {
        id: "wr-pitch-list",
        priority: 90,
        match: { allTags: ["pitch:list"] },
        lines: [
          "You answer with skills.",
          "No named outcome to buy.",
          "Finish: ‘I fix ___ for ___ by ___’ — use it in bios two weeks.",
        ],
      },
      {
        id: "wr-work-split",
        priority: 88,
        match: { allTags: ["work:split"] },
        lines: [
          "You hop clients with no written boundary.",
          "Scope leaks every day.",
          "Put scope in writing. Bill anything outside.",
        ],
      },
      {
        id: "wr-offer-stacked",
        priority: 86,
        match: { allTags: ["offer:stacked"] },
        lines: [
          "New lines stack before old ones die.",
          "Three offers fight for one calendar.",
          "Retire one URL or SKU. Redirect to the live offer.",
        ],
      },
      {
        id: "wr-brand-split",
        priority: 84,
        match: { allTags: ["brand:split"] },
        lines: [
          "Two names split search and intros.",
          "Nobody knows which door is real.",
          "Pick the name money flows through. Forward the rest.",
        ],
      },
      {
        id: "wr-ship-delayed",
        priority: 80,
        match: { allTags: ["ship:delayed"] },
        lines: [
          "You practice in private.",
          "Buyers pay dated outcomes.",
          "Set a ship date someone could pay for — tiny scope.",
        ],
      },
      {
        id: "wr-message-churn",
        priority: 48,
        match: { maxScore: { clarity: 40 } },
        lines: [
          "You rewrite before the same people hear the same version twice.",
          "Nobody trusts one claim.",
          "Freeze the story 14 days. Examples only.",
        ],
      },
    ],
  },
  wasting: {
    title: "What's wasting your time",
    defaults: [
      "You retype the same explanations in email and DMs.",
      "Weeks vanish — **you are the throughput limit.**",
      "Record once. Send before the next thread. Batch replies to two windows.",
    ],
    rules: [
      {
        id: "wa-delivery-you",
        priority: 93,
        match: { allTags: ["delivery:you"] },
        lines: [
          "Every pass-through still hits your hands.",
          "**You are the throughput limit.**",
          "Record once. Delegate the next repeat or raise volume price.",
        ],
      },
      {
        id: "wa-comms-stack",
        priority: 96,
        match: { allTags: ["time:comms_heavy", "stack:overlap"] },
        lines: [
          "Threads and duplicate apps eat the day.",
          "Noise replaces delivery.",
          "Kill one duplicate tool. Batch replies twice daily.",
        ],
      },
      {
        id: "wa-comms-heavy",
        priority: 92,
        match: { allTags: ["time:comms_heavy"] },
        lines: [
          "You answer buyers who already paid for a result.",
          "Access replaced delivery.",
          "One weekly status note. Put the rest behind office hours.",
        ],
      },
      {
        id: "wa-meetings-packed",
        priority: 90,
        match: { allTags: ["time:meetings_packed"] },
        lines: [
          "Back-to-back calls leave no build time.",
          "The calendar eats the work.",
          "Block two half-days, zero calls. Guard them.",
        ],
      },
      {
        id: "wa-stack-overlap",
        priority: 88,
        match: { allTags: ["stack:overlap"] },
        lines: [
          "You pay twice for overlapping tools.",
          "You maintain two truths.",
          "One system of record. Delete the extra login.",
        ],
      },
      {
        id: "wa-focus-fragmented",
        priority: 86,
        match: { allTags: ["focus:fragmented"] },
        lines: [
          "You never get 90 minutes straight.",
          "Context-switching is the tax.",
          "Batch one work type each morning. Pings off until lunch.",
        ],
      },
      {
        id: "wa-lead-cold-inbound-thin",
        priority: 84,
        match: { allTags: ["lead:cold", "inbound:thin"] },
        lines: [
          "Cold volume while warm pipe is empty.",
          "Effort feels random.",
          "Twenty messages to people who know you beat two hundred cold.",
        ],
      },
      {
        id: "wa-lead-cold",
        priority: 82,
        match: { allTags: ["lead:cold"] },
        lines: [
          "Cold work without a tight list or one offer line.",
          "Volume hides bad fit.",
          "30 accounts. One case, one ask, one link.",
        ],
      },
      {
        id: "wa-comp-watch",
        priority: 78,
        match: { allTags: ["dir:comp_watch"] },
        lines: [
          "You scroll competitors daily.",
          "Shipping drops.",
          "15 minutes on competitors weekly. Rest on five buyer calls.",
        ],
      },
      {
        id: "wa-systems-low",
        priority: 45,
        match: { maxScore: { leverage: 38 } },
        lines: [
          "The same onboarding live every time.",
          "Leverage never compounds — you are the system.",
          "Record once. Checklist the third repeat fix.",
        ],
      },
    ],
  },
  niche: {
    title: "Your actual niche",
    defaults: [
      "Small teams already buying this kind of help.",
      "They need it this month — not explained forever.",
      "Name them in one sentence. Top of the next page.",
    ],
    rules: [
      {
        id: "ni-sharp-metric",
        priority: 96,
        match: { allTags: ["niche:sharp", "niche:metric"] },
        lines: [
          "Buyers who own budget and one number you move in 30 days.",
          "That is who writes the check when the outcome is concrete.",
          "Lead with the number. One sentence everywhere.",
        ],
      },
      {
        id: "ni-sharp",
        priority: 95,
        match: { anyTags: ["niche:sharp", "niche:metric"] },
        lines: [
          "People who already pay for this category.",
          "Cold traffic wastes you — you are built for buyers who already buy.",
          "Name the outcome they pay for. Cut the rest.",
        ],
      },
      {
        id: "ni-warm-proof",
        priority: 90,
        match: { allTags: ["lead:warm", "proof:numbers"] },
        lines: [
          "Teams one referral away.",
          "Proof is buried — warm leads stall.",
          "One numbered before/after on the next page.",
        ],
      },
      {
        id: "ni-outcome-pitch",
        priority: 86,
        match: { allTags: ["pitch:outcome"] },
        lines: [
          "Buyers who pay for the outcome you name.",
          "Calls feel mushy — the buy is missing.",
          "Open with price band or deposit. Same every time.",
        ],
      },
      {
        id: "ni-delivery",
        priority: 82,
        match: { allTags: ["work:delivery"] },
        lines: [
          "Buyers need backlog cleared.",
          "They pay for the slot, not the slide.",
          "Next start date on the page. Nothing else above the fold.",
        ],
      },
      {
        id: "ni-wide",
        priority: 70,
        match: { allTags: ["niche:wide"] },
        lines: [
          "An industry label is not a niche.",
          "Nobody self-selects — pain isn’t expensive enough on the page.",
          "One expensive problem + who signs. Delete the rest this week.",
        ],
      },
      {
        id: "ni-draft",
        priority: 65,
        match: { allTags: ["niche:draft"] },
        lines: [
          "People who paid you in 90 days.",
          "That cluster is your draft niche.",
          "One sentence: bio, footer, proposal header.",
        ],
      },
      {
        id: "ni-scattered-focus",
        priority: 50,
        match: { maxScore: { focus: 42 } },
        lines: [
          "The buyer you served fastest with fewest questions.",
          "That is the signal.",
          "Build the sentence around them. Cut the rest 30 days.",
        ],
      },
    ],
  },
  money: {
    title: "Where money is",
    defaults: [
      "Past buyers asking for a smaller paid step before a big one.",
      "You keep hunting strangers instead.",
      "Five past-buyer messages: one offer, one price band, one start week.",
    ],
    rules: [
      {
        id: "mo-pull-delivery",
        priority: 94,
        match: { allTags: ["lead:pull", "work:delivery"] },
        lines: [
          "Inbound is hitting and the queue is full.",
          "Revenue caps when nobody can buy a slot.",
          "Start date + deposit on the page. Rerun same topic with price.",
        ],
      },
      {
        id: "mo-pull",
        priority: 92,
        match: { allTags: ["lead:pull"] },
        lines: [
          "Traffic is on one topic.",
          "**You split attention before you double what works.**",
          "Double that topic before a new one. Fees next to proof on the same URL.",
        ],
      },
      {
        id: "mo-warm",
        priority: 90,
        match: { allTags: ["lead:warm"] },
        lines: [
          "Warm intros — receipts in past work.",
          "You skip people who already said yes once.",
          "Three past clients: fixed fee, start week, one link.",
        ],
      },
      {
        id: "mo-delivery",
        priority: 88,
        match: { allTags: ["work:delivery"] },
        lines: [
          "Backlog and start dates are the product.",
          "You sell meetings instead of throughput.",
          "Sell the next slot. Rush fee on the page.",
        ],
      },
      {
        id: "mo-metric-buyer",
        priority: 86,
        match: { allTags: ["buyer:metric"] },
        lines: [
          "Buyers who track a number you move.",
          "Generic pitches bounce.",
          "Tie your fee to that delta in writing.",
        ],
      },
      {
        id: "mo-early",
        priority: 72,
        match: { allTags: ["traction:early"] },
        lines: [
          "Small shops with one expensive manual step you remove.",
          "Early-stage money: speed beats polish.",
          "Same-day quote + start. Fixed price. One case on the page.",
        ],
      },
      {
        id: "mo-cold",
        priority: 68,
        match: { allTags: ["lead:cold"] },
        lines: [
          "Cold works when the list is tight.",
          "Effort looks busy — bank doesn’t move.",
          "30 accounts max. One case, one ask, one link.",
        ],
      },
    ],
  },
  charge: {
    title: "What to charge",
    defaults: [
      "You quote hours and hope they math into a living.",
      "The ask stays fuzzy — money stays on the table.",
      "$800–$2k sprint, named deliverable, stop date. Milestones + revision caps on big builds.",
    ],
    rules: [
      {
        id: "ch-price-solid-named",
        priority: 92,
        match: { allTags: ["think:price_solid", "skill:named"] },
        lines: [
          "You know your number — you still wait for them to drag it out.",
          "Checks stall — price is last.",
          "$1.5k–$4k fixed, two weeks, one revision — say it before you end.",
        ],
      },
      {
        id: "ch-price-solid",
        priority: 90,
        match: { allTags: ["think:price_solid"] },
        lines: [
          "Floor is clear — exceptions sneak in on DMs.",
          "You break your own rule in private.",
          "$1.5k–$5k fixed two-week outcome. Stop under the new floor.",
        ],
      },
      {
        id: "ch-skill-named",
        priority: 88,
        match: { allTags: ["skill:named"] },
        lines: [
          "You sell expertise — not another open retainer.",
          "They get ‘let me think’ — nothing is easy to buy.",
          "$1k–$2.5k packaged review + two options on paper.",
        ],
      },
      {
        id: "ch-skill-labor",
        priority: 84,
        match: { allTags: ["skill:labor"] },
        lines: [
          "Hourly is how you get mined.",
          "Every week renegotiates itself.",
          "$75–$150/hr with weekly caps — or weekly bucket $2k–$4k.",
        ],
      },
      {
        id: "ch-price-fear-soft",
        priority: 82,
        match: { allTags: ["think:price_fear", "pitch:soft"] },
        lines: [
          "You cut price before you cut scope.",
          "You trained negotiators.",
          "Same work, smaller paid step: $500–$1.5k micro-engagements.",
        ],
      },
      {
        id: "ch-advice",
        priority: 78,
        match: { allTags: ["skill:advice"] },
        lines: [
          "Advice without boundaries becomes a leash.",
          "Access replaced leverage.",
          "$2k–$8k fixed calls + async windows. Dates + agendas.",
        ],
      },
      {
        id: "ch-revenue-tight",
        priority: 48,
        match: { maxScore: { monetization: 40 } },
        lines: [
          "Cash is tight — you shrink the ask, not the scope.",
          "Small checks feel safe — they don’t fix the math.",
          "$300–$800 review, half credit toward build.",
        ],
      },
    ],
  },
  stop: {
    title: "What to stop",
    defaults: [
      "Calls with no price band and no written scope.",
      "You open new channels before one channel pays.",
      "No band on the invite. One channel until deposits land.",
    ],
    rules: [
      {
        id: "st-panic-yes",
        priority: 92,
        match: { allTags: ["slow:panic_yes"] },
        lines: [
          "Pipeline dips — you say yes to bad fit.",
          "Panic writes your terms.",
          "One sentence: what you don’t do. Send before the next yes.",
        ],
      },
      {
        id: "st-offer-stacked",
        priority: 90,
        match: { allTags: ["offer:stacked"] },
        lines: [
          "New lines ship before an old one dies.",
          "Three offers fight for one calendar.",
          "Retire one URL or SKU. Redirect to the live offer.",
        ],
      },
      {
        id: "st-consume",
        priority: 88,
        match: { allTags: ["slow:consume"] },
        lines: [
          "Invoices thin — you buy another course.",
          "Consumption ate execution.",
          "Swap one module for one invoice this week.",
        ],
      },
      {
        id: "st-blame",
        priority: 84,
        match: { anyTags: ["think:blame_market", "think:blame_cred"] },
        lines: [
          "You blame the market — or the next certificate.",
          "Blame beats a dated ship.",
          "One paid test. Name the buyer. Price it.",
        ],
      },
      {
        id: "st-comp-watch",
        priority: 82,
        match: { allTags: ["dir:comp_watch"] },
        lines: [
          "You scroll competitors daily.",
          "Shipping drops.",
          "15 minutes on competitors weekly. Five buyer conversations with the rest.",
        ],
      },
      {
        id: "st-price-avoid",
        priority: 78,
        match: { allTags: ["think:price_avoid"] },
        lines: [
          "Proposals go out late — or never.",
          "Deals die in silence.",
          "Same-day proposal — or paid scoping with a deadline.",
        ],
      },
    ],
  },
  focus: {
    title: "What to focus on",
    defaults: [
      "One offer on one page.",
      "You keep starting over instead of deepening one lane.",
      "Past buyers + warm intros before new cold. Block build time.",
    ],
    rules: [
      {
        id: "fo-buyer-metric",
        priority: 90,
        match: { allTags: ["buyer:metric"] },
        lines: [
          "Buyers think in the number you move.",
          "Proposals bounce — the metric is buried.",
          "Number in headline + every proposal header. One case slide with math.",
        ],
      },
      {
        id: "fo-plan-vague",
        priority: 88,
        match: { allTags: ["plan:vague"] },
        lines: [
          "You have a task list — not a revenue plan.",
          "Quarters disappear — nothing tied to a count.",
          "One 90-day target ÷ weeks = ships per week. Three ship weeks on the calendar.",
        ],
      },
      {
        id: "fo-embarrass-narrow",
        priority: 86,
        match: { allTags: ["think:embrace_narrow"] },
        lines: [
          "One lane already closes.",
          "You never starve the wrong work.",
          "Say no to everything else 30 days. Publish the cut.",
        ],
      },
      {
        id: "fo-fear-narrow",
        priority: 84,
        match: { allTags: ["think:fear_narrow"] },
        lines: [
          "The smallest list is the one that already paid.",
          "Breadth hides weak proof.",
          "One case study that matches that list. Nothing broader until it runs.",
        ],
      },
      {
        id: "fo-reactivate",
        priority: 82,
        match: { allTags: ["slow:reactivate"] },
        lines: [
          "Past buyers are the asset.",
          "Revenue spikes and crashes — you ignore trust.",
          "One email, one offer, one start date. Referrals after a written win.",
        ],
      },
      {
        id: "fo-scattered",
        priority: 48,
        match: { maxScore: { focus: 42 } },
        lines: [
          "You add channels before one page converts.",
          "**You split attention before you double what works.**",
          "One sellable page before a channel. Two half-days weekly, zero calls.",
        ],
      },
    ],
  },
  first: {
    title: "What to do first",
    defaults: [
      "You already know the next move.",
      "Nothing ships without a dated artifact.",
      "One page: who for, what they get, price band, next start date.",
    ],
    rules: [
      {
        id: "fi-stuck-split",
        priority: 94,
        match: { allTags: ["think:stuck", "work:split"] },
        lines: [
          "Split across clients — and stuck.",
          "The last invoice already named who pays.",
          "Copy their words into a one-page offer. Three calls only that type.",
        ],
      },
      {
        id: "fi-stuck",
        priority: 90,
        match: { allTags: ["think:stuck"] },
        lines: [
          "Waiting for clarity — clarity is in the last person who paid.",
          "Motion feels productive — you spin.",
          "One page from last buyer’s words. Ship a mini-asset in 48 hours.",
        ],
      },
      {
        id: "fi-plan-vague",
        priority: 88,
        match: { allTags: ["plan:vague"] },
        lines: [
          "Goals — not a ship cadence.",
          "The plan dissolves — nothing is on the calendar.",
          "90-day number ÷ 12 = weekly ships. Block three ship weeks now.",
        ],
      },
      {
        id: "fi-ship-asset",
        priority: 86,
        match: { allTags: ["think:ship_asset"] },
        lines: [
          "The asset is 80% done.",
          "Buyers never see a checkout.",
          "Finish: headline, price, buy — no new sections. Email with a deadline.",
        ],
      },
      {
        id: "fi-niche-draft",
        priority: 84,
        match: { allTags: ["niche:draft"] },
        lines: [
          "Who paid — not an abstract niche.",
          "Messaging stays mushy — you skip the receipts.",
          "Ten payers → three traits → one sentence in bio + footer.",
        ],
      },
      {
        id: "fi-inbound-thin",
        priority: 80,
        match: { allTags: ["inbound:thin"] },
        lines: [
          "Inbound is thin — so you wait.",
          "Outreach never became a number.",
          "Twenty outreaches: one case, one ask, one link.",
        ],
      },
    ],
  },
};
