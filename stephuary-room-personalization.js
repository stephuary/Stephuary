/**
 * Stephuary · optional diagnostic continuation for room entry panels (4 short lines).
 * Depends on: stephuary-diagnostic-state.js, stephuary-result.js
 */
(function (global) {
  function truncate(s, max) {
    if (!s) return '';
    s = String(s).trim();
    if (s.length <= max) return s;
    return s.slice(0, Math.max(0, max - 1)).trim() + '…';
  }

  function buildContext() {
    var store = {
      phase01: null,
      phase02: null,
      phase03: null,
      phase04: null,
      phase05: null,
      bitsPresent: {}
    };
    try {
      if (global.StephuaryDiagnosticState && typeof global.StephuaryDiagnosticState.collectAll === 'function') {
        store = global.StephuaryDiagnosticState.collectAll();
      }
    } catch (e1) {}

    var archetype = '';
    try {
      var raw = localStorage.getItem('stephuary_result_v1');
      if (raw) {
        var data = JSON.parse(raw);
        if (data && data.type_primary) archetype = String(data.type_primary);
      }
    } catch (e2) {}

    if (!archetype && global.StephuaryResult && typeof global.StephuaryResult.buildFromPhase01 === 'function') {
      try {
        var p01raw =
          localStorage.getItem('stephuary_capture_p01_v3') ||
          localStorage.getItem('stephuary_capture_p01_v2');
        var p01 = p01raw ? JSON.parse(p01raw) : null;
        var bits = p01 && p01.bits ? p01.bits : null;
        var built = global.StephuaryResult.buildFromPhase01(bits);
        if (built && built.type_primary) archetype = String(built.type_primary);
      } catch (e3) {}
    }

    return { store: store, archetype: archetype };
  }

  function linesRoom1(ctx) {
    var p1 = ctx.store.phase01;
    var a = ctx.archetype || '';
    if (!p1) return null;

    var open;
    if (a.indexOf('Hidden Operator') !== -1) {
      open = 'Leak pattern: stabilization runs before the cut you owe yourself.';
    } else if (a.indexOf('Delayed Builder') !== -1) {
      open = 'Leak pattern: ' + truncate(p1.time_leak, 72);
    } else if (a.indexOf('Unconverted Thinker') !== -1) {
      open = 'Leak pattern: ' + truncate(p1.priority_cut, 85);
    } else {
      open = truncate(p1.time_leak, 88);
    }

    var pressure =
      truncate(p1.money_leak, 75) + ' · ' + truncate(p1.priority_cut, 75);
    var frame = 'Frame: one leak in dollars, one in hours. Same names as Capture.';
    var next = 'Next: cut one recurring line. Remove one source before you add a new rule.';

    return { open: open, pressure: pressure, frame: frame, next: next };
  }

  function linesRoom2(ctx) {
    var p1 = ctx.store.phase01;
    var p2 = ctx.store.phase02;
    var a = ctx.archetype || '';
    if (!p1 && !p2) return null;

    var open;
    if (a.indexOf('Delayed Builder') !== -1) {
      open = 'Execution pattern: ship dates slip while prep expands.';
    } else if (a.indexOf('Reactive Stabilizer') !== -1) {
      open = 'Execution pattern: the week fills with what fires loudest.';
    } else if (p1) {
      open = truncate(p1.time_leak, 88);
    } else {
      open = truncate(p2.value_source, 88);
    }

    var pressure;
    if (p2 && String(p2.demand_signal || '').indexOf('Push') !== -1) {
      pressure =
        'Pressure: push-led demand — the week restarts instead of compounding.';
    } else if (p1) {
      pressure = 'Pressure: ' + truncate(p1.priority_cut, 100);
    } else if (p2) {
      pressure = 'Pressure: ' + truncate(p2.paid_problem, 100);
    } else {
      pressure = 'Pressure: scattered work without one weekly spine.';
    }

    var frame = 'Frame: one calendar block, one priority, one finish line.';
    var next = 'Next: lock one non-negotiable block and one done definition for Friday.';

    return { open: open, pressure: pressure, frame: frame, next: next };
  }

  function linesRoom3(ctx) {
    var p2 = ctx.store.phase02;
    var p3 = ctx.store.phase03;
    if (!p2 && !p3) return null;
    var a = ctx.archetype || '';

    var open;
    if (a.indexOf('Miscast Strategist') !== -1) {
      open = 'Offer pressure: rework runs before the paid shape is fixed.';
    } else if (a.indexOf('Structural Refiner') !== -1) {
      open = 'Offer pressure: standards rise before the invoice does.';
    } else if (a.indexOf('Unconverted Thinker') !== -1) {
      open = 'Offer pressure: thinking runs before a priced ship.';
    } else if (p2 && String(p2.value_source || '').indexOf('needs translation') !== -1) {
      open = 'Value read: still translating before it lands.';
    } else if (p2) {
      open = truncate(p2.value_source, 88);
    } else {
      open = truncate(p3.offer_definition, 88);
    }

    var parts = [];
    if (p2 && String(p2.paid_problem || '').indexOf('not aligned') !== -1) {
      parts.push('unpaid problem shape');
    }
    if (p2 && String(p2.buyer_type || '').indexOf('broad') !== -1) {
      parts.push('buyer too broad');
    }
    if (p3 && String(p3.outcome || '').indexOf('fuzzy') !== -1) {
      parts.push('outcome language fuzzy');
    }
    if (p3 && String(p3.pricing_position || '').indexOf('uncomfortable') !== -1) {
      parts.push('price not stated aloud');
    }

    var pressure =
      parts.length > 0
        ? 'Pressure: ' + parts.join(' · ') + '.'
        : p3
          ? 'Pressure: ' + truncate(p3.entry_point, 100)
          : p2
            ? 'Pressure: ' + truncate(p2.paid_problem, 100)
            : 'Pressure: offer not priced to ship yet.';

    var frame = 'Frame: one buyer noun, one paid problem, one price band.';
    var next = 'Next: write one buyer, one problem, one number you say aloud.';

    return { open: open, pressure: pressure, frame: frame, next: next };
  }

  function linesRoom4(ctx) {
    var p3 = ctx.store.phase03;
    var p4 = ctx.store.phase04;
    if (!p3 && !p4) return null;
    var a = ctx.archetype || '';

    var open;
    if (p3) {
      open = 'Delivery: ' + truncate(p3.delivery_shape, 85);
    } else {
      open = 'Delivery path exists; execution is the variable.';
    }
    if (a.indexOf('Reactive Stabilizer') !== -1) {
      open = 'Delivery: fast fixes; thin follow-through between sessions.';
    } else if (a.indexOf('Structural Refiner') !== -1) {
      open = 'Delivery: structure is strong; client handoff is the leak.';
    }

    var pressure;
    if (p4 && String(p4.exposure_method || '').indexOf('private') !== -1) {
      pressure = 'Pressure: work still private — follow-through cannot compound on silence.';
    } else if (p4 && String(p4.feedback_loop || '').indexOf('stalls') !== -1) {
      pressure = 'Pressure: loop stalls after silence — delivery slips while you wait.';
    } else if (p3) {
      pressure = 'Pressure: ' + truncate(p3.entry_point, 100);
    } else {
      pressure = 'Pressure: inconsistent handoff between promise and delivery.';
    }

    var frame = 'Frame: one delivery step, one client-visible done.';
    var next = 'Next: define one handoff checkpoint and one SLA you keep this week.';

    return { open: open, pressure: pressure, frame: frame, next: next };
  }

  function linesRoom5(ctx) {
    var p4 = ctx.store.phase04;
    var p5 = ctx.store.phase05;
    var a = ctx.archetype || '';
    if (!p4 && !p5 && !a) return null;

    var open;
    if (a.indexOf('Hidden Operator') !== -1 || a.indexOf('Unconverted Thinker') !== -1) {
      open = 'AI job: compress thinking into output — not replace the decision.';
    } else if (p5 && String(p5.leverage_type || '').indexOf('multiplying') !== -1) {
      open = 'AI job: multiply leverage where the offer is already clear.';
    } else {
      open = 'AI job: consistency and speed where the spec is fixed.';
    }

    var pressure;
    if (p4 && String(p4.validation_status || '') === 'untested') {
      pressure = 'Risk: AI fills gaps where market signal is still thin.';
    } else if (p5 && String(p5.control_model || '').indexOf('Dependent') !== -1) {
      pressure = 'Risk: leverage stays on rails you do not own.';
    } else {
      pressure = 'Risk: prompts replace judgment — or no system where leverage is obvious.';
    }

    var frame = 'Frame: one workflow, one template, one review gate.';
    var next = 'Next: ship one AI-backed asset with a human sign-off rule.';

    return { open: open, pressure: pressure, frame: frame, next: next };
  }

  var ROOM_FNS = [linesRoom1, linesRoom2, linesRoom3, linesRoom4, linesRoom5];

  function inject(roomNumber) {
    var n = parseInt(roomNumber, 10);
    if (n < 1 || n > 5) return;

    var wrap = document.querySelector('.pb-dyn-wrap');
    if (!wrap) return;

    var fn = ROOM_FNS[n - 1];
    var ctx = buildContext();
    var lines = fn(ctx);

    if (
      !lines ||
      (!lines.open && !lines.pressure && !lines.frame && !lines.next)
    ) {
      wrap.setAttribute('hidden', '');
      return;
    }

    var elOpen = wrap.querySelector('.pb-dyn-open');
    var elPressure = wrap.querySelector('.pb-dyn-pressure');
    var elFrame = wrap.querySelector('.pb-dyn-frame');
    var elNext = wrap.querySelector('.pb-dyn-next');
    if (elOpen) elOpen.textContent = lines.open || '';
    if (elPressure) elPressure.textContent = lines.pressure || '';
    if (elFrame) elFrame.textContent = lines.frame || '';
    if (elNext) elNext.textContent = lines.next || '';

    wrap.removeAttribute('hidden');
  }

  global.StephuaryRoomPersonalization = {
    inject: inject,
    buildContext: buildContext
  };
})(typeof window !== 'undefined' ? window : this);
