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
      "You refill the calendar before you tighten what you sell and what you refuse.",
      "You answer ‘what do you do’ three different ways in one week.",
      "You sell hours and tasks without a named package someone can buy from a page.",
    ],
    rules: [
      {
        id: "wr-split-pitch-list",
        priority: 96,
        match: { allTags: ["work:split", "pitch:list"] },
        lines: [
          "You split time across clients and still describe yourself as a skill list — buyers see neither a lane nor a checkout.",
          "Pick one buyer sentence and one boundary this week; say no once using it.",
        ],
      },
      {
        id: "wr-audience-split-pitch-soft",
        priority: 95,
        match: { allTags: ["audience:split", "pitch:soft"] },
        lines: [
          "Two audiences plus hiding price trains people to stall — you negotiate in chat instead of on paper.",
          "Post one price band for one audience; archive the other page until next quarter.",
        ],
      },
      {
        id: "wr-audience-split",
        priority: 92,
        match: { allTags: ["audience:split"] },
        lines: [
          "You run two lanes with one calendar — both get half-finished updates and mixed messaging.",
          "Split pages and prices, or park one lane for 60 days.",
        ],
      },
      {
        id: "wr-pitch-list",
        priority: 90,
        match: { allTags: ["pitch:list"] },
        lines: [
          "You answer with skills — strangers still do not know what they would pay for on Tuesday.",
          "Finish the sentence: ‘I fix ___ for ___ by ___’ and use only that in bios for two weeks.",
        ],
      },
      {
        id: "wr-work-split",
        priority: 88,
        match: { allTags: ["work:split"] },
        lines: [
          "You hop between clients with no written boundary — ‘small asks’ eat the margin.",
          "Put scope in the agreement; charge for anything outside in writing.",
        ],
      },
      {
        id: "wr-offer-stacked",
        priority: 86,
        match: { allTags: ["offer:stacked"] },
        lines: [
          "You stack new lines before killing old ones — old forms still attract wrong leads.",
          "Retire one URL or one SKU this month; redirect it to the live offer.",
        ],
      },
      {
        id: "wr-brand-split",
        priority: 84,
        match: { allTags: ["brand:split"] },
        lines: [
          "Two names split search and intros — people book the wrong entry and you restart the story.",
          "Pick the name money flows through; forward everything else.",
        ],
      },
      {
        id: "wr-ship-delayed",
        priority: 80,
        match: { allTags: ["ship:delayed"] },
        lines: [
          "You practice in private while buyers buy from whoever ships a dated outcome.",
          "Set a ship date someone could pay for — even if the scope is tiny.",
        ],
      },
      {
        id: "wr-message-churn",
        priority: 48,
        match: { maxScore: { clarity: 40 } },
        lines: [
          "You rewrite the pitch before the same people hear the same version twice.",
          "Freeze the story for 14 days — only change examples, not the claim.",
        ],
      },
    ],
  },
  wasting: {
    title: "What's wasting your time",
    defaults: [
      "You retype the same explanations in email and DMs instead of one link or one minute of video.",
      "You take calls that end without a date, a deposit, or a written scope.",
      "You tweak tools and folders while nothing new goes out the door with a price on it.",
    ],
    rules: [
      {
        id: "wa-comms-stack",
        priority: 96,
        match: { allTags: ["time:comms_heavy", "stack:overlap"] },
        lines: [
          "You’re losing hours to threads and paying twice for the same job across apps — neither has a weekly cap.",
          "One digest, one stack: cancel a duplicate tool and batch replies to two windows daily.",
        ],
      },
      {
        id: "wa-comms-heavy",
        priority: 92,
        match: { allTags: ["time:comms_heavy"] },
        lines: [
          "You’re spending time on Slack and email with buyers who already paid for a result — access replaced delivery.",
          "Move status to one weekly note; put the phone number behind office hours.",
        ],
      },
      {
        id: "wa-meetings-packed",
        priority: 90,
        match: { allTags: ["time:meetings_packed"] },
        lines: [
          "Back-to-back calls leave no room to build — you sell thinking time but give it away in rooms.",
          "Block two half-days with zero calls; defend them like client work.",
        ],
      },
      {
        id: "wa-stack-overlap",
        priority: 88,
        match: { allTags: ["stack:overlap"] },
        lines: [
          "You pay for overlapping tools — sync fixes eat afternoons.",
          "Pick one system of record; delete the extra login.",
        ],
      },
      {
        id: "wa-focus-fragmented",
        priority: 86,
        match: { allTags: ["focus:fragmented"] },
        lines: [
          "You never get 90 minutes straight — the same task restarts four times.",
          "Batch one type of work per morning; turn off pings until lunch.",
        ],
      },
      {
        id: "wa-lead-cold-inbound-thin",
        priority: 84,
        match: { allTags: ["lead:cold", "inbound:thin"] },
        lines: [
          "You spend time on cold volume while warm pipe is empty — random DMs replace a short list.",
          "Twenty messages to people who already know you beat two hundred cold ones this week.",
        ],
      },
      {
        id: "wa-lead-cold",
        priority: 82,
        match: { allTags: ["lead:cold"] },
        lines: [
          "Cold work without a tight list or one offer line — spray and pray burns weeks.",
          "Name 30 accounts; send one case, one ask, one link — nothing else until replies land.",
        ],
      },
      {
        id: "wa-comp-watch",
        priority: 78,
        match: { allTags: ["dir:comp_watch"] },
        lines: [
          "You scroll competitors daily — shipping drops.",
          "Cap tabs at 15 minutes weekly; spend the rest on five buyer calls.",
        ],
      },
      {
        id: "wa-systems-low",
        priority: 45,
        match: { maxScore: { leverage: 38 } },
        lines: [
          "You repeat the same onboarding live — record it once and send it before the call.",
          "Turn the third repeated fix into a checklist someone else can run.",
        ],
      },
    ],
  },
  niche: {
    title: "Your actual niche",
    defaults: [
      "Small teams already buying this kind of help who need it done this month, not explained forever.",
    ],
    rules: [
      {
        id: "ni-sharp-metric",
        priority: 96,
        match: { allTags: ["niche:sharp", "niche:metric"] },
        lines: [
          "Buyers who own budget and one number you can move in 30 days — not ‘anyone online’ with a vague pain.",
        ],
      },
      {
        id: "ni-sharp",
        priority: 95,
        match: { anyTags: ["niche:sharp", "niche:metric"] },
        lines: [
          "People who already pay for this category and will sign when the outcome is named — not tourists asking for free opinions.",
        ],
      },
      {
        id: "ni-warm-proof",
        priority: 90,
        match: { allTags: ["lead:warm", "proof:numbers"] },
        lines: [
          "Teams one referral away — your receipts are named outcomes with numbers, not adjectives.",
        ],
      },
      {
        id: "ni-outcome-pitch",
        priority: 86,
        match: { allTags: ["pitch:outcome"] },
        lines: [
          "Buyers who already pay for the outcome you name — you are not selling free brainstorming to people who were never going to pay.",
        ],
      },
      {
        id: "ni-delivery",
        priority: 82,
        match: { allTags: ["work:delivery"] },
        lines: [
          "Buyers who need backlog cleared — you sell dates and throughput, not another deck.",
        ],
      },
      {
        id: "ni-wide",
        priority: 70,
        match: { allTags: ["niche:wide"] },
        lines: [
          "An industry label is not a niche — name one expensive problem inside that industry and who signs for it.",
        ],
      },
      {
        id: "ni-draft",
        priority: 65,
        match: { allTags: ["niche:draft"] },
        lines: [
          "People who paid you in the last 90 days — that cluster is your draft niche until you prove otherwise.",
        ],
      },
      {
        id: "ni-scattered-focus",
        priority: 50,
        match: { maxScore: { focus: 42 } },
        lines: [
          "The buyer you served fastest with the fewest questions — build the sentence around them and cut the rest for now.",
        ],
      },
    ],
  },
  money: {
    title: "Where money is",
    defaults: [
      "People who already bought from you asking for a smaller paid step before a big one.",
      "Teams swapping a bad hire or bad retainer for a fixed sprint with an end date.",
      "Owners already paying for tools in this space but stuck in setup — they will pay someone to finish.",
      "Peers who saw your work inside another company and want the same result on their floor.",
    ],
    rules: [
      {
        id: "mo-pull-delivery",
        priority: 94,
        match: { allTags: ["lead:pull", "work:delivery"] },
        lines: [
          "Inbound plus a full queue — sell the next start date and a paid down payment, not more discovery.",
          "Same asset topic that pulls — run it again with a price and a calendar link.",
          "Add-on work past buyers asked for — package the smallest version.",
        ],
      },
      {
        id: "mo-pull",
        priority: 92,
        match: { allTags: ["lead:pull"] },
        lines: [
          "Traffic on one topic — double that topic before opening a new one.",
          "Self-serve buyers who book or buy without a custom call — protect that path.",
          "Search or referral on one phrase you own end-to-end — put fees next to the proof.",
        ],
      },
      {
        id: "mo-warm",
        priority: 90,
        match: { allTags: ["lead:warm"] },
        lines: [
          "Warm intros — three asks to past clients with a fixed fee and a start week.",
          "Peers who trust you — paid half-day before a big build.",
          "Accounts where you already have receipts, even informal — ask for a paid pilot.",
        ],
      },
      {
        id: "mo-delivery",
        priority: 88,
        match: { allTags: ["work:delivery"] },
        lines: [
          "Backlog and start dates — sell the next slot, not another scoping week.",
          "Rush fees for people who want speed over polish — put it on the page.",
          "After a big build — monthly care with a cap, not unlimited pings.",
        ],
      },
      {
        id: "mo-metric-buyer",
        priority: 86,
        match: { allTags: ["buyer:metric"] },
        lines: [
          "Buyers who track a number you move — tie your fee to that delta in writing.",
          "Ops or finance owners who own a line item you shrink — sell to that seat.",
          "Teams paying for data tools they do not use — paid setup plus handoff training.",
        ],
      },
      {
        id: "mo-early",
        priority: 72,
        match: { allTags: ["traction:early"] },
        lines: [
          "Small shops with one expensive manual step you remove — they feel it in the bank account fast.",
          "Local buyers choosing on speed — same-day quote and start wins.",
          "Solo operators drowning in chaos — simple system, fixed price.",
        ],
      },
      {
        id: "mo-cold",
        priority: 68,
        match: { allTags: ["lead:cold"] },
        lines: [
          "A tight list where one case study matches their world — ignore the rest for now.",
          "Roles hiring for work you replace — sell the bypass, not a pitch deck.",
          "Public threads where they name the pain — one reply, one link, one follow-up date.",
        ],
      },
    ],
  },
  charge: {
    title: "What to charge",
    defaults: [
      "$800–$2,000 for a scoped sprint with a named deliverable and a stop date.",
      "$2,000–$6,000 for a multi-step build with milestones and revision limits in writing.",
      "$150–$350/hour only inside a capped bundle — not an open tab.",
    ],
    rules: [
      {
        id: "ch-price-solid-named",
        priority: 92,
        match: { allTags: ["think:price_solid", "skill:named"] },
        lines: [
          "$1,500–$4,000 fixed for a two-week outcome with one revision round — say it before the call ends.",
          "$600–$1,500 for a half-day working session with a short written plan they can buy from.",
        ],
      },
      {
        id: "ch-price-solid",
        priority: 90,
        match: { allTags: ["think:price_solid"] },
        lines: [
          "$1,500–$5,000 fixed for a two-week outcome with one revision round.",
          "$3,000–$10,000 for a 30-day program with weekly checkpoints — payment in two chunks.",
          "Raise the floor — stop taking work under the new minimum.",
        ],
      },
      {
        id: "ch-skill-named",
        priority: 88,
        match: { allTags: ["skill:named"] },
        lines: [
          "$1,000–$2,500 for a packaged review that ends with two purchase options on paper.",
          "$500–$1,200 for a half-day intensive with a one-page plan they keep.",
        ],
      },
      {
        id: "ch-skill-labor",
        priority: 84,
        match: { allTags: ["skill:labor"] },
        lines: [
          "$75–$150/hour with weekly caps — or a weekly bucket at $2,000–$4,000 with a burn-down.",
          "No open hourly tabs — sell blocks of 10 or 20 hours with a written burn-down.",
        ],
      },
      {
        id: "ch-price-fear-soft",
        priority: 82,
        match: { allTags: ["think:price_fear", "pitch:soft"] },
        lines: [
          "Cut scope before you cut price — same work split into a smaller paid step.",
          "$500–$1,500 micro-engagements that filter people who will not pay full freight.",
        ],
      },
      {
        id: "ch-advice",
        priority: 78,
        match: { allTags: ["skill:advice"] },
        lines: [
          "$2,000–$8,000 for a fixed number of calls and async windows — not unlimited access.",
          "Sell dates and agendas — not ‘whenever you need me.’",
        ],
      },
      {
        id: "ch-revenue-tight",
        priority: 48,
        match: { maxScore: { monetization: 40 } },
        lines: [
          "$300–$800 paid review — credit half toward the build if they move.",
          "$1,200–$3,000 build sprints with a hard stop date on the contract.",
        ],
      },
    ],
  },
  stop: {
    title: "What to stop",
    defaults: [
      "Taking calls without a price band and a written scope.",
      "Opening new channels before one channel brings paid work.",
      "Writing custom proposals for buyers who have not put money down.",
    ],
    rules: [
      {
        id: "st-panic-yes",
        priority: 92,
        match: { allTags: ["slow:panic_yes"] },
        lines: [
          "Saying yes to bad-fit work when the pipeline dips — you train buyers to squeeze you.",
          "Discounting without cutting deliverables — you teach them price is fake.",
        ],
      },
      {
        id: "st-offer-stacked",
        priority: 90,
        match: { allTags: ["offer:stacked"] },
        lines: [
          "Shipping new offers before you kill one old line — attention splits.",
          "Keeping live pages for work you no longer want — wrong leads keep booking.",
        ],
      },
      {
        id: "st-consume",
        priority: 88,
        match: { allTags: ["slow:consume"] },
        lines: [
          "Buying more courses while invoices are thin — study replaced shipping.",
          "Tutorial loops — swap one module for one invoice this week.",
        ],
      },
      {
        id: "st-blame",
        priority: 84,
        match: { anyTags: ["think:blame_market", "think:blame_cred"] },
        lines: [
          "Blaming the market or the next certificate — neither books calls.",
          "Waiting to be picked — ship one paid test instead.",
        ],
      },
      {
        id: "st-comp-watch",
        priority: 82,
        match: { allTags: ["dir:comp_watch"] },
        lines: [
          "Daily competitor scrolling — cap at 15 minutes weekly.",
          "Copying their roadmap — talk to five buyers instead.",
        ],
      },
      {
        id: "st-price-avoid",
        priority: 78,
        match: { allTags: ["think:price_avoid"] },
        lines: [
          "Sending proposals late — train them to ghost.",
          "Letting ‘I’ll think about it’ end the thread — no date, no next step.",
        ],
      },
    ],
  },
  focus: {
    title: "What to focus on",
    defaults: [
      "One offer on one page — one number you check every Friday.",
      "Past buyers and warm intros before new cold lists.",
      "Calendar blocks for delivery — not more ‘pick your brain’ calls.",
    ],
    rules: [
      {
        id: "fo-buyer-metric",
        priority: 90,
        match: { allTags: ["buyer:metric"] },
        lines: [
          "The number you move — put it in the headline and every proposal header.",
          "One case slide with math per industry — stop generic praise quotes.",
        ],
      },
      {
        id: "fo-plan-vague",
        priority: 88,
        match: { allTags: ["plan:vague"] },
        lines: [
          "Pick one revenue target for 90 days — divide by weeks — that is how many ships must leave dock.",
          "Put three ship weeks on the calendar — not a longer task list.",
        ],
      },
      {
        id: "fo-embarrass-narrow",
        priority: 86,
        match: { allTags: ["think:embrace_narrow"] },
        lines: [
          "The lane that already closes — say no to everything else for 30 days.",
          "Cut one audience or one service line — publish the cut.",
        ],
      },
      {
        id: "fo-fear-narrow",
        priority: 84,
        match: { allTags: ["think:fear_narrow"] },
        lines: [
          "Smallest list that already paid — own that patch before you widen.",
          "One case study that matches that list — nothing broader until it runs.",
        ],
      },
      {
        id: "fo-reactivate",
        priority: 82,
        match: { allTags: ["slow:reactivate"] },
        lines: [
          "Past buyers — one email, one offer, one start date.",
          "Referrals only after a win is written down with numbers.",
        ],
      },
      {
        id: "fo-scattered",
        priority: 48,
        match: { maxScore: { focus: 42 } },
        lines: [
          "Ship one sellable page before you add another channel.",
          "Two half-days weekly with no meetings — guard them like client money.",
        ],
      },
    ],
  },
  first: {
    title: "What to do first",
    defaults: [
      "Write one page: who it is for, what they get, price band, next start date.",
      "Send five messages: past buyers, one sentence each, one fixed offer and link.",
      "Track one number weekly — booked calls or deposits — review it Fridays.",
    ],
    rules: [
      {
        id: "fi-stuck-split",
        priority: 94,
        match: { allTags: ["think:stuck", "work:split"] },
        lines: [
          "List who paid last — pick the last invoice — copy their words into a one-page offer.",
          "Block three calls only with that buyer type — decline everything else for one week.",
          "Ship one small paid thing in 48 hours — template, checklist, or short recording.",
        ],
      },
      {
        id: "fi-stuck",
        priority: 90,
        match: { allTags: ["think:stuck"] },
        lines: [
          "Pick the last buyer who paid — copy their words into a one-page offer.",
          "Book three calls only with people matching that buyer — decline new ideas on the call.",
          "Ship a dated mini-asset — checklist, template, or recording — in 48 hours.",
        ],
      },
      {
        id: "fi-plan-vague",
        priority: 88,
        match: { allTags: ["plan:vague"] },
        lines: [
          "Write a 90-day number — divide by 12 — that is your weekly ship count.",
          "Schedule three ship weeks — block the time now.",
          "Tell one person the plan — they get a Friday text on what shipped.",
        ],
      },
      {
        id: "fi-ship-asset",
        priority: 86,
        match: { allTags: ["think:ship_asset"] },
        lines: [
          "Finish the page — headline, price, buy or book — no new sections.",
          "Email your list with a deadline — ship beats polish.",
          "Log replies in a sheet — one follow-up rule for people who do not buy.",
        ],
      },
      {
        id: "fi-niche-draft",
        priority: 84,
        match: { allTags: ["niche:draft"] },
        lines: [
          "List ten people who paid — find three traits — write one sentence.",
          "Put that sentence in bio, footer, and proposal header — same words.",
          "Turn down one wrong-fit ask using that sentence as the filter.",
        ],
      },
      {
        id: "fi-inbound-thin",
        priority: 80,
        match: { allTags: ["inbound:thin"] },
        lines: [
          "Twenty outreaches — one case, one ask, one link.",
          "Three past clients — ask for intros to a named role and pain.",
          "Publish one proof piece — name, number, before/after.",
        ],
      },
    ],
  },
};
