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

  var VERSION_PLAYBOOKS = {
    spotter_delay_nopressure: ['Execution', 'Reset'],
    connector_overthinking_scattered: ['Execution', 'Reset'],
    interpreter_avoidance_wrongpeople: ['Execution', 'Income Architecture'],
    operator_distraction_misaligned: ['Reset', 'Execution'],
    reworker_delay_misaligned: ['Execution', 'Ownership'],
    builder_delay_lowstandard: ['Reset', 'AI Control'],
    mixed_general: ['Execution', 'Reset']
  };

  function buildFromPhase01(bits) {
    var fallback = {
      type_primary: '',
      type_secondary: '',
      block: '',
      environment: '',
      signals: buildSignals(null),
      playbooks: VERSION_PLAYBOOKS.mixed_general.slice(),
      result_version: 'mixed_general'
    };

    if (!bits || !bits.length) return fallback;

    var scored = scoreArchetype(bits);
    var archetype = scored.archetype;
    var version = resolveResultVersion(archetype, bits, scored.scores, scored.maxScore);
    var pb = VERSION_PLAYBOOKS[version] ? VERSION_PLAYBOOKS[version].slice() : VERSION_PLAYBOOKS.mixed_general.slice();

    return {
      type_primary: archetype,
      type_secondary: secondaryFromBits(bits),
      block: blockFromBits(bits),
      environment: environmentFromBits(bits),
      signals: buildSignals(bits),
      playbooks: pb,
      result_version: version
    };
  }

  global.StephuaryResult = {
    STORAGE_KEY: STORAGE_KEY,
    buildFromPhase01: buildFromPhase01,
    scoreArchetype: scoreArchetype
  };
})(typeof window !== 'undefined' ? window : this);
