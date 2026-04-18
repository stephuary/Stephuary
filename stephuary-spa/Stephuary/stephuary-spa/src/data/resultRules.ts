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
      "You let the calendar fill before the offer gets tighter.",
      "You answer what you do differently depending on the room.",
      "You trade time for tasks without a named package.",
    ],
    rules: [
      {
        id: "wr-audience-split",
        priority: 92,
        match: { allTags: ["audience:split"] },
        lines: [
          "You market to two audiences without separate prices or pages.",
          "You say yes to both lanes and ship slower on both.",
        ],
      },
      {
        id: "wr-pitch-list",
        priority: 90,
        match: { allTags: ["pitch:list"] },
        lines: [
          "You list skills instead of one outcome.",
          "Strangers leave without knowing what to buy.",
        ],
      },
      {
        id: "wr-work-split",
        priority: 88,
        match: { allTags: ["work:split"] },
        lines: [
          "You jump between clients with no written boundary.",
          "Scope creeps in Slack because nothing is fixed on paper.",
        ],
      },
      {
        id: "wr-offer-stacked",
        priority: 86,
        match: { allTags: ["offer:stacked"] },
        lines: [
          "You add offers before retiring weak lines.",
          "Old pages still collect leads you do not serve well.",
        ],
      },
      {
        id: "wr-brand-split",
        priority: 84,
        match: { allTags: ["brand:split"] },
        lines: [
          "Two names tell two stories — leads pick the wrong entry.",
          "Search and referrals split across both brands.",
        ],
      },
      {
        id: "wr-ship-delayed",
        priority: 80,
        match: { allTags: ["ship:delayed"] },
        lines: [
          "You build or study without a buyer-facing ship date.",
          "Practice replaces invoices.",
        ],
      },
      {
        id: "wr-clarity-low",
        priority: 48,
        match: { maxScore: { clarity: 40 } },
        lines: [
          "You change the story before the market hears it twice.",
          "Inputs outrun outputs — calls and posts beat packages.",
        ],
      },
    ],
  },
  wasting: {
    title: "What's wasting your time",
    defaults: [
      "Rewriting the same answers in email and DMs.",
      "Meetings with no priced next step on the calendar.",
      "Tool setup that does not change what ships this week.",
    ],
    rules: [
      {
        id: "wa-comms-heavy",
        priority: 92,
        match: { allTags: ["time:comms_heavy"] },
        lines: [
          "Always-on threads with buyers who paid for outcomes, not access.",
          "Status pings that should be one weekly digest.",
        ],
      },
      {
        id: "wa-meetings-packed",
        priority: 90,
        match: { allTags: ["time:meetings_packed"] },
        lines: [
          "Back-to-back calls with no build time between.",
          "You sell thinking hours but spend them in meetings.",
        ],
      },
      {
        id: "wa-stack-overlap",
        priority: 88,
        match: { allTags: ["stack:overlap"] },
        lines: [
          "Paying twice for the same job across apps.",
          "Sync fixes instead of one source of truth.",
        ],
      },
      {
        id: "wa-focus-fragmented",
        priority: 86,
        match: { allTags: ["focus:fragmented"] },
        lines: [
          "Never 90 minutes straight — shallow work multiplies.",
          "You restart the same task four times a day.",
        ],
      },
      {
        id: "wa-lead-cold",
        priority: 82,
        match: { allTags: ["lead:cold"] },
        lines: [
          "Cold volume without a tight list or one offer line.",
          "Random DMs — no sequence, no dates.",
        ],
      },
      {
        id: "wa-comp-watch",
        priority: 78,
        match: { allTags: ["dir:comp_watch"] },
        lines: [
          "Daily competitor tabs — little shipping.",
          "Feature chasing instead of buyer interviews.",
        ],
      },
      {
        id: "wa-leverage-low",
        priority: 45,
        match: { maxScore: { leverage: 38 } },
        lines: [
          "Repeating the same onboarding call instead of one short recording.",
          "One-off fixes that never become checklists.",
        ],
      },
    ],
  },
  niche: {
    title: "Your actual niche",
    defaults: [
      "Operators at small firms who already buy this category and need speed more than theory.",
    ],
    rules: [
      {
        id: "ni-sharp",
        priority: 95,
        match: { anyTags: ["niche:sharp", "niche:metric"] },
        lines: [
          "Leaders with budget and one KPI you can move in 30 days — not 'everyone with a website.'",
        ],
      },
      {
        id: "ni-warm-lead",
        priority: 88,
        match: { allTags: ["lead:warm", "proof:numbers"] },
        lines: [
          "Teams one referral away — your proof is named outcomes, not buzzwords.",
        ],
      },
      {
        id: "ni-outcome-pitch",
        priority: 86,
        match: { allTags: ["pitch:outcome"] },
        lines: [
          "Buyers who already pay for the outcome you name — you are not selling 'strategy' to tourists.",
        ],
      },
      {
        id: "ni-delivery",
        priority: 82,
        match: { allTags: ["work:delivery"] },
        lines: [
          "Buyers who need backlog cleared — you sell dates and throughput, not ideas.",
        ],
      },
      {
        id: "ni-wide",
        priority: 70,
        match: { allTags: ["niche:wide"] },
        lines: [
          "An industry label is not a niche — pick one pain inside that industry first.",
        ],
      },
      {
        id: "ni-draft",
        priority: 65,
        match: { allTags: ["niche:draft"] },
        lines: [
          "People who already asked you for paid help in the last 90 days — that cluster is the draft niche.",
        ],
      },
      {
        id: "ni-focus-low",
        priority: 50,
        match: { maxScore: { focus: 42 } },
        lines: [
          "The buyer you served fastest with the least explanation — start there and cut the rest.",
        ],
      },
    ],
  },
  money: {
    title: "Where money is",
    defaults: [
      "Repeat buyers asking for a smaller paid step first.",
      "Teams replacing a failed hire or bad retainer with a fixed sprint.",
      "Founders who already spend on tools in this category and need implementation.",
      "Peers who saw your work inside another company and want the same outcome.",
    ],
    rules: [
      {
        id: "mo-pull",
        priority: 92,
        match: { allTags: ["lead:pull"] },
        lines: [
          "Inbound from one asset — double the topic that already pulls.",
          "Search or referral traffic on one problem phrase you solve end-to-end.",
          "Self-serve buyers who hit 'buy' or book without a custom pitch.",
          "Past buyers who asked for a shorter add-on — package it.",
        ],
      },
      {
        id: "mo-warm",
        priority: 90,
        match: { allTags: ["lead:warm"] },
        lines: [
          "Warm intros — three asks to past clients with a fixed scope.",
          "Peers who trust you — small workshop or audit before a big build.",
          "Accounts where you already have receipts, even informal.",
        ],
      },
      {
        id: "mo-delivery",
        priority: 88,
        match: { allTags: ["work:delivery"] },
        lines: [
          "Backlog and start dates — sell the next slot, not more discovery.",
          "Clients who want speed over novelty — rush fees and weekend blocks.",
          "Maintenance after a big build — retainer for uptime.",
        ],
      },
      {
        id: "mo-metric-buyer",
        priority: 86,
        match: { allTags: ["buyer:metric"] },
        lines: [
          "Buyers who track a number you move — tie fees to that delta.",
          "Finance or ops leads who own a line item you reduce.",
          "Teams paying for data tools but not using them — setup plus training.",
        ],
      },
      {
        id: "mo-early",
        priority: 72,
        match: { allTags: ["traction:early"] },
        lines: [
          "Small businesses with one expensive manual step you remove.",
          "Local buyers who compare on speed — same-day quotes and starts.",
          "Solo operators swapping chaos for a simple system.",
        ],
      },
      {
        id: "mo-cold",
        priority: 68,
        match: { allTags: ["lead:cold"] },
        lines: [
          "A tight list where one case study matches their world.",
          "Roles hiring for the work you replace — contract-to-hire bypass.",
          "Accounts posting the pain in public threads — short replies, one link.",
        ],
      },
    ],
  },
  charge: {
    title: "What to charge",
    defaults: [
      "$800–$2,000 for a scoped sprint with a named deliverable.",
      "$2,000–$6,000 for a defined transformation with milestones.",
      "$150–$350/hour only inside a capped bundle — not open-ended tabs.",
    ],
    rules: [
      {
        id: "ch-price-solid",
        priority: 90,
        match: { allTags: ["think:price_solid"] },
        lines: [
          "$1,500–$5,000 fixed for a two-week outcome with one revision round.",
          "$3,000–$10,000 for a 30-day program with weekly checkpoints.",
          "Raise the floor — drop buyers who will not pay the new minimum.",
        ],
      },
      {
        id: "ch-skill-named",
        priority: 88,
        match: { allTags: ["skill:named"] },
        lines: [
          "$1,000–$2,500 for a packaged diagnostic that ends with two purchase options.",
          "$500–$1,200 for a half-day intensive with a short written plan.",
        ],
      },
      {
        id: "ch-skill-labor",
        priority: 84,
        match: { allTags: ["skill:labor"] },
        lines: [
          "$75–$150/hour with weekly caps — or convert to a weekly bucket at $2,000–$4,000.",
          "Stop open hourly — sell blocks of 10 or 20 hours with a clear burn-down.",
        ],
      },
      {
        id: "ch-price-fear",
        priority: 80,
        match: { anyTags: ["think:price_fear", "pitch:soft"] },
        lines: [
          "Quote high with a smaller scope — not a lower price for the same work.",
          "$500–$1,500 micro-engagements to filter serious buyers.",
        ],
      },
      {
        id: "ch-advice",
        priority: 78,
        match: { allTags: ["skill:advice"] },
        lines: [
          "$2,000–$8,000 for advisory packs with office hours and async limits.",
          "Never sell open-ended access — sell dates and agendas.",
        ],
      },
      {
        id: "ch-monetization-low",
        priority: 48,
        match: { maxScore: { monetization: 40 } },
        lines: [
          "$300–$800 paid audit — credit half toward implementation.",
          "$1,200–$3,000 implementation sprints with a hard stop date.",
        ],
      },
    ],
  },
  stop: {
    title: "What to stop",
    defaults: [
      "Taking calls without a price band and written scope.",
      "Starting new channels before one converts.",
      "Custom proposals for buyers who have not paid a deposit.",
    ],
    rules: [
      {
        id: "st-panic-yes",
        priority: 92,
        match: { allTags: ["slow:panic_yes"] },
        lines: [
          "Saying yes to bad-fit work when pipeline dips.",
          "Discounting without cutting scope.",
        ],
      },
      {
        id: "st-offer-stacked",
        priority: 90,
        match: { allTags: ["offer:stacked"] },
        lines: [
          "Launching new offers before you retire one line.",
          "Keeping pages for products you no longer want to deliver.",
        ],
      },
      {
        id: "st-consume",
        priority: 88,
        match: { allTags: ["slow:consume"] },
        lines: [
          "New courses while invoices are thin.",
          "Tutorial loops that replace shipping.",
        ],
      },
      {
        id: "st-blame",
        priority: 84,
        match: { anyTags: ["think:blame_market", "think:blame_cred"] },
        lines: [
          "Blaming the market or the next credential.",
          "Waiting to be picked — ship a test instead.",
        ],
      },
      {
        id: "st-comp-watch",
        priority: 82,
        match: { allTags: ["dir:comp_watch"] },
        lines: [
          "Daily competitor scrolling — cap it at 15 minutes weekly.",
          "Copying their roadmap instead of talking to five buyers.",
        ],
      },
      {
        id: "st-price-avoid",
        priority: 78,
        match: { allTags: ["think:price_avoid"] },
        lines: [
          "Sending proposals without a number early.",
          "Letting 'I'll think about it' end threads — no dated follow-up.",
        ],
      },
    ],
  },
  focus: {
    title: "What to focus on",
    defaults: [
      "One offer, one page, one metric you track weekly.",
      "Warm buyers and past clients before cold lists.",
      "Delivery blocks on the calendar — not more discovery.",
    ],
    rules: [
      {
        id: "fo-buyer-metric",
        priority: 90,
        match: { allTags: ["buyer:metric"] },
        lines: [
          "The metric you move — put it in the headline.",
          "Case slides with math — one story per industry.",
        ],
      },
      {
        id: "fo-plan-vague",
        priority: 88,
        match: { allTags: ["plan:vague"] },
        lines: [
          "Pick one revenue number for 90 days — work backward to weekly ships.",
          "Three launch dates on the calendar — not a task pile.",
        ],
      },
      {
        id: "fo-embarrass-narrow",
        priority: 86,
        match: { allTags: ["think:embrace_narrow"] },
        lines: [
          "Double down on the lane that already closes.",
          "Cut one audience or service line this month.",
        ],
      },
      {
        id: "fo-fear-narrow",
        priority: 84,
        match: { allTags: ["think:fear_narrow"] },
        lines: [
          "Smallest list that already paid — own that patch first.",
          "One case study that matches that list exactly.",
        ],
      },
      {
        id: "fo-reactivate",
        priority: 82,
        match: { allTags: ["slow:reactivate"] },
        lines: [
          "Past buyers — one offer email, one date to start.",
          "Referral asks only after a win is documented.",
        ],
      },
      {
        id: "fo-focus-low",
        priority: 48,
        match: { maxScore: { focus: 42 } },
        lines: [
          "Ship one sellable asset before adding marketing channels.",
          "Block two half-days weekly — no new meetings inside them.",
        ],
      },
    ],
  },
  first: {
    title: "What to do first",
    defaults: [
      "Write one page: who it is for, what they get, price band, next start date.",
      "Send five messages: past buyers, one sentence each, one fixed offer.",
      "Put one metric on a sticky — booked calls or deposits — review Fridays.",
    ],
    rules: [
      {
        id: "fi-stuck",
        priority: 90,
        match: { allTags: ["think:stuck"] },
        lines: [
          "Pick the last buyer who paid — copy their words into a one-page offer.",
          "Book three calls only with people matching that buyer — no new ideas.",
          "Ship a dated mini-asset — checklist, template, or Loom — in 48 hours.",
        ],
      },
      {
        id: "fi-plan-vague",
        priority: 88,
        match: { allTags: ["plan:vague"] },
        lines: [
          "Write a 90-day number — divide by 12 weeks — that is your weekly ship count.",
          "Schedule three ship dates this month — block time on calendar.",
          "Tell one person the plan — accountability beats more research.",
        ],
      },
      {
        id: "fi-ship-asset",
        priority: 86,
        match: { allTags: ["think:ship_asset"] },
        lines: [
          "Finish the sellable page — headline, price, buy or book button.",
          "Email your list with a deadline — external date beats internal polish.",
          "Log replies in a sheet — one follow-up rule for non-buyers.",
        ],
      },
      {
        id: "fi-niche-draft",
        priority: 84,
        match: { allTags: ["niche:draft"] },
        lines: [
          "List ten people who paid — find three traits in common — write one sentence.",
          "Post that sentence everywhere — bio, footer, proposal header.",
          "Reject one wrong-fit inquiry using the sentence as the filter.",
        ],
      },
      {
        id: "fi-inbound-thin",
        priority: 80,
        match: { allTags: ["inbound:thin"] },
        lines: [
          "Twenty targeted outreaches — one case, one ask, one link.",
          "Ask three past clients for intros — specific role, specific pain.",
          "Publish one proof piece — numbers, name, before/after.",
        ],
      },
    ],
  },
};
