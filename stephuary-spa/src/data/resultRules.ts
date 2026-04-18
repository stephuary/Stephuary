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
      "You keep adding meetings before you lock what you sell and what you refuse.",
      "Strangers still hear three different answers to ‘what do you do’ in one week.",
      "This is why nothing compounds — you reset the story every week instead of stacking proof.",
      "Name one package, one page, one price band. Nothing else ships until that page is live.",
    ],
    rules: [
      {
        id: "wr-split-pitch-list",
        priority: 96,
        match: { allTags: ["work:split", "pitch:list"] },
        lines: [
          "You split time across clients and you still pitch a skill list.",
          "Buyers see neither a lane nor a checkout.",
          "This is why revenue stays thin — nobody can repeat your offer back to you.",
          "Pick one buyer sentence and one boundary this week. Say no once using it.",
        ],
      },
      {
        id: "wr-audience-split-pitch-soft",
        priority: 95,
        match: { allTags: ["audience:split", "pitch:soft"] },
        lines: [
          "You run two audiences and you hide the price.",
          "People stall — you negotiate in chat instead of on paper.",
          "This is why deals drag — nobody knows what they are buying.",
          "Post one price band for one audience. Archive the other page until next quarter.",
        ],
      },
      {
        id: "wr-audience-split",
        priority: 92,
        match: { allTags: ["audience:split"] },
        lines: [
          "You are trying to run two directions at once.",
          "That is why neither one is landing.",
          "This is why nothing compounds — both lanes stay half-built.",
          "Split pages and prices, or park one lane for 60 days. Pick one.",
        ],
      },
      {
        id: "wr-pitch-list",
        priority: 90,
        match: { allTags: ["pitch:list"] },
        lines: [
          "You answer with skills.",
          "Strangers still do not know what they would pay for on Tuesday.",
          "This is why conversations die — there is no named outcome to buy.",
          "Finish: ‘I fix ___ for ___ by ___’ and use only that in bios for two weeks.",
        ],
      },
      {
        id: "wr-work-split",
        priority: 88,
        match: { allTags: ["work:split"] },
        lines: [
          "You hop between clients with no written boundary.",
          "Small asks eat the margin.",
          "This is why you are busy and still broke — scope leaks every day.",
          "Put scope in the agreement. Charge for anything outside in writing.",
        ],
      },
      {
        id: "wr-offer-stacked",
        priority: 86,
        match: { allTags: ["offer:stacked"] },
        lines: [
          "You stack new lines before you kill old ones.",
          "Old forms still pull the wrong leads.",
          "This is why marketing feels noisy — three offers fight for one calendar.",
          "Retire one URL or one SKU this month. Redirect it to the live offer.",
        ],
      },
      {
        id: "wr-brand-split",
        priority: 84,
        match: { allTags: ["brand:split"] },
        lines: [
          "Two names split search and intros.",
          "People book the wrong entry and you restart the story from zero.",
          "This is why trust leaks — nobody knows which door is real.",
          "Pick the name money flows through. Forward everything else.",
        ],
      },
      {
        id: "wr-ship-delayed",
        priority: 80,
        match: { allTags: ["ship:delayed"] },
        lines: [
          "You practice in private.",
          "Buyers pay whoever ships a dated outcome.",
          "This is why you lose to louder mediocrity — dates beat polish.",
          "Set a ship date someone could pay for — even if the scope is tiny.",
        ],
      },
      {
        id: "wr-message-churn",
        priority: 48,
        match: { maxScore: { clarity: 40 } },
        lines: [
          "You rewrite the pitch before the same people hear the same version twice.",
          "Nobody gets to trust one claim.",
          "This is why traction flatlines — you erase your own trail.",
          "Freeze the story for 14 days. Only change examples, not the claim.",
        ],
      },
    ],
  },
  wasting: {
    title: "What's wasting your time",
    defaults: [
      "You retype the same explanations in email and DMs.",
      "You still do not have one link or one minute of video that does the work.",
      "This is why your weeks disappear — you are the bottleneck on repeat.",
      "Record it once. Send it before the call. Batch replies to two windows daily.",
    ],
    rules: [
      {
        id: "wa-comms-stack",
        priority: 96,
        match: { allTags: ["time:comms_heavy", "stack:overlap"] },
        lines: [
          "You lose hours to threads and you pay twice for the same job across apps.",
          "Neither stack has a weekly cap.",
          "This is why you are tired and still behind — noise replaces delivery.",
          "Cancel one duplicate tool. One digest. Batch replies to two windows daily.",
        ],
      },
      {
        id: "wa-comms-heavy",
        priority: 92,
        match: { allTags: ["time:comms_heavy"] },
        lines: [
          "You spend Slack and email time on buyers who already paid for a result.",
          "Access replaced delivery.",
          "This is why they keep pinging — you trained them that you are always on.",
          "Move status to one weekly note. Put the number behind office hours.",
        ],
      },
      {
        id: "wa-meetings-packed",
        priority: 90,
        match: { allTags: ["time:meetings_packed"] },
        lines: [
          "Back-to-back calls leave no room to build.",
          "You sell thinking time and give it away in rooms.",
          "This is why nothing ships — the calendar eats the work.",
          "Block two half-days with zero calls. Defend them like client money.",
        ],
      },
      {
        id: "wa-stack-overlap",
        priority: 88,
        match: { allTags: ["stack:overlap"] },
        lines: [
          "You pay for overlapping tools.",
          "Sync fixes eat afternoons.",
          "This is why leverage never lands — you maintain two truths.",
          "Pick one system of record. Delete the extra login.",
        ],
      },
      {
        id: "wa-focus-fragmented",
        priority: 86,
        match: { allTags: ["focus:fragmented"] },
        lines: [
          "You never get 90 minutes straight.",
          "The same task restarts four times.",
          "This is why output flatlines — context-switching is the tax.",
          "Batch one type of work per morning. Turn off pings until lunch.",
        ],
      },
      {
        id: "wa-lead-cold-inbound-thin",
        priority: 84,
        match: { allTags: ["lead:cold", "inbound:thin"] },
        lines: [
          "You chase cold volume while warm pipe is empty.",
          "Random DMs replaced a short list.",
          "This is why effort feels random — you skip people who already know you.",
          "Twenty messages to people who already know you beat two hundred cold ones this week.",
        ],
      },
      {
        id: "wa-lead-cold",
        priority: 82,
        match: { allTags: ["lead:cold"] },
        lines: [
          "You run cold work without a tight list or one offer line.",
          "Spray and pray burns weeks.",
          "This is why pipeline stays thin — volume hides the lack of fit.",
          "Name 30 accounts. One case, one ask, one link. Nothing else until replies land.",
        ],
      },
      {
        id: "wa-comp-watch",
        priority: 78,
        match: { allTags: ["dir:comp_watch"] },
        lines: [
          "You scroll competitors daily.",
          "Shipping drops.",
          "This is why you stay behind — you study their feed instead of your buyer.",
          "Cap tabs at 15 minutes weekly. Spend the rest on five buyer calls.",
        ],
      },
      {
        id: "wa-systems-low",
        priority: 45,
        match: { maxScore: { leverage: 38 } },
        lines: [
          "You repeat the same onboarding live.",
          "Every new client burns the same hour.",
          "This is why leverage never compounds — you are the system.",
          "Record it once. Turn the third repeated fix into a checklist someone else can run.",
        ],
      },
    ],
  },
  niche: {
    title: "Your actual niche",
    defaults: [
      "Small teams already buying this kind of help.",
      "They need it done this month — not explained forever.",
      "This is who pays when you stop selling to everyone.",
      "Name them in one sentence. Put it at the top of the next page you send.",
    ],
    rules: [
      {
        id: "ni-sharp-metric",
        priority: 96,
        match: { allTags: ["niche:sharp", "niche:metric"] },
        lines: [
          "Buyers who own budget and one number you can move in 30 days.",
          "That is not ‘anyone online’ with a vague pain.",
          "This is who writes the check when the outcome is concrete.",
          "Lead with the number you move. One sentence. Same everywhere.",
        ],
      },
      {
        id: "ni-sharp",
        priority: 95,
        match: { anyTags: ["niche:sharp", "niche:metric"] },
        lines: [
          "People who already pay for this category.",
          "They sign when the outcome is named — not when you sound smart.",
          "This is why cold traffic wastes you — you are built for buyers who already buy.",
          "Name the outcome they already pay for. Cut the rest of the pitch.",
        ],
      },
      {
        id: "ni-warm-proof",
        priority: 90,
        match: { allTags: ["lead:warm", "proof:numbers"] },
        lines: [
          "Teams one referral away.",
          "Your receipts are numbers — not adjectives.",
          "This is why warm leads stall — proof is buried.",
          "Put one numbered before/after on the page you send next.",
        ],
      },
      {
        id: "ni-outcome-pitch",
        priority: 86,
        match: { allTags: ["pitch:outcome"] },
        lines: [
          "Buyers who already pay for the outcome you name.",
          "You are not selling brainstorming to people who were never going to pay.",
          "This is why calls feel mushy — the buy is missing.",
          "Open with price band or deposit. Same call every time.",
        ],
      },
      {
        id: "ni-delivery",
        priority: 82,
        match: { allTags: ["work:delivery"] },
        lines: [
          "Buyers who need backlog cleared.",
          "You sell dates and throughput — not another deck.",
          "This is where money is — they pay for the slot, not the slide.",
          "Put the next start date on the page. Nothing else above the fold.",
        ],
      },
      {
        id: "ni-wide",
        priority: 70,
        match: { allTags: ["niche:wide"] },
        lines: [
          "An industry label is not a niche.",
          "You are still talking to everyone in it.",
          "This is why nobody self-selects — the pain is not expensive enough on the page.",
          "Name one expensive problem and who signs for it. Delete the rest this week.",
        ],
      },
      {
        id: "ni-draft",
        priority: 65,
        match: { allTags: ["niche:draft"] },
        lines: [
          "People who paid you in the last 90 days.",
          "That cluster is your draft niche until you prove otherwise.",
          "This is who already voted with money — ignore everyone else for now.",
          "Write one sentence around them. Use it in bio, footer, proposal header.",
        ],
      },
      {
        id: "ni-scattered-focus",
        priority: 50,
        match: { maxScore: { focus: 42 } },
        lines: [
          "The buyer you served fastest with the fewest questions.",
          "That is the signal.",
          "This is who you are actually built for — everything else is noise.",
          "Build the sentence around them. Cut the rest for 30 days.",
        ],
      },
    ],
  },
  money: {
    title: "Where money is",
    defaults: [
      "Past buyers asking for a smaller paid step before a big one.",
      "Teams swapping a bad hire or retainer for a fixed sprint with an end date.",
      "This is the shortest path to cash — you keep hunting strangers instead.",
      "Send five past-buyer messages: one offer, one price band, one start week.",
    ],
    rules: [
      {
        id: "mo-pull-delivery",
        priority: 94,
        match: { allTags: ["lead:pull", "work:delivery"] },
        lines: [
          "Inbound is hitting and the queue is full.",
          "You are still selling discovery instead of the next start date.",
          "This is why revenue caps — pull dies when nobody can buy a slot.",
          "Put the next start date and a deposit on the page. Same asset topic: rerun it with price and a calendar link.",
        ],
      },
      {
        id: "mo-pull",
        priority: 92,
        match: { allTags: ["lead:pull"] },
        lines: [
          "Traffic is on one topic.",
          "Self-serve buyers book without a custom call.",
          "This is where money is — you split attention before you double what works.",
          "Double that topic before you open a new one. Put fees next to the proof on the same URL.",
        ],
      },
      {
        id: "mo-warm",
        priority: 90,
        match: { allTags: ["lead:warm"] },
        lines: [
          "Warm intros and peers who already trust you.",
          "Receipts live in past work — even informal ones.",
          "This is why cold feels easier — you skip people who already said yes once.",
          "Three asks to past clients: fixed fee, start week, one link. Ask for a paid pilot where you already proved fit.",
        ],
      },
      {
        id: "mo-delivery",
        priority: 88,
        match: { allTags: ["work:delivery"] },
        lines: [
          "Backlog and start dates are the product.",
          "Buyers pay for the slot — not another scoping week.",
          "This is where margin hides — you keep selling meetings instead of throughput.",
          "Sell the next slot. Rush fee on the page. After big builds: monthly care with a cap.",
        ],
      },
      {
        id: "mo-metric-buyer",
        priority: 86,
        match: { allTags: ["buyer:metric"] },
        lines: [
          "Buyers who track a number you move.",
          "Ops or finance own the line item you shrink.",
          "This is who writes serious checks — generic pitches bounce off them.",
          "Tie your fee to that delta in writing. Sell paid setup plus handoff on the tools they already pay for.",
        ],
      },
      {
        id: "mo-early",
        priority: 72,
        match: { allTags: ["traction:early"] },
        lines: [
          "Small shops with one expensive manual step you remove.",
          "They feel it in the bank account fast.",
          "This is early-stage money — speed beats polish.",
          "Same-day quote and start. Simple system, fixed price. One case in their words on the page.",
        ],
      },
      {
        id: "mo-cold",
        priority: 68,
        match: { allTags: ["lead:cold"] },
        lines: [
          "Cold works when the list is tight and the case matches their world.",
          "You are still broadcasting to everyone.",
          "This is why effort looks busy and the bank does not move.",
          "Thirty accounts max. One case, one ask, one link. One reply per thread, one follow-up date.",
        ],
      },
    ],
  },
  charge: {
    title: "What to charge",
    defaults: [
      "You quote hours and hope they math into a living.",
      "Buyers need a box with a price — not a negotiation.",
      "This is why you leave money on the table — the ask stays fuzzy.",
      "$800–$2,000 fixed sprint with a named deliverable and stop date. Bigger builds: milestones + revision limits in writing. Hourly only inside a capped bundle.",
    ],
    rules: [
      {
        id: "ch-price-solid-named",
        priority: 92,
        match: { allTags: ["think:price_solid", "skill:named"] },
        lines: [
          "You already know your number.",
          "You still wait for them to drag it out of you.",
          "This is why calls run long and checks stall — price is the last thing they hear.",
          "$1,500–$4,000 fixed for a two-week outcome, one revision round — say it before the call ends. Half-day working session: $600–$1,500 with a short plan they can buy from.",
        ],
      },
      {
        id: "ch-price-solid",
        priority: 90,
        match: { allTags: ["think:price_solid"] },
        lines: [
          "Your floor is clear on paper.",
          "Exceptions still sneak in on DMs.",
          "This is how the minimum dies — you break your own rule in private.",
          "$1,500–$5,000 fixed two-week outcome, one revision. $3,000–$10,000 for a 30-day program, weekly checkpoints, payment in two chunks. Stop taking work under the new floor.",
        ],
      },
      {
        id: "ch-skill-named",
        priority: 88,
        match: { allTags: ["skill:named"] },
        lines: [
          "You sell expertise — not another open-ended retainer.",
          "Buyers need two purchase options — not a vibe.",
          "This is why you get ‘let me think about it’ — nothing is easy to buy.",
          "$1,000–$2,500 packaged review ending with two options on paper. $500–$1,200 half-day intensive with a one-page plan they keep.",
        ],
      },
      {
        id: "ch-skill-labor",
        priority: 84,
        match: { allTags: ["skill:labor"] },
        lines: [
          "Hourly is how you get mined.",
          "Open tabs turn your week into a meter.",
          "This is why income wobbles — every week renegotiates itself.",
          "$75–$150/hour with weekly caps — or a weekly bucket at $2,000–$4,000 with a burn-down. Sell 10- or 20-hour blocks only.",
        ],
      },
      {
        id: "ch-price-fear-soft",
        priority: 82,
        match: { allTags: ["think:price_fear", "pitch:soft"] },
        lines: [
          "You cut price before you cut scope.",
          "Buyers learn your number is fake.",
          "This is why you attract negotiators — you trained them to squeeze.",
          "Split the same work into a smaller paid step. $500–$1,500 micro-engagements that filter full-freight buyers.",
        ],
      },
      {
        id: "ch-advice",
        priority: 78,
        match: { allTags: ["skill:advice"] },
        lines: [
          "Advice without boundaries becomes a leash.",
          "You are on call — not on contract.",
          "This is why you are exhausted at ‘success’ — access replaced leverage.",
          "$2,000–$8,000 for a fixed number of calls and async windows. Sell dates and agendas — not ‘whenever you need me.’",
        ],
      },
      {
        id: "ch-revenue-tight",
        priority: 48,
        match: { maxScore: { monetization: 40 } },
        lines: [
          "Cash is tight — so you shrink the ask instead of the scope.",
          "Small checks feel safe — they do not fix the math.",
          "This is how another thin month happens — you never graduate the buyer.",
          "$300–$800 paid review, half credited toward the build. $1,200–$3,000 sprints with a hard stop date on the contract.",
        ],
      },
    ],
  },
  stop: {
    title: "What to stop",
    defaults: [
      "You take calls with no price band and no written scope.",
      "You open new channels before one channel pays.",
      "This is why the week fills and the account does not — motion replaced money.",
      "No call without a band on the invite. One channel until deposits land. No custom proposal without money down.",
    ],
    rules: [
      {
        id: "st-panic-yes",
        priority: 92,
        match: { allTags: ["slow:panic_yes"] },
        lines: [
          "Pipeline dips — you say yes to bad fit.",
          "You discount without cutting deliverables.",
          "This is how you train buyers to squeeze — panic writes your terms.",
          "One sentence: what you do not do. Send it before the next yes.",
        ],
      },
      {
        id: "st-offer-stacked",
        priority: 90,
        match: { allTags: ["offer:stacked"] },
        lines: [
          "You ship new lines before you kill an old one.",
          "Stale pages still pull the wrong leads.",
          "This is why marketing feels loud and broke — three offers fight for one calendar.",
          "Retire one URL or SKU this month. Redirect to the live offer only.",
        ],
      },
      {
        id: "st-consume",
        priority: 88,
        match: { allTags: ["slow:consume"] },
        lines: [
          "Invoices are thin — you buy another course.",
          "Study replaced shipping.",
          "This is why the stack grows and the business does not — consumption ate execution.",
          "Swap one module for one invoice this week. Same calendar block.",
        ],
      },
      {
        id: "st-blame",
        priority: 84,
        match: { anyTags: ["think:blame_market", "think:blame_cred"] },
        lines: [
          "You blame the market — or the next certificate.",
          "Neither one books calls.",
          "This is why you stay invisible — blame is easier than a dated ship.",
          "Ship one paid test. Name the buyer. Put a price on it.",
        ],
      },
      {
        id: "st-comp-watch",
        priority: 82,
        match: { allTags: ["dir:comp_watch"] },
        lines: [
          "You scroll competitors daily.",
          "Shipping drops.",
          "This is why you stay behind — you study their feed instead of your buyer.",
          "Cap competitor time at 15 minutes weekly. Spend the rest on five buyer conversations.",
        ],
      },
      {
        id: "st-price-avoid",
        priority: 78,
        match: { allTags: ["think:price_avoid"] },
        lines: [
          "Proposals go out late — or never.",
          "‘I’ll think about it’ ends the thread with no date.",
          "This is how deals die in silence — you let ambiguity win.",
          "Proposal same day as the call — or a paid scoping step with a deadline. Every ‘maybe’ gets a next step with a date.",
        ],
      },
    ],
  },
  focus: {
    title: "What to focus on",
    defaults: [
      "One offer on one page.",
      "One number you check every Friday.",
      "This is how proof stacks — you keep starting over instead of deepening one lane.",
      "Past buyers and warm intros before new cold. Block delivery time — not more ‘pick your brain’ calls.",
    ],
    rules: [
      {
        id: "fo-buyer-metric",
        priority: 90,
        match: { allTags: ["buyer:metric"] },
        lines: [
          "Buyers think in the number you move.",
          "Your headline still sounds like a bio.",
          "This is why proposals bounce — the metric is buried.",
          "Put that number in the headline and every proposal header. One case slide with math per industry — cut generic praise quotes.",
        ],
      },
      {
        id: "fo-plan-vague",
        priority: 88,
        match: { allTags: ["plan:vague"] },
        lines: [
          "You have a task list — not a revenue plan.",
          "Busy replaces shipped.",
          "This is why quarters disappear — nothing is tied to a count.",
          "Pick one 90-day revenue target. Divide by weeks — that is ships per week. Put three ship weeks on the calendar now.",
        ],
      },
      {
        id: "fo-embarrass-narrow",
        priority: 86,
        match: { allTags: ["think:embrace_narrow"] },
        lines: [
          "One lane already closes.",
          "You keep entertaining everything else ‘just in case.’",
          "This is why you stay stretched thin — you never starve the wrong work.",
          "Say no to everything else for 30 days. Cut one audience or service line — publish the cut.",
        ],
      },
      {
        id: "fo-fear-narrow",
        priority: 84,
        match: { allTags: ["think:fear_narrow"] },
        lines: [
          "The smallest list is the one that already paid.",
          "You widen before you own the patch.",
          "This is why marketing feels scary — breadth is hiding weak proof.",
          "One case study that matches that list. Nothing broader until it runs.",
        ],
      },
      {
        id: "fo-reactivate",
        priority: 82,
        match: { allTags: ["slow:reactivate"] },
        lines: [
          "Past buyers are the asset.",
          "You chase strangers while the list goes cold.",
          "This is why revenue spikes and crashes — you ignore the people who already trust you.",
          "One email, one offer, one start date. Referrals only after a win is written with numbers.",
        ],
      },
      {
        id: "fo-scattered",
        priority: 48,
        match: { maxScore: { focus: 42 } },
        lines: [
          "You add channels before one page converts.",
          "Meetings eat the build time.",
          "This is why nothing finishes — you split the week and call it strategy.",
          "Ship one sellable page before you add a channel. Two half-days weekly, zero calls — guard them like client money.",
        ],
      },
    ],
  },
  first: {
    title: "What to do first",
    defaults: [
      "You already know the next move.",
      "You are stalling because the page is not real.",
      "This is why next week looks like last week — nothing ships without a dated artifact.",
      "Write one page: who it is for, what they get, price band, next start date.",
      "Send five past-buyer messages: one sentence each, one fixed offer, one link.",
      "Track one number weekly — booked calls or deposits — review it Fridays.",
    ],
    rules: [
      {
        id: "fi-stuck-split",
        priority: 94,
        match: { allTags: ["think:stuck", "work:split"] },
        lines: [
          "You are split across clients — and stuck.",
          "The last invoice already told you who pays.",
          "This is what is happening — you ignore the proof sitting in your bank feed.",
          "List who paid last. Pick the last invoice. Copy their words into a one-page offer.",
          "Book three calls only with that buyer type — decline everything else for one week.",
          "Ship one small paid thing in 48 hours — template, checklist, or short recording.",
        ],
      },
      {
        id: "fi-stuck",
        priority: 90,
        match: { allTags: ["think:stuck"] },
        lines: [
          "You are waiting for clarity.",
          "Clarity is in the last person who paid.",
          "This is why you spin — motion feels productive.",
          "Pick the last buyer who paid. Copy their words into a one-page offer.",
          "Book three calls only with people who match that buyer — decline new ideas on the call.",
          "Ship a dated mini-asset — checklist, template, or recording — in 48 hours.",
        ],
      },
      {
        id: "fi-plan-vague",
        priority: 88,
        match: { allTags: ["plan:vague"] },
        lines: [
          "You have goals — not a ship cadence.",
          "Cadence is what turns goals into cash.",
          "This is why the plan dissolves — nothing is on the calendar as a ship.",
          "Write a 90-day number. Divide by 12 — that is your weekly ship count.",
          "Schedule three ship weeks — block the time now.",
          "Tell one person the plan — they get a Friday text on what shipped.",
        ],
      },
      {
        id: "fi-ship-asset",
        priority: 86,
        match: { allTags: ["think:ship_asset"] },
        lines: [
          "The asset is 80% done.",
          "You keep adding sections instead of a buy line.",
          "This is why launches die — buyers never see a checkout.",
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
          "Your niche is not abstract — it is who already paid.",
          "You keep marketing to everyone while the receipts name the cluster.",
          "This is why messaging stays mushy — you skip the people who already voted.",
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
          "Inbound is thin — so you wait.",
          "Waiting is the leak.",
          "This is why the pipe stays empty — outreach never became a number.",
          "Twenty outreaches — one case, one ask, one link.",
          "Three past clients — ask for intros to a named role and pain.",
          "Publish one proof piece — name, number, before/after.",
        ],
      },
    ],
  },
};
