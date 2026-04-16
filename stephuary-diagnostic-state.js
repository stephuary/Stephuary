/**
 * Stephuary · structured diagnostic fields derived from phase bits (single source of truth: localStorage bits).
 * Phase pages + results load this before stephuary-result.js where synthesis runs.
 */
(function (global) {
  var P01 = 'stephuary_capture_p01_v2';
  var P02 = 'stephuary_monetize_p02_v1';
  var P03 = 'stephuary_structure_p03_v1';
  var P04 = 'stephuary_validation_p04_v1';
  var P05 = 'stephuary_sovereignty_p05_v1';
  var T = 10;
  var T01 = 6;
  var T02 = 5;

  /** Legacy Monetize stored 10 binary answers; map to the current 5-question set. */
  function migrateP02Bits(bits) {
    if (!bits) return null;
    if (bits.length === 10) {
      return [bits[0], bits[1], bits[3], bits[6], bits[7]];
    }
    if (bits.length > T02) return bits.slice(0, T02);
    return bits;
  }

  function migrateP01Bits(bits) {
    if (!bits) return null;
    if (bits.length === 10) {
      return [bits[0], bits[1], bits[6], bits[8], bits[5], bits[9]];
    }
    return bits;
  }

  function loadBits(key) {
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

  function complete(bits) {
    if (!bits || bits.length < T) return false;
    for (var i = 0; i < T; i++) {
      if (bits[i] === null || bits[i] === undefined) return false;
    }
    return true;
  }

  function completeP01(bits) {
    var b = migrateP01Bits(bits);
    if (!b || b.length < T01) return false;
    for (var i = 0; i < T01; i++) {
      if (b[i] === null || b[i] === undefined) return false;
    }
    return true;
  }

  function completeP02(bits) {
    var b = migrateP02Bits(bits);
    if (!b || b.length < T02) return false;
    for (var i = 0; i < T02; i++) {
      if (b[i] === null || b[i] === undefined) return false;
    }
    return true;
  }

  function phase01(bits) {
    var b = migrateP01Bits(bits);
    if (!completeP01(b)) return null;
    return {
      time_leak:
        b[1] === 0
          ? 'Time lost in hesitation before you move'
          : 'Time lost fixing motion that outran the map',
      money_leak:
        b[3] === 0
          ? 'Return left on the table when context misuses your strongest gear'
          : 'Revenue risk when volume exceeds reward structure',
      friction_source:
        b[0] === 0
          ? 'Friction shows before the room agrees it exists'
          : 'You see upgrades before others feel the pain',
      priority_cut:
        b[5] === 0
          ? 'Cut: knowing without closing the loop'
          : 'Cut: open search without a ship date'
    };
  }

  function phase02(bits) {
    var b = migrateP02Bits(bits);
    if (!completeP02(b)) return null;
    return {
      value_source:
        b[0] === 0 ? 'Value is legible to others in one pass' : 'Value still needs translation before it lands',
      buyer_type: b[3] === 0 ? 'Buyer is narrow enough to name' : 'Buyer is still too broad to target',
      paid_problem:
        b[1] === 0
          ? 'Problem shape matches what people already pay to fix'
          : 'Problem shape still not aligned with paid demand',
      demand_signal: b[2] === 0 ? 'Demand-led (pulled)' : 'Push-led (you initiate)',
      outcome_visibility:
        b[4] === 0 ? 'Outcome is visible enough to price' : 'Outcome is subtle — proof must be designed'
    };
  }

  function phase03(bits) {
    if (!complete(bits)) return null;
    return {
      offer_definition:
        bits[0] === 0 ? 'Something you could invoice this week (even rough)' : 'Still conceptual — not priced to ship',
      outcome: bits[1] === 0 ? 'Before/after is stated clearly' : 'Outcome language still fuzzy',
      entry_point: bits[3] === 0 ? 'Obvious first step for a buyer' : 'No obvious first step yet',
      pricing_position: bits[7] === 0 ? 'Can say a price out loud' : 'Price still uncomfortable to state'
    };
  }

  function tierP4(b) {
    var sc = 0;
    if (b[1] === 0) sc += 2;
    if (b[2] === 0) sc += 2;
    if (b[3] === 0) sc += 2;
    if (b[7] === 0) sc += 1;
    if (b[0] === 0) sc += 1;
    if (sc >= 6) return 'validated';
    if (sc >= 3) return 'partial';
    return 'untested';
  }

  function phase04(bits) {
    if (!complete(bits)) return null;
    return {
      exposure_method: bits[1] === 0 ? 'Offer seen outside your own head' : 'Work still mostly private',
      feedback_loop:
        bits[4] === 0 && bits[8] === 0
          ? 'You adjust after silence or friction'
          : 'Loop stalls after silence or stays in prep',
      validation_status: tierP4(bits),
      response_type: bits[2] === 0 ? 'Responses when you share' : 'Silence or weak signal when you share'
    };
  }

  function phase05(bits) {
    if (!complete(bits)) return null;
    var ind =
      (bits[0] === 0 ? 2 : 0) +
      (bits[2] === 0 ? 2 : 0) +
      (bits[7] === 0 ? 2 : 0) +
      (bits[8] === 0 ? 1 : 0) +
      (bits[9] === 0 ? 2 : 0);
    return {
      dependency_level: bits[0] === 0 ? 'Multiple income paths or options' : 'Single dominant income path',
      leverage_type: bits[8] === 0 ? 'Bias toward multiplying leverage' : 'Bias toward improving existing work',
      control_model: ind >= 5 ? 'Independent-leaning controls' : 'Dependent-leaning controls',
      scalability_status:
        bits[4] === 0 && bits[6] === 0 ? 'Model can scale beyond hourly' : 'Model still tied to direct delivery'
    };
  }

  function collectAll() {
    var b1 = loadBits(P01);
    var b2 = loadBits(P02);
    var b3 = loadBits(P03);
    var b4 = loadBits(P04);
    var b5 = loadBits(P05);
    return {
      phase01: phase01(b1),
      phase02: phase02(b2),
      phase03: phase03(b3),
      phase04: phase04(b4),
      phase05: phase05(b5),
      bitsPresent: {
        p01: completeP01(b1),
        p02: completeP02(b2),
        p03: complete(b3),
        p04: complete(b4),
        p05: complete(b5)
      }
    };
  }

  function handoffLine(fromPhase, store) {
    if (!store) return '';
    if (fromPhase >= 2 && store.phase01) {
      return (
        'From Capture: ' +
        store.phase01.friction_source.slice(0, 80) +
        (store.phase01.friction_source.length > 80 ? '…' : '')
      );
    }
    if (fromPhase >= 3 && store.phase02) {
      return 'From Monetize: ' + store.phase02.paid_problem + ' · ' + store.phase02.buyer_type;
    }
    if (fromPhase >= 4 && store.phase03) {
      return 'From Structure: ' + store.phase03.offer_definition + ' · ' + store.phase03.entry_point;
    }
    if (fromPhase >= 5 && store.phase04) {
      return 'From Automation: ' + store.phase04.validation_status + ' · ' + store.phase04.response_type;
    }
    return '';
  }

  global.StephuaryDiagnosticState = {
    collectAll: collectAll,
    handoffLine: handoffLine,
    phase01: phase01,
    phase02: phase02,
    phase03: phase03,
    phase04: phase04,
    phase05: phase05,
    migrateP02Bits: migrateP02Bits,
    completeP02: completeP02,
    KEYS: { P01: P01, P02: P02, P03: P03, P04: P04, P05: P05 }
  };
})(typeof window !== 'undefined' ? window : this);
