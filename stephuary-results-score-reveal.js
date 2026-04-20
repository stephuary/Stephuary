/**
 * Results page · score number, bars, dynamic line, separator (no GSAP).
 * Expects window.__resultsVisualScores from StephuaryResult.computeResultsVisualScores().
 */
(function () {
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function dynamicLine(scores) {
    if (
      scores &&
      scores._raw &&
      window.StephuaryResult &&
      typeof window.StephuaryResult.dynamicLineFromSingleFlow === 'function'
    ) {
      return window.StephuaryResult.dynamicLineFromSingleFlow(scores._raw);
    }
    var c = scores.clarity;
    var p = scores.positioning;
    var s = scores.structure;
    var min = Math.min(c, p, s);
    var max = Math.max(c, p, s);
    var spread = max - min;

    if (spread <= 10) {
      var avg = (c + p + s) / 3;
      if (avg < 42) {
        return 'All three areas are underbuilt. Start with clarity.';
      }
      if (avg >= 72) {
        return 'Solid across the board. Structure still has the most room.';
      }
      return 'You are tight across clarity, positioning, and structure. Keep pressure on the weakest edge.';
    }

    var areas = [
      { name: 'Clarity', v: c },
      { name: 'Positioning', v: p },
      { name: 'Structure', v: s }
    ];
    var lowest = areas.filter(function (a) {
      return a.v === min;
    });
    var lowName = lowest[0].name;

    if (lowName === 'Clarity') {
      return 'Clarity is the softest layer right now. Lock the story before you widen the net.';
    }
    if (lowName === 'Positioning') {
      return 'Positioning is the gap. Everything else waits on who this is for.';
    }
    if (lowName === 'Structure') {
      return 'Structure is the weak edge. Stabilize the offer and the loop next.';
    }
    return 'One edge is softer than the rest. Fix that layer first.';
  }

  function init(scores) {
    var root = document.getElementById('results-score-reveal');
    if (!root || !scores) return;

    var numEl = document.getElementById('results-vis-score-num');
    var lineEl = document.getElementById('results-vis-dynamic-line');
    var sepEl = document.getElementById('results-vis-sep');
    var rows = root.querySelectorAll('.results-vis-bar-row');
    if (!numEl || !lineEl || !sepEl) return;

    var total = Math.max(0, Math.min(100, Math.round(scores.total)));
    var c = Math.max(0, Math.min(100, Math.round(scores.clarity)));
    var po = Math.max(0, Math.min(100, Math.round(scores.positioning)));
    var st = Math.max(0, Math.min(100, Math.round(scores.structure)));

    numEl.classList.remove('results-score-reveal__number--terra', 'results-score-reveal__number--gold');
    if (total < 40) numEl.classList.add('results-score-reveal__number--terra');
    else if (total > 70) numEl.classList.add('results-score-reveal__number--gold');

    lineEl.textContent = dynamicLine({ clarity: c, positioning: po, structure: st });
    lineEl.classList.remove('is-visible');
    sepEl.classList.remove('is-visible');

    var vals = [c, po, st];
    var minV = Math.min.apply(null, vals);
    rows.forEach(function (row, idx) {
      var fill = row.querySelector('.results-vis-bar-row__fill');
      if (!fill) return;
      fill.style.width = '0%';
      row.classList.remove('results-vis-bar-row--low');
      if (vals[idx] === minV) row.classList.add('results-vis-bar-row--low');
      fill.setAttribute('data-target', String(vals[idx]));
    });

    var reduced =
      typeof window.matchMedia !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      numEl.textContent = String(total);
      rows.forEach(function (row) {
        var fill = row.querySelector('.results-vis-bar-row__fill');
        var tgt = fill && fill.getAttribute('data-target');
        if (fill && tgt != null) fill.style.width = tgt + '%';
      });
      lineEl.classList.add('is-visible');
      sepEl.classList.add('is-visible');
      return;
    }

    root.classList.add('is-ready');

    var DELAY_START = 200;
    var COUNT_MS = 1200;
    var PAUSE_AFTER_NUM = 200;
    var BAR_MS = 1200;
    var PAUSE_AFTER_BARS = 300;
    var LINE_MS = 400;

    var t0 = performance.now();
    var doneCount = false;

    function tick(now) {
      if (!doneCount) {
        var elapsed = now - t0 - DELAY_START;
        if (elapsed < 0) {
          requestAnimationFrame(tick);
          return;
        }
        var u = Math.min(1, elapsed / COUNT_MS);
        var e = easeOutCubic(u);
        numEl.textContent = String(Math.round(e * total));
        if (u < 1) {
          requestAnimationFrame(tick);
          return;
        }
        numEl.textContent = String(total);
        doneCount = true;
        window.setTimeout(startBars, PAUSE_AFTER_NUM);
        return;
      }
    }

    function startBars() {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          rows.forEach(function (row) {
            var fill = row.querySelector('.results-vis-bar-row__fill');
            var tgt = fill && fill.getAttribute('data-target');
            if (fill && tgt != null) fill.style.width = tgt + '%';
          });
          window.setTimeout(showLine, BAR_MS + PAUSE_AFTER_BARS);
        });
      });
    }

    function showLine() {
      lineEl.classList.add('is-visible');
      window.setTimeout(function () {
        sepEl.classList.add('is-visible');
      }, LINE_MS);
    }

    requestAnimationFrame(tick);
  }

  window.ResultsScoreReveal = { init: init };
})();
