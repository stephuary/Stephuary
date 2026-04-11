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
    Reset: { room: 1, title: 'Where your time and money are going', path: '/capture' },
    Execution: { room: 2, title: 'What to change this week', path: '/monetize' },
    'Income Architecture': { room: 3, title: 'What you can offer and charge for', path: '/structure' },
    Ownership: { room: 4, title: 'Fixing execution and delivery', path: '/automation' },
    'AI Control': { room: 5, title: 'Using AI without lowering quality', path: '/sovereignty' }
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

    if (!bits || !bits.length) return fallback;

    var scored = scoreArchetype(bits);
    var archetype = scored.archetype;
    var version = resolveResultVersion(archetype, bits, scored.scores, scored.maxScore);
    var primary = primaryPlaybookForVersion(version);

    return {
      type_primary: archetype,
      type_secondary: secondaryFromBits(bits),
      block: blockFromBits(bits),
      environment: environmentFromBits(bits),
      signals: buildSignals(bits),
      playbooks: [primary],
      result_version: version,
      diagnostic: buildDiagnostic(version, primary)
    };
  }

  global.StephuaryResult = {
    STORAGE_KEY: STORAGE_KEY,
    buildFromPhase01: buildFromPhase01,
    scoreArchetype: scoreArchetype,
    primaryPlaybookForVersion: primaryPlaybookForVersion,
    buildDiagnostic: buildDiagnostic,
    PLAYBOOK_ROOM: PLAYBOOK_ROOM,
    VERSION_PLAYBOOKS: VERSION_PLAYBOOKS
  };
})(typeof window !== 'undefined' ? window : this);
