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
      diagnosis: 'You are at capacity, but revenue and repeatability are not scaling.',
      impact: 'You are doing the work of a business that should earn 1.5x to 2x more on the same calendar.',
      whatThisMeans: [
        'You solve each engagement as it arrives instead of using a defined sequence.',
        'That keeps quality high, but it caps throughput, hides margin leaks, and ties delivery to you.'
      ],
      signs: [
        'Your calendar stays full while profit per hour stays flat or hard to read in your books.',
        'You add custom steps to delivery because the written process does not match what you actually run.',
        'Kickoff calls still reuse questions you already answered for the last three clients.'
      ],
      previews: {
        deals: 'Deals stall when buyers cannot see the same delivery twice before they pay.',
        costing: 'You are burning 6 to 14 hours a week rescoping, re-explaining, and patching handoffs.',
        why: 'Delivery still depends on you to interpret scope instead of a fixed sequence everyone follows.',
        sale: 'Confidence drops when the process, timeline, and owner of each step are not explicit.',
        leverage: 'One written sequence for the first 14 days after yes removes half the back-and-forth.',
        week: 'Pick the step you repeat on every client after payment. Write it once, then reuse it verbatim.',
        fixed: 'Margin per project rises, cycle time drops, and you can onboard without inventing the path each time.',
        notfix: 'This does not fix demand. It does not replace hiring if you are already past your hour cap.'
      },
      blocks: {
        deals: [
          'The break happens when the buyer tries to picture the same delivery twice and only sees your last custom run.',
          'They compare you to cheaper operators who sell a repeatable box. You sell judgment on demand.',
          'They pause because they cannot budget time or outcome the way they can with a fixed sequence.'
        ],
        costing: {
          bullets: [
            '6 to 14 hours per week lost to rescoping and re-explaining after verbal yes',
            '1 to 2 extra weeks of cycle time per deal while you rebuild the path in your head',
            '$4K to $18K per month in delayed or smaller closes when buyers need certainty you have not documented'
          ],
          band: '$4K to $18K delayed or lost monthly until the sequence is fixed'
        },
        why: [
          'Your offer, delivery, and QA still lean on manual judgment instead of a locked checklist and template pack.',
          'That forces you to re-decide quality and scope on every account, which shows up as busy work, not growth.'
        ],
        sale: [
          'Interest builds',
          'You show past wins',
          'They ask how it will run for them',
          'You answer with nuance',
          'They pause to compare',
          'Decision slows until they get certainty'
        ],
        leverage: [
          'The leverage point is not more hours. It is one repeatable post-yes sequence that removes confusion, delay, and rework.',
          'Ship it as a single doc or page clients see the day they pay.'
        ],
        week: [
          'One action: list the five steps you always run in the first 14 days after payment. Put them in order with one owner and one artifact each. Send that list to your next prospect before they sign.'
        ],
        fixed: [
          'Faster decisions because buyers see a fixed path',
          'Fewer scope fights because steps are named up front',
          'Cleaner delivery because the team follows the same file',
          'More margin because you stop rebuilding the plan per client'
        ],
        notfix: [
          'This does not fix demand if inbound is thin.',
          'This does not replace a hire if you are already past physical hour limits.',
          'This does not rewrite positioning if the wrong buyers are the ones saying yes.'
        ]
      }
    },
    commodity: {
      displayName: 'The Commodity Pull',
      diagnosis: 'Your offer gets attention, but decisions break when comparison starts.',
      impact: 'You are losing decisions after interest is already earned.',
      whatThisMeans: [
        'You still sound interchangeable until price lands.',
        'Then the buyer defaults to the cheapest clear option because your difference is not obvious in one pass.'
      ],
      signs: [
        'You have cut price at least once in the last 90 days to save a deal you still believe was strong.',
        'Buyers ask how you differ from a named alternative and you need more than two sentences to answer.',
        'Your best proof lines could sit on a competitor site with a name swap.'
      ],
      previews: {
        deals: 'Deals die at the compare step when your difference is not stated in one plain line.',
        costing: 'You are losing 1 to 3 qualified opportunities a month to stall, not to "bad leads."',
        why: 'The offer still needs a live explanation instead of a sharp replacement story.',
        sale: 'Interest builds, talk tracks well, price enters, buyer pauses, comparison starts, decision slows.',
        leverage: 'One line that names what you replace beats ten lines of features.',
        week: 'Write the single outcome you replace and the metric you move. Put both above price on every page and deck.',
        fixed: 'Faster decisions, fewer price-only objections, higher win rate on qualified calls.',
        notfix: 'This does not fix lead volume. It does not fix delivery if scope is still vague after yes.'
      },
      blocks: {
        deals: [
          'The failure point is the moment they open two tabs and try to justify you beside a cheaper option.',
          'If your line does not finish the sentence "Instead of X, we do Y," they stall.',
          'They ghost after a strong call because they cannot repeat your edge to a boss or partner.'
        ],
        costing: {
          bullets: [
            '8 to 12 hours a week on extra calls and follow-up decks after buyers go quiet',
            '1 to 3 qualified deals a month stall after verbal interest',
            '$2K to $12K in monthly revenue left in "think about it" when comparison is not answered early'
          ],
          band: '$2K to $12K delayed or lost monthly while comparison stays vague'
        },
        why: [
          'Your offer, proof, and pricing still depend on explanation instead of a sharp replacement claim.',
          'Buyers pause because they cannot defend the pick to anyone else in the room.'
        ],
        sale: [
          'Interest builds',
          'Conversation is strong',
          'Price enters',
          'Buyer pauses',
          'Comparison starts',
          'Decision slows'
        ],
        leverage: [
          'The leverage point is one plain sentence: what you replace, for whom, and the measurable outcome.',
          'Put it before price everywhere the buyer decides.'
        ],
        week: [
          'One action: take your last proposal and delete every line that does not support the replacement sentence. Add one proof point tied to that outcome only.'
        ],
        fixed: [
          'Faster decisions',
          'Fewer price-only stalls',
          'Higher close rate on the same lead count',
          'Less time re-explaining on late-stage calls'
        ],
        notfix: [
          'This does not fix demand if traffic is cold or off-market.',
          'This does not fix a weak offer if delivery cannot hit the claim.',
          'This does not remove the need for clear scope after yes.'
        ]
      }
    },
    'wrong-room': {
      displayName: 'The Wrong Room',
      diagnosis: 'You are attracting work, but the work does not match the business you want.',
      impact: 'The gap is not effort. It is who gets through your front door.',
      whatThisMeans: [
        'You still earn engagement from people who will not buy at your price or fit.',
        'That crowds out time for buyers who already match your best work.'
      ],
      signs: [
        'You run discovery calls where you spend half the time proving the problem exists.',
        'Referrals close faster than inbound from your site or content by a wide margin.',
        'You get praise in comments or DMs but those threads rarely turn into deposits.'
      ],
      previews: {
        deals: 'Deals die when the person across from you was never set up to buy at your terms.',
        costing: 'You are spending 10 to 18 hours a week on calls that will not fund the model you run.',
        why: 'Marketing still speaks to a broad audience instead of a named buyer with budget and urgency.',
        sale: 'Traffic arrives, interest looks high, fit is weak, you negotiate scope down, deal dies or drains margin.',
        leverage: 'One disqualifier in the first five minutes saves more revenue than another case study.',
        week: 'Write three hard filters: budget band, decision owner, and timeline. Ask them on the booking form.',
        fixed: 'Cleaner pipeline, shorter calls, higher close rate with the same calendar hours.',
        notfix: 'This does not fix offer clarity if the right buyer still cannot repeat what you sell.'
      },
      blocks: {
        deals: [
          'The break happens when you realize the prospect cannot fund the work, cannot decide, or came for free education.',
          'You keep trying to convert them because the pipeline looks empty.',
          'The last three losses were not price. They were fit masked as "timing."'
        ],
        costing: {
          bullets: [
            '10 to 18 hours per week on calls that never reach deposit',
            '2 to 4 extra proposals a month for buyers outside your stated band',
            '$3K to $15K in monthly revenue lost to discounting or tiny scopes to make bad fits fit'
          ],
          band: '$3K to $15K monthly left on the table while the room stays wrong'
        },
        why: [
          'Your top-of-funnel still accepts anyone who shows interest instead of routing budgeted buyers first.',
          'That forces you to sell education before you ever sell delivery.'
        ],
        sale: [
          'Inbound arrives',
          'They book',
          'You discover no budget or wrong problem',
          'You try to rescue the call',
          'They leave for a cheaper fix',
          'You restart the cycle'
        ],
        leverage: [
          'The leverage point is a hard filter in the first touch so the wrong room never books.',
          'Say who you are not for in plain language on the same surface they click from.'
        ],
        week: [
          'One action: add three required fields to your booking form: budget range, role of attendee, and deadline. Auto-decline anything outside your band.'
        ],
        fixed: [
          'Fewer wasted calls',
          'Higher win rate on what remains',
          'More margin because you stop shrinking scope to fit bad fits',
          'Clearer signal on what content actually pulls buyers'
        ],
        notfix: [
          'This does not fix positioning language if the offer is still vague for the right buyer.',
          'This does not create demand if volume is the real issue.',
          'This does not replace a tight offer once the right buyer shows up.'
        ]
      }
    },
    untranslated: {
      displayName: 'The Untranslated Offer',
      diagnosis: 'Strangers still cannot repeat what you sell after they read your main pages.',
      impact: 'Revenue is being capped by how long it takes a cold buyer to understand the buy.',
      whatThisMeans: [
        'People who already know you get it. People who do not get noise.',
        'That pushes real decisions back to live calls you do not have time to scale.'
      ],
      signs: [
        'Cold visitors ask basic questions your hero section was supposed to answer.',
        'You give a different two-sentence pitch depending on who asked.',
        'Warm intros convert faster than anything from anonymous traffic.'
      ],
      previews: {
        deals: 'Deals die when the buyer cannot state your offer back in one sentence after skimming.',
        costing: 'You are spending 5 to 12 hours a week answering repeat questions that belong on the page.',
        why: 'The written layer still hides the product, price, and next click behind story and credentials.',
        sale: 'Skim happens, confusion shows up in chat, you jump on a call, energy drops when they still cannot name the buy.',
        leverage: 'One above-the-fold line that names product, buyer, and outcome beats a long story.',
        week: 'Rewrite the first screen: product name, who it is for, price band, next action. No scrolling required.',
        fixed: 'Shorter sales cycles, fewer unqualified calls, cleaner inbound questions.',
        notfix: 'This does not fix wrong-room traffic. It does not fix delivery after yes.'
      },
      blocks: {
        deals: [
          'The break happens on the first skim when they cannot finish the sentence "I would buy ___."',
          'They stall because they are not sure what is included, what it costs, or what happens next.',
          'They ask for another call instead of a contract because the page never closed the loop.'
        ],
        costing: {
          bullets: [
            '5 to 12 hours per week in repeat explanations and DM clarifications',
            '1 to 2 deals a month lost to "need to think" after a page that should have sold the click',
            '$2K to $10K monthly in delayed revenue while buyers wait on a call to understand the offer'
          ],
          band: '$2K to $10K delayed monthly while clarity stays buried'
        },
        why: [
          'Your offer still depends on live translation because the static copy never states the buy in plain terms.',
          'That shifts work to calls you cannot clone.'
        ],
        sale: [
          'They land',
          'They skim',
          'They cannot name the product',
          'They ping you',
          'You explain live',
          'They delay because they still cannot forward the page'
        ],
        leverage: [
          'The leverage point is a single first-screen module: product, buyer, outcome, price band, next click.',
          'Everything else supports that block, not the other way around.'
        ],
        week: [
          'One action: open your homepage on a phone you do not own. If you cannot tap buy in 20 seconds, rewrite the top until you can.'
        ],
        fixed: [
          'Faster decisions',
          'Fewer repeat questions',
          'Higher quality calls because people arrive pre-sold on the basics',
          'More signal on which channel actually brings buyers'
        ],
        notfix: [
          'This does not fix positioning if you are talking to the wrong market.',
          'This does not replace proof if the claim is stronger than the work.',
          'This does not fix pricing strategy by itself.'
        ]
      }
    },
    underpriced: {
      displayName: 'The Underpriced Stack',
      diagnosis: 'You are billing for effort while the outcome you deliver is worth more than the invoice.',
      impact: 'Margin is leaking on every project where scope quietly grows after the price is set.',
      whatThisMeans: [
        'You add work after the number is fixed because renegotiating feels slower than absorbing it.',
        'That trains buyers to expect more for the same wire amount.'
      ],
      signs: [
        'You have raised scope without a change order more than once in the last quarter.',
        'Clients have said the result was worth more than they paid without you prompting.',
        'You have told yourself you should raise prices in the last 90 days and did not book the conversation.'
      ],
      previews: {
        deals: 'Deals do not break at hello. They break when scope expands and the invoice stays flat.',
        costing: 'You are giving away 10 to 25% of effective margin in silent scope creep each month.',
        why: 'Scope and price are not tied to named deliverables the client signs per change.',
        sale: 'Yes happens, work starts, requests pile on, you absorb cost, resentment builds, next renewal gets brittle.',
        leverage: 'One change-order rule you enforce on the next three deals recovers more cash than a rebrand.',
        week: 'List three scope items you gave away free last month. Put a price on each and add them to your template as optional lines.',
        fixed: 'Higher average ticket, fewer free hours, cleaner renewals, clearer boundaries.',
        notfix: 'This does not fix demand. It does not fix positioning if buyers still pick you on price alone.'
      },
      blocks: {
        deals: [
          'The break happens after yes when new requests hit and the contract price never moves.',
          'Buyers assume the extras are included because you never named what was out of scope.',
          'You eat hours to keep peace, then you rush quality on the next client to catch up.'
        ],
        costing: {
          bullets: [
            '4 to 10 hours per week in unpaid scope you never invoiced',
            '$1.5K to $8K per month in margin left inside projects you already won',
            '10 to 20% effective discount on your real rate when hours are buried in "small favors"'
          ],
          band: '$1.5K to $8K monthly margin leak on current clients'
        },
        why: [
          'Pricing, scope, and change requests are not written as a single linked system.',
          'So every new ask defaults to free unless you fight for it in the moment.'
        ],
        sale: [
          'Deal closes',
          'Delivery starts',
          'Requests arrive',
          'You say yes without a ticket',
          'Hours stack',
          'Renewal or referral gets tense'
        ],
        leverage: [
          'The leverage point is a written change path with a price for the top five extras you see every quarter.',
          'Send it with the welcome packet, not after the fight starts.'
        ],
        week: [
          'One action: add a "Changes" section to your SOW with three priced add-ons you already gave away for free. Send it on the next kickoff.'
        ],
        fixed: [
          'More margin on the same clients',
          'Fewer surprise asks',
          'Cleaner delivery calendars',
          'Faster invoices because scope matches the number'
        ],
        notfix: [
          'This does not fix positioning if buyers still think you are the cheap option.',
          'This does not fix demand.',
          'This does not replace legal review if contracts are complex.'
        ]
      }
    },
    scattered: {
      displayName: 'The Scattered Focus',
      diagnosis: 'Your pipeline and content point at different problems, so buyers cannot name what you own.',
      impact: 'You are paying an attention tax every time someone has to guess which offer to pick.',
      whatThisMeans: [
        'You run more than one promise in public without a clear bridge between them.',
        'That forces you to reframe the business on every call instead of repeating one sharp line.'
      ],
      signs: [
        'Your last five clients had different industries, pains, or entry points.',
        'Someone who read you for months still asked what you actually sell.',
        'You maintain two or more offers that do not reference each other in the buyer journey.'
      ],
      previews: {
        deals: 'Deals stall when buyers cannot map your offers to their exact problem fast enough.',
        costing: 'You are losing 6 to 12 hours a week reframing and rebuilding pitches per segment.',
        why: 'There is no single headline problem the brand repeats everywhere.',
        sale: 'Interest arrives, they browse, they see multiple doors, they freeze, they pick nothing or the smallest buy.',
        leverage: 'One primary offer with a single headline problem clears more revenue than three half-built paths.',
        week: 'Pick one offer for 30 days. Point every CTA to it. Move the others behind a manual reply.',
        fixed: 'Cleaner inbound questions, faster calls, better content signal, less rework on proposals.',
        notfix: 'This does not fix delivery systems. It does not remove the need for real demand.'
      },
      blocks: {
        deals: [
          'The break happens when they like your thinking but cannot pick which product to start with.',
          'They compare your own offers against each other and pick the cheapest entry.',
          'You lose time writing custom bridges between services you never packaged as one path.'
        ],
        costing: {
          bullets: [
            '6 to 12 hours per week rebuilding the pitch for each inbound type',
            '1 to 2 deals a month lost to "not sure which option" instead of a hard no',
            '$2K to $9K monthly in smaller starting buys because buyers pick the safe micro-offer'
          ],
          band: '$2K to $9K monthly left in undersized first buys'
        },
        why: [
          'You still publish and sell multiple unrelated entry points without a forced primary route.',
          'That makes every conversation a custom design session before money moves.'
        ],
        sale: [
          'Curiosity builds',
          'They explore',
          'They see split messages',
          'They ask which to pick',
          'You improvise',
          'They delay or downsize'
        ],
        leverage: [
          'The leverage point is one primary path for 30 days: one landing page, one CTA, one calendar.',
          'Everything else becomes a manual exception, not a public door.'
        ],
        week: [
          'One action: list every public CTA URL you have. Circle the one that paid last quarter. Point the rest to that URL or take them down for 30 days.'
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
      displayName: 'The Foundation Gap',
      diagnosis: 'You keep changing the plan before the last plan had time to show a number.',
      impact: 'Revenue swings because nothing in the stack runs long enough to compound.',
      whatThisMeans: [
        'You reset positioning, channel, or offer before you have 90 days of clean data on the prior choice.',
        'That makes every month feel like a new launch instead of a tuned machine.'
      ],
      signs: [
        'You have shipped a reposition or new offer twice in the last year without a clear revenue step after each.',
        'Month-to-month revenue moves more than 25% without a tracked cause you can point to on paper.',
        'You have paid for strategy or coaching that gave insight but no enforced execution window after.'
      ],
      previews: {
        deals: 'Deals stall when buyers sense you are still experimenting with what you sell.',
        costing: 'You are losing 8 to 15 hours a week to rework and tool churn instead of client output.',
        why: 'Nothing stays stable long enough for a repeatable sales and delivery loop to form.',
        sale: 'Excitement, quick yes on small tests, doubt when timelines slip, ghost when the next idea ships.',
        leverage: 'One 90-day freeze on net-new ideas clears more cash than another vision reset.',
        week: 'Pick one metric (cash collected or booked calls). Track it weekly on paper. No new offers until week 5.',
        fixed: 'Smoother revenue, fewer half-built assets, clearer read on what actually moved the number.',
        notfix: 'This does not fix a broken offer. It does not fix cold demand. It does not replace measurement tools later.'
      },
      blocks: {
        deals: [
          'The break happens when buyers smell that your offer, timeline, or scope is still moving while they are deciding.',
          'They wait for a stable story. You ship another tweak before they commit.',
          'The last three near-misses cited timing while you were mid-pivot.'
        ],
        costing: {
          bullets: [
            '8 to 15 hours per week lost to rework, tool swaps, and half-finished pages',
            '1 to 2 launches a quarter abandoned before measurement',
            '$2K to $11K monthly in opportunity cost while attention resets instead of compounds'
          ],
          band: '$2K to $11K monthly in churned focus and relaunch tax'
        },
        why: [
          'You still change multiple variables at once: audience, message, channel, or offer.',
          'No single variable gets a long enough run to prove or kill it.'
        ],
        sale: [
          'Interest spikes on a new idea',
          'Small tests start',
          'You change the angle',
          'Momentum drops',
          'Buyers wait',
          'You restart with another idea'
        ],
        leverage: [
          'The leverage point is a 90-day hold on net-new positioning or SKUs while you force one path to cash.',
          'You measure weekly, you do not redesign weekly.'
        ],
        week: [
          'One action: write the one offer you will sell for the next 90 days. Archive every other sales page behind a password. Send the link to five buyers you already know.'
        ],
        fixed: [
          'Cleaner forecasting',
          'Fewer half-built assets',
          'Faster learning because variables stop colliding',
          'More trust from buyers who see a stable story'
        ],
        notfix: [
          'This does not fix a bad core offer.',
          'This does not create inbound by itself.',
          'This does not replace delivery fixes once the offer is stable.'
        ]
      }
    }
  };

  global.StephuaryArchetypeReport = {
    STRIPE_REPORT_27_BY_ARCH: STRIPE_REPORT_27_BY_ARCH,
    FULL: FULL
  };
})(typeof window !== 'undefined' ? window : this);
