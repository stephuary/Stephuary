/**
 * Stephuary · shared result object for stephuary_result_v1
 * Phase 01 scoring matches capture.html (scoreArchetype).
 */
(function (global) {
  var STORAGE_KEY = 'stephuary_result_v1';

  var ARCHETYPES = [
    'Pattern Suppressor',
    'Unspoken Operator',
    'Wrong Environment Operator',
    'Live Stabilizer',
    'Aware but Idle',
    'Precision Refiner',
    'System Rebuilder'
  ];

  var TOTAL_Q = 10;

  function scoreArchetype(bits) {
    var s = {};
    ARCHETYPES.forEach(function (a) {
      s[a] = 0;
    });

    function w(step, choice, table) {
      var k = choice === 0 ? 'a' : 'b';
      if (table[step] && table[step][k]) {
        Object.keys(table[step][k]).forEach(function (name) {
          s[name] += table[step][k][name];
        });
      }
    }

    var T = [
      { a: { 'Unspoken Operator': 2, 'Pattern Suppressor': 1 }, b: { 'Precision Refiner': 2, 'System Rebuilder': 1 } },
      { a: { 'System Rebuilder': 3, 'Precision Refiner': 1 }, b: { 'Live Stabilizer': 3 } },
      { a: { 'Precision Refiner': 3 }, b: { 'System Rebuilder': 3 } },
      { a: { 'Live Stabilizer': 1 }, b: { 'Unspoken Operator': 2, 'Pattern Suppressor': 1 } },
      { a: { 'Live Stabilizer': 2 }, b: { 'Precision Refiner': 3 } },
      { a: { 'System Rebuilder': 3 }, b: { 'Live Stabilizer': 2 } },
      { a: { 'Unspoken Operator': 3, 'Pattern Suppressor': 2 }, b: { 'Live Stabilizer': 2 } },
      { a: { 'Aware but Idle': 3, 'Pattern Suppressor': 1 }, b: { 'Live Stabilizer': 3 } },
      { a: { 'Wrong Environment Operator': 4 }, b: { 'Live Stabilizer': 2, 'Precision Refiner': 1 } },
      { a: { 'Aware but Idle': 3 }, b: { 'System Rebuilder': 2, 'Precision Refiner': 1 } }
    ];

    for (var i = 0; i < TOTAL_Q; i++) {
      var tbl = {};
      tbl[i] = T[i];
      w(i, bits[i], tbl);
    }

    var best = ARCHETYPES[0];
    var max = -1;
    ARCHETYPES.forEach(function (a) {
      if (s[a] > max) {
        max = s[a];
        best = a;
      }
    });
    var tie = ARCHETYPES.filter(function (a) {
      return s[a] === max;
    });
    if (tie.length > 1) {
      if (bits[6] === 0) best = tie.indexOf('Unspoken Operator') >= 0 ? 'Unspoken Operator' : tie[0];
      else if (bits[8] === 0) best = 'Wrong Environment Operator';
      else if (bits[9] === 0) best = tie.indexOf('Aware but Idle') >= 0 ? 'Aware but Idle' : tie[0];
      else best = tie[0];
    }
    return { archetype: best, scores: s, maxScore: max };
  }

  function sortedScores(scores) {
    return ARCHETYPES.slice().sort(function (a, b) {
      return scores[b] - scores[a];
    });
  }

  function resolveResultVersion(archetype, bits, scores, maxScore) {
    if (!bits || bits.length < TOTAL_Q) return 'mixed_general';
    var incomplete = false;
    for (var i = 0; i < TOTAL_Q; i++) {
      if (bits[i] === null || bits[i] === undefined) incomplete = true;
    }
    if (incomplete) return 'mixed_general';

    if (maxScore < 4) return 'mixed_general';

    var order = sortedScores(scores);
    var top = order[0];
    var second = order[1];
    if (scores[top] - scores[second] < 2) return 'mixed_general';

    var map = {
      'Pattern Suppressor': 'spotter_delay_nopressure',
      'Aware but Idle': 'spotter_delay_nopressure',
      'Unspoken Operator': 'interpreter_avoidance_wrongpeople',
      'Wrong Environment Operator': 'reworker_delay_misaligned',
      'Live Stabilizer': 'operator_distraction_misaligned',
      'Precision Refiner': 'builder_delay_lowstandard',
      'System Rebuilder': 'connector_overthinking_scattered'
    };

    return map[archetype] || 'mixed_general';
  }

  function blockFromBits(bits) {
    if (!bits || bits[9] === undefined || bits[9] === null) return '';
    return bits[9] === 0 ? 'Knowing without motion' : 'Open search without closure';
  }

  function environmentFromBits(bits) {
    if (!bits || bits[8] === undefined || bits[8] === null) return '';
    return bits[8] === 0 ? 'Your strongest gear is not what the context pulls for' : 'How you think is structurally used';
  }

  function secondaryFromBits(bits) {
    if (!bits || bits[7] === undefined || bits[7] === null) return '';
    return bits[7] === 0 ? 'Hesitate until certain' : 'Move before certainty, then adjust';
  }

  function buildSignals(bits) {
    var out = {
      detection: '',
      response: '',
      processing: '',
      awareness: '',
      standards: '',
      timing: '',
      impact: '',
      approach: ''
    };
    if (!bits || bits.length < TOTAL_Q) return out;

    out.detection =
      bits[0] === 0
        ? 'Friction and misalignment before consensus'
        : 'Improvement vectors before comfort';
    if (bits[2] !== undefined && bits[2] !== null) {
      out.detection += bits[2] === 0 ? ' · fine grain' : ' · cross-pattern';
    }

    out.response =
      bits[1] === 0 ? 'Cause and structure before motion' : 'Motion before full proof';

    out.processing = bits[2] === 0 ? 'Specific details first' : 'Patterns across cases first';

    out.awareness = bits[3] === 0 ? 'Stated terms first' : 'Subtext tracked automatically';

    out.standards = bits[4] === 0 ? '"Works" as baseline' : '"Works" still looks incomplete';

    out.timing = bits[7] === 0 ? 'Wait for certainty' : 'Ship and adjust in motion';

    out.impact =
      bits[5] === 0 ? 'Failure reads as a design miss' : 'Failure reads as handling quality';
    if (bits[8] !== undefined && bits[8] !== null) {
      out.impact += bits[8] === 0 ? ' · context misaligned' : ' · context uses your thinking';
    }

    out.approach =
      bits[6] === 0 ? 'Hold the read to protect the room' : 'Push the read into the room';
    if (bits[9] !== undefined && bits[9] !== null) {
      out.approach += bits[9] === 0 ? ' · knowing without acting' : ' · still searching';
    }

    return out;
  }

  /** One recommended section per diagnostic (anti-overlap). Order = priority; only [0] is assigned. */
  var VERSION_PLAYBOOKS = {
    spotter_delay_nopressure: ['Execution', 'Reset'],
    connector_overthinking_scattered: ['Execution', 'Reset'],
    interpreter_avoidance_wrongpeople: ['Execution', 'Income Architecture'],
    operator_distraction_misaligned: ['Reset', 'Execution'],
    reworker_delay_misaligned: ['Execution', 'Ownership'],
    builder_delay_lowstandard: ['Reset', 'AI Control'],
    mixed_general: ['Execution', 'Reset']
  };

  var PLAYBOOK_ROOM = {
    Reset: { room: 1, title: 'Where your time and money are going', path: '/room-01-extraction' },
    Execution: { room: 2, title: 'What to change this week', path: '/room-02-direction' },
    'Income Architecture': { room: 3, title: 'What you can offer and charge for', path: '/room-03-transaction' },
    Ownership: { room: 4, title: 'Fixing execution and delivery', path: '/room-04-infrastructure' },
    'AI Control': { room: 5, title: 'Using AI without lowering quality', path: '/room-05-cognition' }
  };

  var DIAGNOSTIC_BY_VERSION = {
    spotter_delay_nopressure: {
      main_problem: 'You register friction early, then stop before the loop closes.',
      what_it_costs: 'Open decisions stack. Small fixes stay undone. Attention keeps re-scanning the same issue.',
      what_you_have: 'Accurate reads and a standard that rarely gets an external deadline.',
      fix_first: 'Pick one decision or fix you will close before you add new inputs.'
    },
    connector_overthinking_scattered: {
      main_problem: 'You connect too many threads before anything ships.',
      what_it_costs: 'Depth replaces closure. The day never holds one line long enough to finish.',
      what_you_have: 'Pattern speed and systems thinking.',
      fix_first: 'Hold one thread until it is done — before you expand the map.'
    },
    interpreter_avoidance_wrongpeople: {
      main_problem: 'You read the room accurately, then soften the move.',
      what_it_costs: 'Your clearest call stays edited. Accountability to others replaces commitment to the work.',
      what_you_have: 'Subtext accuracy and timing sense.',
      fix_first: 'Make one call without rehearsing it around someone else’s comfort.'
    },
    operator_distraction_misaligned: {
      main_problem: 'You fix what is loud before what is load-bearing.',
      what_it_costs: 'Attention fragments. Improvements start and do not finish. Context pulls you off structure.',
      what_you_have: 'Fast stabilization and practical repair instinct.',
      fix_first: 'Cut measurable drain before you reorganize the week around new priorities.'
    },
    reworker_delay_misaligned: {
      main_problem: 'You see the full rebuild and wait for conditions that match it.',
      what_it_costs: 'Good ideas stay at the level of thought. Fit stays wrong while you refine the blueprint.',
      what_you_have: 'Structural diagnosis and quality bar.',
      fix_first: 'Ship one smaller version, then fix the environment layer that blocks the rest.'
    },
    builder_delay_lowstandard: {
      main_problem: 'Low-quality input is eating your decision speed.',
      what_it_costs: 'Reaction crowds out building. Your bar and your day disagree.',
      what_you_have: 'Delta vision — you see what “complete” would require.',
      fix_first: 'Remove one drain and one input stream before you touch leverage tools.'
    },
    mixed_general: {
      main_problem: 'Awareness is ahead of a single committed line of action.',
      what_it_costs: 'Too many options stay warm. Finishing stays rare.',
      what_you_have: 'Enough signal to choose a lane.',
      fix_first: 'Choose one direction for seven days and refuse new inputs until something ships.'
    }
  };

  function primaryPlaybookForVersion(version) {
    var list = VERSION_PLAYBOOKS[version] || VERSION_PLAYBOOKS.mixed_general;
    return list[0];
  }

  function nextReason(playbook) {
    var R = {
      Reset:
        'The diagnostic points to measurable waste. That has to be cut before the week gets re-planned.',
      Execution:
        'The next step is to reallocate this week’s time and priority — not to price an offer here.',
      'Income Architecture':
        'The bottleneck is packaging what already shows up into an offer, a number, and a first message.',
      Ownership:
        'The gap is delivery and follow-through — not another pass at leaks or the calendar.',
      'AI Control':
        'Leverage belongs after the core path is clear enough to protect from generic output.'
    };
    return R[playbook] || 'This section matches the bottleneck the diagnostic isolated.';
  }

  function buildDiagnostic(version, primaryPlaybook) {
    var d = DIAGNOSTIC_BY_VERSION[version] || DIAGNOSTIC_BY_VERSION.mixed_general;
    var room = PLAYBOOK_ROOM[primaryPlaybook] || PLAYBOOK_ROOM.Execution;
    return {
      main_problem: d.main_problem,
      what_it_costs: d.what_it_costs,
      what_you_have: d.what_you_have,
      fix_first: d.fix_first,
      next_playbook: primaryPlaybook,
      next_room: { num: room.room, title: room.title, path: room.path },
      next_reason: nextReason(primaryPlaybook)
    };
  }

  var LS_P02 = 'stephuary_monetize_p02_v1';
  var LS_P03 = 'stephuary_structure_p03_v1';
  var LS_P04 = 'stephuary_validation_p04_v1';
  var LS_P05 = 'stephuary_sovereignty_p05_v1';

  function loadStoredBits(key) {
    try {
      if (typeof localStorage === 'undefined') return null;
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var d = JSON.parse(raw);
      return d.bits || null;
    } catch (e) {
      return null;
    }
  }

  function phaseBitsComplete(bits) {
    if (!bits || bits.length < TOTAL_Q) return false;
    for (var i = 0; i < TOTAL_Q; i++) {
      if (bits[i] === null || bits[i] === undefined) return false;
    }
    return true;
  }

  function validationTierP4(b) {
    var sc = 0;
    if (b[1] === 0) sc += 2;
    if (b[2] === 0) sc += 2;
    if (b[3] === 0) sc += 2;
    if (b[7] === 0) sc += 1;
    if (b[0] === 0) sc += 1;
    if (sc >= 6) return 'validated';
    if (sc >= 3) return 'partially validated';
    return 'untested';
  }

  function lineMonetize(b) {
    if (!phaseBitsComplete(b)) return null;
    var clearScore = (b[0] === 0 ? 1 : 0) + (b[2] === 0 ? 1 : 0) + (b[5] === 0 ? 1 : 0) + (b[6] === 0 ? 1 : 0);
    var pos = clearScore >= 3 ? 'clear' : 'unclear';
    var pull = b[3] === 0 ? 'pulled' : 'pushed';
    var monet = b[1] === 0 && b[5] === 0 ? 'paid-fit strong' : 'paid-fit weak';
    var buyer = b[6] === 0 ? 'buyer named' : 'buyer fuzzy';
    var vs = (b[0] === 0 ? 1 : 0) + (b[2] === 0 ? 1 : 0) + (b[7] === 0 ? 1 : 0);
    var val = vs >= 2 ? 'outcome obvious' : 'outcome subtle';
    return 'Phase 02 · Value read: ' + pos + ' · Demand: ' + pull + ' · ' + monet + ' · ' + buyer + ' · ' + val + '.';
  }

  function lineStructure(b) {
    if (!phaseBitsComplete(b)) return null;
    var charge = b[0] === 0 ? 'chargeable shape exists' : 'not chargeable yet';
    var outcome = b[1] === 0 ? 'before/after clear' : 'before/after fuzzy';
    var entry = b[3] === 0 ? 'clear start' : 'no clear start';
    var price = b[7] === 0 ? 'can state price' : 'hesitates on price';
    var ship = b[9] === 0 ? 'would start today' : 'would delay for setup';
    return 'Phase 03 · Offer: ' + charge + ' · ' + outcome + ' · Entry: ' + entry + ' · ' + price + ' · Ship rule: ' + ship + '.';
  }

  function lineAutomation(b) {
    if (!phaseBitsComplete(b)) return null;
    var tier = validationTierP4(b);
    var vis = b[1] === 0 ? 'seen by others' : 'still private';
    var sig = b[2] === 0 ? 'responses when shared' : 'silence when shared';
    var loop = b[4] === 0 && b[8] === 0 ? 'adjusts after friction' : 'stalls on silence or prep';
    return 'Phase 04 · Validation: ' + tier + ' · ' + vis + ' · ' + sig + ' · Loop: ' + loop + '.';
  }

  function lineSovereignty(b) {
    if (!phaseBitsComplete(b)) return null;
    var indScore = 0;
    if (b[0] === 0) indScore += 2;
    if (b[2] === 0) indScore += 2;
    if (b[7] === 0) indScore += 2;
    if (b[8] === 0) indScore += 1;
    if (b[9] === 0) indScore += 2;
    var om = indScore >= 5 ? 'independent-leaning' : 'dependent-leaning';
    var inc = b[0] === 1 || b[2] === 1 || b[5] === 1 ? 'fragile income shape' : 'more durable income shape';
    var lever = b[1] === 0 ? 'delivery can run without you' : 'delivery still needs you';
    return 'Phase 05 · Control: ' + om + ' · ' + inc + ' · ' + lever + '.';
  }

  function mergeCrossPhase(data) {
    if (!data || typeof data !== 'object' || !data.diagnostic) return data;
    var diag = data.diagnostic;
    var p2 = loadStoredBits(LS_P02);
    var p3 = loadStoredBits(LS_P03);
    var p4 = loadStoredBits(LS_P04);
    var p5 = loadStoredBits(LS_P05);

    var lines = [];
    var l2 = lineMonetize(p2);
    var l3 = lineStructure(p3);
    var l4 = lineAutomation(p4);
    var l5 = lineSovereignty(p5);
    if (l2) lines.push(l2);
    if (l3) lines.push(l3);
    if (l4) lines.push(l4);
    if (l5) lines.push(l5);

    var issues = [];
    if (p2 && phaseBitsComplete(p2)) {
      if (!(p2[1] === 0 && p2[5] === 0)) issues.push('Paid problem + specificity not locked together');
      if (p2[6] === 1) issues.push('Buyer still too broad to target');
      if (p2[3] === 1) issues.push('Demand is push-led, not pull-led');
    }
    if (p3 && phaseBitsComplete(p3)) {
      if (p3[0] === 1) issues.push('Nothing priced and deliverable without more definition');
      if (p3[3] === 1) issues.push('No obvious first step for a buyer');
      if (p3[7] === 1) issues.push('Price still uncomfortable to say aloud');
    }
    if (p4 && phaseBitsComplete(p4)) {
      if (validationTierP4(p4) === 'untested') issues.push('Market signal still thin or private');
      if (p4[2] === 1) issues.push('Little response when you share the offer');
    }
    if (p5 && phaseBitsComplete(p5)) {
      var indScore =
        (p5[0] === 0 ? 2 : 0) +
        (p5[2] === 0 ? 2 : 0) +
        (p5[7] === 0 ? 2 : 0) +
        (p5[8] === 0 ? 1 : 0) +
        (p5[9] === 0 ? 2 : 0);
      if (indScore < 5) issues.push('Control and ownership still structurally external');
    }

    var moves = [];
    if (diag.fix_first) moves.push(String(diag.fix_first));
    if (p3 && phaseBitsComplete(p3) && p3[0] === 1) {
      moves.push('Ship one smallest paid slice: one buyer noun, one deliverable, one price.');
    }
    if (p2 && phaseBitsComplete(p2) && p2[6] === 1) {
      moves.push('Write the buyer as one job title or one situation in under 15 words.');
    }
    if (p4 && phaseBitsComplete(p4) && validationTierP4(p4) === 'untested') {
      moves.push('Run one exposure batch: same message, five sends, log yes/no/silence.');
    }
    if (p5 && phaseBitsComplete(p5)) {
      var ind =
        (p5[0] === 0 ? 2 : 0) +
        (p5[2] === 0 ? 2 : 0) +
        (p5[7] === 0 ? 2 : 0) +
        (p5[8] === 0 ? 1 : 0) +
        (p5[9] === 0 ? 2 : 0);
      if (ind < 5) {
        moves.push('Pick one channel or asset you fully control end-to-end for the next 30 days.');
      }
    }

    var seen = {};
    var deduped = [];
    moves.forEach(function (m) {
      var t = String(m).trim();
      if (!t || seen[t]) return;
      seen[t] = 1;
      deduped.push(t);
    });
    moves = deduped.slice(0, 4);

    diag.phase_chain_lines = lines;
    diag.phase_issues = issues.slice(0, 5);
    diag.priority_moves = moves;

    if (issues.length) {
      diag.synthesis_summary = issues.slice(0, 2).join(' · ');
    } else if (lines.length) {
      diag.synthesis_summary = lines[lines.length - 1].replace(/^Phase 0[2-5] · /, '');
    } else {
      diag.synthesis_summary = '';
    }

    applyStructuredSynthesis(data);
    return data;
  }

  function chargeableOffer(p3) {
    if (!p3 || !p3.offer_definition) return false;
    return p3.offer_definition.indexOf('invoice') >= 0;
  }

  /** Dynamic room labels + routes (maps onto existing Room playbooks). */
  var RECOMMENDED_ROOM = {
    positioning: {
      display_name: 'Positioning Room',
      playbook: 'Income Architecture',
      path: '/room-03-transaction'
    },
    demand: { display_name: 'Demand Room', playbook: 'Reset', path: '/room-01-extraction' },
    focus: { display_name: 'Focus Room', playbook: 'Ownership', path: '/room-04-infrastructure' },
    system: { display_name: 'System Room', playbook: 'Reset', path: '/room-01-extraction' },
    direction: { display_name: 'Direction Room', playbook: 'Execution', path: '/room-02-direction' }
  };

  function recommendedRoomRecord(key, reason) {
    var base = RECOMMENDED_ROOM[key] || RECOMMENDED_ROOM.direction;
    return {
      key: key,
      display_name: base.display_name,
      playbook: base.playbook,
      path: base.path,
      reason: reason
    };
  }

  function fallbackRecommendedFromVersion(version) {
    var pb = primaryPlaybookForVersion(version || 'mixed_general');
    if (pb === 'AI Control') {
      return {
        key: 'fallback',
        display_name: 'System Room',
        playbook: 'AI Control',
        path: '/room-05-cognition',
        reason: nextReason(pb)
      };
    }
    var base = RECOMMENDED_ROOM.positioning;
    if (pb === 'Income Architecture') base = RECOMMENDED_ROOM.positioning;
    else if (pb === 'Reset') base = RECOMMENDED_ROOM.demand;
    else if (pb === 'Ownership') base = RECOMMENDED_ROOM.focus;
    else if (pb === 'Execution') base = RECOMMENDED_ROOM.direction;
    return {
      key: 'fallback',
      display_name: base.display_name,
      playbook: pb,
      path: base.path,
      reason: nextReason(pb)
    };
  }

  /**
   * Priority order: offer clarity → demand → execution/validation → structure → scattered direction → version fallback.
   */
  function computeRecommendedRoom(store, data) {
    var bp = store && store.bitsPresent;
    var p2 = store.phase02;
    var p3 = store.phase03;
    var p4 = store.phase04;
    var p5 = store.phase05;
    var version = (data && data.result_version) || 'mixed_general';

    if (!bp || !bp.p03 || !p3 || !chargeableOffer(p3)) {
      return recommendedRoomRecord(
        'positioning',
        'Offer shape is not priced to ship yet — tighten positioning before you scale demand.'
      );
    }

    if (
      p2 &&
      (String(p2.paid_problem || '').indexOf('not aligned') >= 0 ||
        (String(p2.demand_signal || '').indexOf('Push') >= 0 &&
          String(p2.buyer_type || '').indexOf('broad') >= 0))
    ) {
      return recommendedRoomRecord(
        'demand',
        'Paid-fit and demand motion are still misaligned — build pull before you push harder.'
      );
    }

    if (
      p4 &&
      (p4.validation_status === 'untested' ||
        (p4.validation_status === 'partial' && String(p4.response_type || '').indexOf('Silence') >= 0))
    ) {
      return recommendedRoomRecord(
        'focus',
        'Execution and market signal are out of sync — close the loop where work meets reality.'
      );
    }

    if (
      p5 &&
      (String(p5.control_model || '').indexOf('Dependent') >= 0 ||
        String(p5.scalability_status || '').indexOf('tied to direct') >= 0)
    ) {
      return recommendedRoomRecord(
        'system',
        'Structure and control are still external — shore up the system that holds revenue.'
      );
    }

    if (version === 'connector_overthinking_scattered') {
      return recommendedRoomRecord(
        'direction',
        'Direction is still scattered — pick one lane and hold it until it ships.'
      );
    }

    return fallbackRecommendedFromVersion(version);
  }

  function assignRecommendedRoom(data) {
    if (!data || !data.diagnostic) return;
    var diag = data.diagnostic;
    var store = data.structured;
    if (!store || !store.bitsPresent) return;

    var rec = computeRecommendedRoom(store, data);
    diag.recommended_room = rec;

    var roomMeta = PLAYBOOK_ROOM[rec.playbook] || PLAYBOOK_ROOM.Execution;
    diag.next_playbook = rec.playbook;
    diag.next_room = { num: roomMeta.room, title: roomMeta.title, path: rec.path };
    diag.next_reason = rec.reason;

    diag.results_handoff =
      'Phase 01 locked how you notice and move. Phases 02–05 locked value, offer shape, validation, and control. Start with ' +
      rec.display_name +
      ' — it matches the tightest bottleneck right now.';

    diag.rooms_entry_hint = 'Primary door: ' + rec.path + ' · ' + rec.display_name + '.';
  }

  function resolveResultsCta(store, diag) {
    var bp = store && store.bitsPresent;

    if (!bp || !bp.p01) {
      return { label: 'Continue Diagnostic', href: '/capture', kind: 'continue_diag' };
    }
    if (!bp.p02) {
      return { label: 'Continue Diagnostic', href: '/monetize', kind: 'continue_diag' };
    }
    if (!bp.p03) {
      return { label: 'Continue Diagnostic', href: '/structure', kind: 'continue_diag' };
    }

    var p3 = store.phase03;
    if (!chargeableOffer(p3)) {
      var rec0 = diag && diag.recommended_room;
      return {
        label: 'Enter Your Room',
        href: (rec0 && rec0.path) || '/room-03-transaction',
        kind: 'enter_room'
      };
    }

    if (!bp.p04) {
      return { label: 'Continue Diagnostic', href: '/automation', kind: 'continue_diag' };
    }

    if (!bp.p05) {
      return { label: 'Continue Diagnostic', href: '/sovereignty', kind: 'continue_diag' };
    }

    var rec = diag && diag.recommended_room;
    return {
      label: 'Enter Your Room',
      href: (rec && rec.path) || (diag.next_room && diag.next_room.path) || '/room-02-direction',
      kind: 'enter_room'
    };
  }

  function derivePrimaryIssue(diag, store, issues) {
    var p2 = store.phase02;
    var p3 = store.phase03;
    var p4 = store.phase04;
    if (p3 && chargeableOffer(p3) && p4 && p4.validation_status === 'untested') {
      return 'The tightest gap is exposure: the offer is shaped, but market signal is still thin or private.';
    }
    if (p2 && (!p3 || !chargeableOffer(p3))) {
      if (p2.paid_problem && p2.paid_problem.indexOf('not aligned') >= 0) {
        return 'Demand and problem shape are still misaligned — packaging lags what you can deliver.';
      }
      return 'Value reads in places, but the offer is not priced to ship yet — structure is the bottleneck.';
    }
    if (issues && issues.length) return issues[0];
    return diag.main_problem || '';
  }

  function applyStructuredSynthesis(data) {
    if (!data || typeof data !== 'object' || !data.diagnostic) return data;
    var diag = data.diagnostic;
    var store = null;
    try {
      if (global.StephuaryDiagnosticState && typeof global.StephuaryDiagnosticState.collectAll === 'function') {
        store = global.StephuaryDiagnosticState.collectAll();
      }
    } catch (eS) {}
    data.structured = store;
    if (!store) return data;

    var p1 = store.phase01;
    var p2 = store.phase02;
    var p3 = store.phase03;
    var p4 = store.phase04;
    var p5 = store.phase05;

    var issues = [];
    if (diag.phase_issues && diag.phase_issues.length) {
      issues = diag.phase_issues.slice();
    }
    if (issues.length < 2 && p1) {
      issues.push(p1.friction_source, p1.priority_cut);
    }
    if (issues.length < 2 && p2) {
      issues.push(p2.paid_problem, p2.buyer_type);
    }
    var seenI = {};
    var dedupIssues = [];
    issues.forEach(function (x) {
      var t = String(x || '').trim();
      if (!t || seenI[t]) return;
      seenI[t] = 1;
      dedupIssues.push(t);
    });
    diag.diagnosis_issues = dedupIssues.slice(0, 4);

    diag.primary_issue = derivePrimaryIssue(diag, store, diag.diagnosis_issues);

    var costNarr = [];
    if (p1) {
      costNarr.push(p1.time_leak);
      costNarr.push(p1.money_leak);
    }
    if (p4) {
      costNarr.push('Loop: ' + p4.feedback_loop);
      costNarr.push('Validation: ' + p4.validation_status);
    }
    if (costNarr.length) {
      diag.what_it_costs = costNarr.join(' · ');
    }

    var haveN = [];
    if (p2) haveN.push(p2.value_source, p2.demand_signal);
    if (p3) haveN.push(p3.outcome, p3.entry_point);
    if (p4) haveN.push(p4.exposure_method);
    if (p5) haveN.push(p5.leverage_type, p5.scalability_status);
    if (haveN.length) {
      diag.what_you_have = haveN.join(' · ');
    }

    if (diag.priority_moves && diag.priority_moves.length) {
      diag.fix_first = diag.priority_moves[0];
    } else if (!diag.fix_first) {
      diag.fix_first = diag.primary_issue || diag.main_problem;
    }

    assignRecommendedRoom(data);

    diag.results_cta = resolveResultsCta(store, diag);
    diag.cta_single = true;

    if (String(diag.synthesis_summary || '').trim() === '' && diag.diagnosis_issues.length) {
      diag.synthesis_summary = diag.diagnosis_issues.slice(0, 2).join(' · ');
    }

    return data;
  }

  function buildFromPhase01(bits) {
    var fallback = {
      type_primary: '',
      type_secondary: '',
      block: '',
      environment: '',
      signals: buildSignals(null),
      playbooks: [primaryPlaybookForVersion('mixed_general')],
      result_version: 'mixed_general',
      diagnostic: buildDiagnostic('mixed_general', primaryPlaybookForVersion('mixed_general'))
    };
    mergeCrossPhase(fallback);

    if (!bits || !bits.length) return fallback;

    var scored = scoreArchetype(bits);
    var archetype = scored.archetype;
    var version = resolveResultVersion(archetype, bits, scored.scores, scored.maxScore);
    var primary = primaryPlaybookForVersion(version);

    var out = {
      type_primary: archetype,
      type_secondary: secondaryFromBits(bits),
      block: blockFromBits(bits),
      environment: environmentFromBits(bits),
      signals: buildSignals(bits),
      playbooks: [primary],
      result_version: version,
      diagnostic: buildDiagnostic(version, primary)
    };
    mergeCrossPhase(out);
    return out;
  }

  global.StephuaryResult = {
    STORAGE_KEY: STORAGE_KEY,
    buildFromPhase01: buildFromPhase01,
    scoreArchetype: scoreArchetype,
    primaryPlaybookForVersion: primaryPlaybookForVersion,
    buildDiagnostic: buildDiagnostic,
    mergeCrossPhase: mergeCrossPhase,
    applyStructuredSynthesis: applyStructuredSynthesis,
    computeRecommendedRoom: computeRecommendedRoom,
    assignRecommendedRoom: assignRecommendedRoom,
    PLAYBOOK_ROOM: PLAYBOOK_ROOM,
    VERSION_PLAYBOOKS: VERSION_PLAYBOOKS
  };
})(typeof window !== 'undefined' ? window : this);
