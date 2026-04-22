/**
 * Full $27 report copy per archetype. Loaded by results.html before inline boot.
 * @global
 */
(function (global) {
  var STRIPE_REPORT_27_BY_ARCH = {
    'ceiling-builder': 'https://buy.stripe.com/cNi6oHfZCfX0d5WbKj33W02',
    commodity: 'https://buy.stripe.com/00wcN500E5imd5WeWv33W03',
    'wrong-room': 'https://buy.stripe.com/dRm6oH3cQ7quc1S8y733W04',
    untranslated: 'https://buy.stripe.com/00w7sLbJmbGKaXO15F33W05',
    underpriced: 'https://buy.stripe.com/cNifZh5kY26a6Hy4hR33W06',
    scattered: 'https://buy.stripe.com/6oU8wPcNq3ae8PG3dN33W07',
    'foundation-first': 'https://buy.stripe.com/dRmfZhdRucKO3vm9Cb33W08'
  };

  var FULL = {
    'ceiling-builder': {
      displayName: 'The Ceiling Builder',
      diagnosis: 'Capacity maxed. Structure missing.',
      impact: 'Capacity ceiling = $5K–$20K/month without a fixed sequence.',
      reportCtaLead:
        'Capacity is not the problem. The missing sequence behind delivery is.\nThe Snapshot names the first step to write down, and the sequence that follows.',
      whatThisMeans: [
        'You are handling delivery directly.',
        'Each client changes the workflow.',
        '6–14 hours per week go into repeat setup and thinking work.',
        'Capacity sets the limit.',
        'At this level, revenue typically sits between $5K–$20K/month depending on volume.'
      ],
      signs: [
        'You have been fully booked and still questioned the numbers.',
        'You adjust pricing to manage workload, not to reflect value.',
        'You start each engagement by figuring it out again.'
      ],
      previews: {
        mean: 'Booked solid. Revenue flatlines. Every new yes adds hours.',
        signs: 'Calendar full · pricing trims load · each kickoff rebuilt from scratch.',
        deals: 'They get the outcome, choke on the process, stall when value has to become a number.',
        costing: '1–2 stalled deals a month · 6–14 hours/week in repeat setup · $2K–$8K+ left on the table.',
        haveNot: 'Diagnosis is clear; the fixed sequence and 48-hour breakdown on your business are not installed yet.',
        why: 'Quality lives in your real-time judgment, so every account needs interpretation and rebuild.',
        sale: 'They evaluate how work runs, how long it takes, and how consistent it is—without a sequence they stall.',
        leverage: 'One step you repeat every time, written once: order, inputs, outputs, timing—then reuse.',
        week: 'Document one real post-yes step as it actually runs. Run it on the next client, refine once, reuse.',
        fixed: 'Onboarding time drops, delivery steadies, pricing holds, capacity rises without more hours.',
        notfix: 'Does not pull new demand; it organizes what already works so demand converts cleaner.'
      },
      blocks: {
        deals: [
          'From your inputs, the drop is happening here:',
          'Buyer understands the outcome.',
          'Buyer cannot clearly explain the process.',
          'Buyer hesitates when translating value to price.',
          'That gap delays or kills the decision.'
        ],
        costing: {
          impactLabel: 'Estimated impact',
          bullets: [
            '1 to 2 delayed or stalled deals per month',
            '6 to 14 hours per week lost to repeat work',
            'Lower pricing tolerance in conversations',
            'Slower turnaround between clients'
          ],
          band: '$2K to $8K+ per month while capacity scales without a fixed sequence'
        },
        why: [
          'Your delivery depends on real-time judgment.',
          'Each client requires interpretation, adjustment, and rebuild.',
          'The system runs through you.'
        ],
        sale: [
          'Buyers are making decisions without a clear sequence to trust.',
          'They are evaluating how the work happens, how long it takes, and how consistent it is.',
          'When that is unclear: confidence drops, questions increase, decisions slow.'
        ],
        leverage: [
          'There is one step you repeat across every client.',
          'That step can be written once.',
          'That becomes your first system.'
        ],
        week: [
          'One action: pick one step you run in every client engagement. Write it exactly as you run it — order, inputs, outputs, timing. Run it on the next client, refine once, reuse. This is the first piece of structure.'
        ],
        fixed: [
          'Delivery runs on a defined sequence.',
          'Time per client drops.',
          'Capacity expands.',
          'Pricing holds.',
          'Work compounds instead of resetting.'
        ],
        notfix: [
          'This does not increase demand.',
          'This organizes what already works.',
          'Demand converts more consistently when structure is visible.'
        ]
      }
    },
    commodity: {
      displayName: 'The Interest Converter Gap',
      diagnosis: 'You get attention, but decisions break when money enters the conversation.',
      impact: '',
      reportCtaLead:
        'You are not short on interest. You are short on a line that survives price.\nThe Snapshot pressure-tests that line against your real pipeline.',
      whatThisMeans: [
        'Your offer creates interest but does not hold under comparison or self-justification.',
        'Once price or procurement shows up, the buyer cannot finish the sentence: why you, why now, why not the cheaper option.',
        'The buyer still needs you in the room to defend the pick because nothing on the page finishes that sentence without you.'
      ],
      signs: [
        'People ask how this is different from a named alternative and your answer lengthens every time.',
        'Proposals or verbal agreements stall the moment budget, procurement, or comparison enters.',
        'Pricing conversations reliably slow or reset momentum even when the discovery call felt strong.'
      ],
      previews: {
        mean: 'Interest is real; the money step still needs you live because the line is not comparison-proof.',
        signs: 'Differentiation questions stretch · verbal yes dies at procurement · price email resets momentum.',
        deals: 'They cannot repeat why you replace the alternative in one sentence their boss will accept.',
        costing: '1–3 qualified stalls/month post-interest · 8–12 hours/week on late decks and chase · $2K–$12K delayed.',
        haveNot: 'You have the story in calls; you do not have one packaged line and proof block that survives price alone.',
        why: 'Proof lives in calls and decks instead of a line that survives two browser tabs and a spreadsheet.',
        sale: 'Warm thread → budget or competitor named → buyer tries to self-justify → thread cools in email.',
        leverage: 'One replacement sentence: what you replace, for whom, outcome—proven without you present.',
        week: 'Ship one sentence + one proof block; put both above price on the next three outbound assets.',
        fixed: 'Faster money-step decisions, fewer post-yes stalls, same lead volume closes harder.',
        notfix: 'Does not fix cold volume or post-yes scope creep by itself.'
      },
      blocks: {
        deals: [
          'The break happens when the buyer tries to map your offer to budget, timeline, or an alternative without a single plain differentiator.',
          'They stall because they cannot repeat your edge in one sentence to finance, legal, or a partner.',
          'They agree in the room, then cool off when they try to justify the spend offline.'
        ],
        costing: {
          bullets: [
            '8 to 12 hours a week on late-stage calls, decks, and follow-ups after buyers go quiet post-pricing',
            '1 to 3 qualified deals a month stalling after strong early conversations',
            '$2K to $12K in monthly revenue left in think-about-it when comparison is not answered before price'
          ],
          band: '$2K to $12K delayed or lost monthly while the money-step story stays soft'
        },
        why: [
          'The strongest proof lives in calls and decks instead of in a line that survives a spreadsheet and two tabs.',
          'Buyers default to the cheapest clear option when your difference is not obvious in one pass.'
        ],
        sale: [
          'Interest builds',
          'Conversation tracks well',
          'Price or comparison enters',
          'Buyer pauses to self-justify',
          'They ask for one more round or another stakeholder',
          'Decision slows or dies in email'
        ],
        leverage: [
          'The leverage point is clarity under pressure: one sentence that names what you replace, for whom, and the measurable outcome.',
          'It must read true without you in the room.'
        ],
        week: [
          'One action: write that single sentence. Delete every line in your deck and page that does not prove it. Add one proof tied only to that outcome.'
        ],
        fixed: [
          'Faster decisions when money shows up',
          'Fewer ghosted proposals after verbal agreement',
          'Higher close rate on qualified conversations',
          'Less time re-selling after the pricing email'
        ],
        notfix: [
          'This does not fix demand if you are not getting conversations.',
          'This does not fix delivery if scope is still undefined after yes.',
          'This does not replace legal or procurement steps when those are required.'
        ]
      }
    },
    'wrong-room': {
      displayName: 'The Mismatch Engine',
      diagnosis: 'You are attracting work, but not the work you want.',
      impact: '',
      reportCtaLead:
        'Filtering is not rejection. It is how you protect margin.\nThe Snapshot names the filter chain that matches your real economics.',
      whatThisMeans: [
        'Your messaging pulls in buyers who are not set up to buy what you actually sell.',
        'You spend selling cycles translating, rescoping, or discounting instead of closing the right fit.',
        'Bad-fit volume fills the calendar so the buyers who match your economics never get a clean slot.'
      ],
      signs: [
        'Leads look busy on paper but skew low quality, low budget, or wrong expectations for your model.',
        'Budget or scope conversations routinely mismatch what you need to run the work well.',
        'You keep adjusting the offer downward to make a bad fit fit instead of disqualifying early.'
      ],
      previews: {
        mean: 'Busy pipeline, weak fit: you burn the same hours on buyers who cannot fund the model you want.',
        signs: 'Low-budget skew · scope fights before deposit · you shrink the offer to keep a bad lead alive.',
        deals: 'Losses are fit masked as timing: they were never going to fund the work you want on your terms.',
        costing: '10–18 hours/week on non-funding calls · 2–4 off-band proposals/month · $3K–$15K monthly left on the table while the wrong buyers keep booking.',
        haveNot: 'You see the mismatch; you do not have enforced disqualifiers and a front door that screens before deep calls.',
        why: 'Attention still beats fit at the top of the funnel, so the wrong buyers book first.',
        sale: 'Inbound spikes, fit is weak, you negotiate down, margin dies or the deal evaporates after effort.',
        leverage: 'Hard filters before attraction: who you are not for, stated where they click.',
        week: 'Write three disqualifiers you enforce before the first deep call; put them on the booking path.',
        fixed: 'Shorter calls, higher win rate on remaining volume, margin protected on wins.',
        notfix: 'Does not fix offer clarity for the right buyer or create net-new demand alone.'
      },
      blocks: {
        deals: [
          'The break happens when you realize the buyer cannot fund the work, cannot decide, or wanted a different product than you sell.',
          'You try to rescue the call because the pipeline looks empty, then you eat scope or discount to close anything.',
          'The last three losses were rarely price alone. They were fit masked as timing.'
        ],
        costing: {
          bullets: [
            '10 to 18 hours per week on calls that never reach deposit at your real price',
            '2 to 4 proposals a month written for buyers outside your stated band',
            '$3K to $15K in monthly revenue lost to discounting or micro-scopes to force a bad fit through'
          ],
          band: '$3K to $15K monthly left on the table while the wrong buyers keep booking'
        },
        why: [
          'Top-of-funnel copy and CTAs still welcome anyone with interest instead of routing the buyer you can actually serve.',
          'That forces you to sell education and negotiation before you ever sell delivery.'
        ],
        sale: [
          'Lead arrives',
          'They book',
          'You discover budget, authority, or problem mismatch',
          'You try to adapt the offer to fit',
          'They stall or push for a smaller buy',
          'You restart the cycle with another unqualified lead'
        ],
        leverage: [
          'The leverage point is filtering before attraction: say who you are not for where they click first.',
          'Hard filters beat another case study when the room is wrong.'
        ],
        week: [
          'One action: write your three no-go rules. Put them on the booking form and your pricing page in plain language.'
        ],
        fixed: [
          'Fewer wasted calls',
          'Higher win rate on what remains',
          'More margin because you stop shrinking scope to fit bad fits',
          'Clearer signal on which channels pull buyers who can pay'
        ],
        notfix: [
          'This does not fix vague positioning for the right buyer.',
          'This does not create inbound if volume is the real gap.',
          'This does not replace a tight offer once the right buyer shows up.'
        ]
      }
    },
    untranslated: {
      displayName: 'The Position Drift',
      diagnosis: 'Your work is strong, but your positioning is unclear or inconsistent.',
      impact: '',
      reportCtaLead:
        'Clarity is not a rebrand. It is one sentence buyers can repeat.\nThe Snapshot locks that sentence to your pipeline reality.',
      whatThisMeans: [
        'People do not know exactly what to come to you for.',
        'Warm relationships still convert faster than anything anonymous because the public story does not hold still.',
        'Cold traffic gets a moving target: different hooks, different pains, different implied products depending on where they clicked.'
      ],
      signs: [
        'Your last several clients look materially different in industry, problem, or entry point.',
        'Project types vary enough that delivery and case studies do not stack into one obvious lane.',
        'Referrals are inconsistent or you cannot predict who sends you work and why.'
      ],
      previews: {
        mean: 'Range reads as risk: buyers cannot name the one problem you own after one pass.',
        signs: 'Client mix all over the map · case studies do not stack · referrals have no repeatable sentence.',
        deals: 'They like your credibility but cannot map it to one buy their boss will sign off on.',
        costing: '5–12 hours/week reframing on calls · 1–2 deals/month lost to think while they shop narrower shops.',
        haveNot: 'You have proof of skill; you do not have one repeated headline problem-outcome line everywhere.',
        why: 'Multiple headline problems stay live in public, so every call becomes a custom positioning session.',
        sale: 'Skim → broad questions → you broaden to keep the thread → momentum leaks before price.',
        leverage: 'One owned lane: one problem, one buyer, one outcome, repeated across surfaces.',
        week: 'Write the single problem-outcome line; delete any homepage block that does not prove it above the fold.',
        fixed: 'Faster cold decisions, fewer positioning calls, better self-selection before they book.',
        notfix: 'Does not fix wrong-room traffic or delivery load after yes.'
      },
      blocks: {
        deals: [
          'The break happens when they like your credibility but cannot map it to a single urgent purchase.',
          'They ask for examples across multiple industries because your headline problem is not stable.',
          'They delay because picking you feels like picking a generalist when they wanted a specialist.'
        ],
        costing: {
          bullets: [
            '5 to 12 hours per week reframing the offer and rebuilding proof for each inbound type',
            '1 to 2 deals a month lost to need to think while they compare you to a narrower competitor',
            '$2K to $10K monthly in delayed revenue while buyers wait on a call to understand what you own'
          ],
          band: '$2K to $10K delayed monthly while positioning stays inconsistent'
        },
        why: [
          'You still publish and sell multiple headline problems without forcing one primary lane.',
          'That makes every conversation a custom design session before money moves.'
        ],
        sale: [
          'They discover you',
          'They skim',
          'They cannot repeat your lane',
          'They ask what else you do',
          'You broaden the answer to keep the conversation alive',
          'They stall because the buy never feels obvious'
        ],
        leverage: [
          'The leverage point is fixing what you are known for: one problem, one buyer, one outcome, repeated everywhere.',
          'Everything else becomes supporting proof, not a second headline.'
        ],
        week: [
          'One action: write that single problem-outcome line. Remove any homepage section that does not prove it in the first screen.'
        ],
        fixed: [
          'Faster decisions from cold traffic',
          'Fewer repeat positioning calls',
          'Higher quality leads because misfits self-select out',
          'Clearer referral language people can actually use'
        ],
        notfix: [
          'This does not fix demand if nobody is arriving.',
          'This does not replace proof if the claim is stronger than delivery.',
          'This does not fix pricing strategy by itself.'
        ]
      }
    },
    underpriced: {
      displayName: 'The Visibility Gap',
      diagnosis: 'You are capable, but not visible where it matters.',
      impact: '',
      reportCtaLead:
        'Capability without signal does not compound.\nThe Snapshot ties your first public proof lane to the economics you want.',
      whatThisMeans: [
        'Your ability is not translating into opportunity at the rate your skill deserves.',
        'Decisions still route through referrals or luck because the market cannot see how you think before they buy.',
        'Buyers research you between touches; thin public proof reads as empty inventory and the thread goes cold.'
      ],
      signs: [
        'Inbound is thin or spiky even though your delivery quality is strong.',
        'You have no consistent visibility cadence across the channels your buyers actually use.',
        'You rely on referrals as the primary source of real opportunities.'
      ],
      previews: {
        mean: 'Calls feel premium; your public trail does not show how you think before they pay.',
        signs: 'Spiky inbound · no weekly cadence · referrals carry most real pipeline.',
        deals: 'They like you live, then cool off when research turns up thin or scattered proof.',
        costing: '6–14 hours/week on manual intros · 1–2 opportunities/month lost in the research gap.',
        haveNot: 'You have judgment; you do not have three forwardable public pieces on one owned problem.',
        why: 'Publishing stays optional while delivery stays mandatory, so buyers only see you in private.',
        sale: 'Good call → they search → proof gap → they ask for references instead of moving.',
        leverage: 'One owned problem on a weekly cadence with artifacts buyers can forward.',
        week: 'Ship three pieces in seven days on the same problem; stop editing for perfect.',
        fixed: 'More qualified inbound, shorter trust cycles, cleaner premium justification.',
        notfix: 'Does not fix fuzzy offers, wrong-room traffic, or post-yes systems.'
      },
      blocks: {
        deals: [
          'The break happens when the buyer likes you in the room but cannot find three public artifacts that prove the claim.',
          'They delay because hiring you still feels like a leap instead of a logical next step.',
          'They compare you to louder operators with weaker work because signal beats silence in discovery.'
        ],
        costing: {
          bullets: [
            '6 to 14 hours per week on manual networking, intros, and explaining the same credibility story live',
            '1 to 2 qualified opportunities a month lost to cooling off during research',
            '$2K to $10K monthly in delayed revenue while buyers wait for visible proof you have not shipped'
          ],
          band: '$2K to $10K delayed monthly while visibility stays inconsistent'
        },
        why: [
          'You still treat publishing as optional while treating delivery as mandatory.',
          'That hides your judgment until a call, which caps how many buyers you can convert per month.'
        ],
        sale: [
          'They hear about you',
          'They search',
          'They find thin or scattered proof',
          'They ask for references instead of moving',
          'You send more private artifacts',
          'Momentum dies in the research gap'
        ],
        leverage: [
          'The leverage point is signal creation: one owned problem, published on a weekly cadence, with artifacts buyers can forward.',
          'Stop polishing private decks until there are three public pieces that prove the claim you make on calls.'
        ],
        week: [
          'One action: ship three pieces in seven days on the same problem. Publish for proof, not polish.'
        ],
        fixed: [
          'More qualified inbound',
          'Shorter trust-building cycles',
          'Fewer credibility debates on calls',
          'A library you can reuse in sales and delivery'
        ],
        notfix: [
          'This does not fix positioning drift if your story still changes by week.',
          'This does not fix wrong-room leads.',
          'This does not replace delivery systems after yes.'
        ]
      }
    },
    scattered: {
      displayName: 'The Offer Fragmentation',
      diagnosis: 'You have too many offers or unclear paths to buy.',
      impact: '',
      reportCtaLead:
        'More doors do not create more revenue. They create hesitation.\nThe Snapshot forces one primary path without guessing away revenue.',
      whatThisMeans: [
        'Buyers hesitate because the path is unclear.',
        'Every extra entry point becomes a second decision they have to make before they make the first decision.',
        'Your own CTAs compete: buyers pick the smallest buy to reduce risk, then never graduate to the work you want.'
      ],
      signs: [
        'You run multiple offers with overlap and buyers ask which one they need.',
        'Pricing logic is hard to explain without a call because tiers do not map to one obvious first step.',
        'Sales conversations include confusion about what is included, what is next, or what to buy first.'
      ],
      previews: {
        mean: 'Too many doors: buyers freeze or buy the micro-offer and never level up.',
        signs: 'Which one do I need? · pricing needs a call to parse · scope confusion on every thread.',
        deals: 'They compare your SKUs against each other and pick the safe small buy or walk.',
        costing: '6–12 hours/week rebuilding pitches · 1–2 deals/month lost to option paralysis · $2K–$9K in undersized first buys.',
        haveNot: 'You have options; you do not have one primary route repeated on every public click.',
        why: 'Every path carries its own copy and proof, so buyers debate your menu before they debate competitors.',
        sale: 'Curiosity → browse → split messages → which should I pick? → delay or downsell.',
        leverage: 'One primary offer, one landing page, one CTA for a fixed window; everything else manual.',
        week: 'List every public CTA URL; point all to the single entry offer for 30 days or remove the link.',
        fixed: 'Higher first ticket, faster decisions, cleaner analytics, less proposal rework.',
        notfix: 'Does not fix weak demand, weak core offer, or delivery after yes.'
      },
      blocks: {
        deals: [
          'The break happens when they like your thinking but cannot pick which product to start with.',
          'They compare your own offers against each other and pick the cheapest entry to reduce risk.',
          'You lose time writing custom bridges between services you never packaged as one path.'
        ],
        costing: {
          bullets: [
            '6 to 12 hours per week rebuilding the pitch for each inbound type',
            '1 to 2 deals a month lost to not sure which option instead of a hard no',
            '$2K to $9K monthly in undersized first buys because buyers pick the safe micro-offer'
          ],
          band: '$2K to $9K monthly left in fragmented first buys'
        },
        why: [
          'You still list multiple products, lead magnets, and tiers in public without a single recommended first buy.',
          'Each path has its own copy and proof, so buyers compare your offers against each other before they compare you to competitors.',
          'You improvise a custom bridge on every call, which keeps hesitation attached to your calendar instead of a fixed first step.'
        ],
        sale: [
          'Curiosity builds',
          'They explore',
          'They see split messages',
          'They ask which to pick',
          'They see no recommended first step',
          'They delay or downsize'
        ],
        leverage: [
          'The leverage point is simplifying entry: one primary offer, one landing page, one CTA for a fixed window.',
          'Everything else becomes a manual exception, not a public door.'
        ],
        week: [
          'One action: list every public CTA URL. Point all of them to the single entry offer for 30 days or remove the link.'
        ],
        fixed: [
          'Faster decisions',
          'Higher first-ticket size',
          'Clearer analytics on what pulls',
          'Less proposal rework'
        ],
        notfix: [
          'This does not fix offer quality if the primary product is weak.',
          'This does not fix demand.',
          'This does not fix delivery once they pick the main path.'
        ]
      }
    },
    'foundation-first': {
      displayName: 'The Dependency Trap',
      diagnosis: 'You are the system of record. Every delivery routes through your calendar.',
      impact: '',
      reportCtaLead:
        'The goal is not more hustle. It is removing one load-bearing step.\nThe Snapshot finds the step that unlocks the rest without breaking delivery.',
      whatThisMeans: [
        'Everything slows or breaks without your direct involvement.',
        'That caps growth because your calendar becomes the system of record for quality, speed, and decisions.',
        'Hiring or tooling does not help until the repeatable steps exist outside your head with an owner and a quality check.'
      ],
      signs: [
        'You are constantly pulled into delivery, approvals, or client communication that could run without you.',
        'Delegation is rare, inconsistent, or snaps back to you under pressure.',
        'Delivery quality or timelines swing when your availability swings.'
      ],
      previews: {
        mean: 'You are the system of record: throughput follows your inbox, not a checklist.',
        signs: 'Constant pulls on delivery · delegation snaps back · timelines swing with your availability.',
        deals: 'Buyers sense they are buying your queue, not a machine; expansion gets cautious.',
        costing: '8–16 hours/week in interrupts and status ping-pong · growth bets skipped on capacity.',
        haveNot: 'You know what repeats; you do not have one step fully handed off with a written SOP and quality check.',
        why: 'Repeatable work still lives in your head, so hiring cannot attach to a stable surface.',
        sale: 'They buy you → delivery leans on you → delays show → renewals tighten.',
        leverage: 'One repeatable weekly step: named owner, artifact, quality bar, off your thread twice.',
        week: 'Pick one weekly repeat you still do; one-page SOP, assign owner, run two cycles without you in CC.',
        fixed: 'Stable timelines, fewer bottlenecks, more sellable capacity, lower burnout risk.',
        notfix: 'Does not fix broken offers, empty pipeline, or hiring when you are past physical limits.'
      },
      blocks: {
        deals: [
          'The break happens when buyers need certainty you can scale delivery and your calendar says otherwise.',
          'They stall because onboarding still feels like joining your private queue instead of entering a system.',
          'Expansion deals die because you cannot honestly promise throughput without cloning yourself.'
        ],
        costing: {
          bullets: [
            '8 to 16 hours per week lost to interrupts, approvals, and rework that should be asynchronous',
            '1 to 2 growth bets per quarter skipped because capacity is pinned to you',
            '$2K to $12K monthly in opportunity cost while revenue stays capped by your hours'
          ],
          band: '$2K to $12K monthly in trapped upside while dependency stays load-bearing'
        },
        why: [
          'You still own too many decisions that repeat every week without a documented owner and artifact.',
          'That makes the business fragile whenever your availability drops.'
        ],
        sale: [
          'They buy access to you',
          'Delivery starts',
          'Questions route to you',
          'Throughput depends on your calendar',
          'They feel delays',
          'Expansion or renewal gets cautious'
        ],
        leverage: [
          'The leverage point is removing yourself from one repeatable step: the same question you answer three times a week belongs in a checklist or a delegate.',
          'Pick one step only. Finish the handoff before optimizing anything else.'
        ],
        week: [
          'One action: choose one repeatable weekly task you still do personally. Write the SOP in one page, assign an owner, and run it twice without you in the thread.'
        ],
        fixed: [
          'More stable delivery timelines',
          'Fewer bottlenecks on your calendar',
          'Cleaner capacity to sell and serve',
          'Lower operational risk when you are unavailable'
        ],
        notfix: [
          'This does not fix a broken offer.',
          'This does not create inbound by itself.',
          'This does not replace hiring when you are past physical limits.'
        ]
      }
    }
  };

  global.StephuaryArchetypeReport = {
    STRIPE_REPORT_27_BY_ARCH: STRIPE_REPORT_27_BY_ARCH,
    FULL: FULL
  };
})(typeof window !== 'undefined' ? window : this);
