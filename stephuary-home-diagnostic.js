/**
 * Home diagnostic: State 2 (5 steps) + State 3 (routing result).
 * No navigation to /capture — overlay on index only.
 */
(function (global) {
  var STORAGE_KEY = 'stephuary_home_diag_v1';

  /** Room index 0–4 → execution environments (vercel.json routes). */
  var ROOM_HREFS = [
    '/room-01-extraction',
    '/room-02-direction',
    '/room-03-transaction',
    '/room-04-infrastructure',
    '/room-05-cognition'
  ];

  /**
   * Each option: weighted pull toward Room path (rw) vs Service path (sw),
   * and roomPick (0–4) for which Room gets a vote when this option is chosen.
   */
  var STEPS = [
    {
      id: 'capture',
      title: 'Capture',
      prompt: 'Where is the friction showing up first?',
      options: [
        { label: 'I lose time and attention before I see revenue clearly.', rw: 2, sw: 0, roomPick: 2 },
        { label: 'I see the leak, but I keep avoiding the fix.', rw: 1, sw: 2, roomPick: 1 },
        { label: 'I am clear on the problem; I need a path to run.', rw: 3, sw: 0, roomPick: 3 }
      ]
    },
    {
      id: 'monetize',
      title: 'Monetize',
      prompt: 'Where does money feel stuck?',
      options: [
        { label: 'Offer, price, or packaging is unclear.', rw: 1, sw: 2, roomPick: 1 },
        { label: 'Volume or pipeline — I need more at-bats.', rw: 3, sw: 0, roomPick: 3 },
        { label: 'I have not shipped something I can sell with confidence.', rw: 0, sw: 3, roomPick: 0 }
      ]
    },
    {
      id: 'structure',
      title: 'Structure',
      prompt: 'What breaks first when you add effort?',
      options: [
        { label: 'Delivery and operations.', rw: 3, sw: 0, roomPick: 3 },
        { label: 'Positioning and narrative.', rw: 1, sw: 2, roomPick: 1 },
        { label: 'Time, boundaries, and focus.', rw: 2, sw: 1, roomPick: 2 }
      ]
    },
    {
      id: 'automation',
      title: 'Automation',
      prompt: 'How much of your work is still manual?',
      options: [
        { label: 'Most of it should already be systematized.', rw: 3, sw: 0, roomPick: 3 },
        { label: 'A few bottlenecks; the rest is fine.', rw: 2, sw: 1, roomPick: 2 },
        { label: 'I have not built repeatable steps yet.', rw: 0, sw: 3, roomPick: 0 }
      ]
    },
    {
      id: 'sovereignty',
      title: 'Sovereignty',
      prompt: 'What do you need next?',
      options: [
        { label: 'A focused room to execute.', rw: 4, sw: 0, roomPick: 4 },
        { label: 'Hands-on help to redesign the layer.', rw: 0, sw: 4, roomPick: 2 },
        { label: 'I need the diagnosis first — route me.', rw: 1, sw: 1, roomPick: 1 }
      ]
    }
  ];

  var SUMMARIES = [
    'You do not have a demand problem. You have a structure and positioning problem.',
    'The gap is not ideas. It is installation and sequence.',
    'You are early on clarity and late on execution — the next move is directional, not theoretical.'
  ];

  function loadState() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function saveState(data) {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function argmax5(votes) {
    var best = 0;
    var i;
    for (i = 1; i < 5; i++) {
      if (votes[i] > votes[best]) best = i;
    }
    return best;
  }

  function computeResult(selections) {
    var rw = 0;
    var sw = 0;
    var votes = [0, 0, 0, 0, 0];
    var i;
    for (i = 0; i < selections.length; i++) {
      var step = STEPS[i];
      var idx = selections[i];
      if (idx == null || !step.options[idx]) continue;
      var o = step.options[idx];
      rw += o.rw || 0;
      sw += o.sw || 0;
      var rp = o.roomPick;
      if (rp >= 0 && rp < 5) votes[rp] += 1;
    }
    var primaryIsRoom = rw >= sw;
    var summaryIdx = Math.min(2, Math.floor((rw + sw) / 8));
    var roomIdx = argmax5(votes);
    var roomHref = ROOM_HREFS[roomIdx] || '/playbooks';
    return {
      summary: SUMMARIES[summaryIdx] || SUMMARIES[0],
      primaryIsRoom: primaryIsRoom,
      primaryLabel: primaryIsRoom
        ? 'Your next step is execution inside one Room — one environment, one outcome.'
        : 'Your next step is deeper intervention — a service layer, not another PDF.',
      primaryHref: primaryIsRoom ? roomHref : '/private-access',
      primaryCta: 'Start here',
      secondaryHref: primaryIsRoom ? '/private-access' : roomHref,
      secondaryText: primaryIsRoom
        ? 'If you need deeper support → Services'
        : 'If you need execution first → Room'
    };
  }

  function init() {
    var overlay = global.document.getElementById('sh-diag-overlay');
    if (!overlay) return;

    var openBtn = global.document.getElementById('hero-cta-primary') || global.document.getElementById('sh-diag-open');
    var closeBtn = global.document.getElementById('sh-diag-close');
    var backdrop = global.document.querySelector('[data-sh-diag-backdrop]');
    var stepMount = global.document.getElementById('sh-diag-step-mount');
    var backBtn = global.document.getElementById('sh-diag-back');
    var nextBtn = global.document.getElementById('sh-diag-next');
    var progressEl = global.document.getElementById('sh-diag-progress');
    var navEl = global.document.getElementById('sh-diag-nav');

    var state = {
      mode: 'steps',
      stepIndex: 0,
      selections: new Array(STEPS.length)
    };

    var TRANS_MS = 260;

    function setBodyOpen(open) {
      global.document.body.classList.toggle('sh-home-diagnostic-open', open);
      global.document.documentElement.setAttribute('data-sh-home-state', open ? 'diagnostic' : 'entry');
    }

    function hydrateFromStorage() {
      var saved = loadState();
      if (saved && saved.completed && saved.result) {
        state.mode = 'result';
        state.result = saved.result;
        state.selections = saved.selections && saved.selections.length ? saved.selections : new Array(STEPS.length);
        return;
      }
      if (saved && Array.isArray(saved.selections) && saved.selections.some(function (x) { return x != null; })) {
        state.mode = 'steps';
        state.stepIndex = Math.min(STEPS.length - 1, saved.stepIndex || 0);
        state.selections = saved.selections;
        return;
      }
      state.mode = 'steps';
      state.stepIndex = 0;
      state.selections = new Array(STEPS.length);
      state.result = null;
    }

    function syncEntryCta() {
      if (!openBtn) return;
      var saved = loadState();
      if (saved && saved.completed && saved.result) {
        openBtn.textContent = 'View your route';
      } else if (saved && Array.isArray(saved.selections) && saved.selections.some(function (x) { return x != null; }) && !saved.completed) {
        openBtn.textContent = 'Continue diagnostic';
      } else {
        openBtn.textContent = 'Start Diagnostic';
      }
    }

    function openOverlay() {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      overlay.removeAttribute('inert');
      setBodyOpen(true);
      hydrateFromStorage();
      render();
      syncEntryCta();
      if (closeBtn) closeBtn.focus();
    }

    function startNewDiagnostic() {
      state = { mode: 'steps', stepIndex: 0, selections: new Array(STEPS.length), result: null };
      try {
        global.localStorage.removeItem(STORAGE_KEY);
      } catch (e1) {}
      render();
      syncEntryCta();
    }

    function closeOverlay() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('inert', '');
      setBodyOpen(false);
      global.document.documentElement.setAttribute('data-sh-home-state', 'entry');
      syncEntryCta();
      if (openBtn) openBtn.focus();
    }

    function renderStep() {
      if (!stepMount) return;
      var step = STEPS[state.stepIndex];
      var wrap = global.document.createElement('div');
      wrap.className = 'sh-diag-step-wrap';
      var promptId = 'sh-diag-prompt-' + state.stepIndex;
      wrap.innerHTML =
        '<p class="sh-diag-phase-label">' +
        step.title +
        '</p>' +
        '<p class="sh-diag-prompt" id="' +
        promptId +
        '">' +
        step.prompt +
        '</p>' +
        '<div class="sh-diag-options" role="radiogroup" aria-labelledby="' +
        promptId +
        '"></div>';
      var optsGroup = wrap.querySelector('.sh-diag-options');
      step.options.forEach(function (opt, j) {
        var optBtn = global.document.createElement('button');
        optBtn.type = 'button';
        optBtn.className = 'sh-diag-option';
        optBtn.setAttribute('role', 'radio');
        optBtn.setAttribute('aria-checked', state.selections[state.stepIndex] === j ? 'true' : 'false');
        optBtn.textContent = opt.label;
        if (state.selections[state.stepIndex] === j) optBtn.classList.add('is-selected');
        optBtn.addEventListener('click', function () {
          state.selections[state.stepIndex] = j;
          optsGroup.querySelectorAll('.sh-diag-option').forEach(function (b, k) {
            b.classList.toggle('is-selected', k === j);
            b.setAttribute('aria-checked', k === j ? 'true' : 'false');
          });
          updateNext();
        });
        optsGroup.appendChild(optBtn);
      });
      stepMount.innerHTML = '';
      stepMount.appendChild(wrap);
      if (progressEl) {
        progressEl.style.display = '';
        progressEl.textContent = 'Step ' + (state.stepIndex + 1) + ' of 5';
      }
      if (navEl) navEl.style.display = '';
      if (backBtn) backBtn.disabled = state.stepIndex === 0;
      updateNext();
    }

    function updateNext() {
      if (!nextBtn) return;
      var sel = state.selections[state.stepIndex];
      nextBtn.disabled = sel == null;
      nextBtn.textContent = state.stepIndex >= STEPS.length - 1 ? 'See result' : 'Next';
    }

    function renderResult() {
      if (!stepMount) return;
      var r = state.result || computeResult(state.selections);
      state.result = r;
      saveState({
        completed: true,
        selections: state.selections,
        result: r,
        stepIndex: STEPS.length,
        at: Date.now()
      });

      var html =
        '<div class="sh-diag-result">' +
        '<p class="sh-diag-result__primary-label">Diagnosis summary</p>' +
        '<p class="sh-diag-result__summary">' +
        r.summary +
        '</p>' +
        '<p class="sh-diag-result__primary-label">Recommended next step</p>' +
        '<p class="sh-diag-result__primary">' +
        r.primaryLabel +
        '</p>' +
        '<a class="sh-diag-result__cta" href="' +
        r.primaryHref +
        '">' +
        r.primaryCta +
        '</a>' +
        '<p class="sh-diag-result__secondary"><a href="' +
        r.secondaryHref +
        '">' +
        r.secondaryText +
        '</a></p>' +
        '<p class="sh-diag-result__new"><button type="button" class="sh-diag-new" id="sh-diag-new">New diagnostic</button></p>' +
        '</div>';
      stepMount.innerHTML = html;
      var newBtn = global.document.getElementById('sh-diag-new');
      if (newBtn) {
        newBtn.addEventListener('click', function () {
          startNewDiagnostic();
        });
      }
      if (progressEl) progressEl.style.display = 'none';
      if (navEl) navEl.style.display = 'none';
      global.document.documentElement.setAttribute('data-sh-home-state', 'result');
    }

    function render() {
      if (state.mode === 'result') {
        renderResult();
        return;
      }
      renderStep();
      global.document.documentElement.setAttribute('data-sh-home-state', 'diagnostic');
    }

    function goNext() {
      if (state.selections[state.stepIndex] == null) return;
      if (state.stepIndex >= STEPS.length - 1) {
        state.mode = 'result';
        state.result = computeResult(state.selections);
        render();
        syncEntryCta();
        return;
      }
      var el = stepMount && stepMount.querySelector('.sh-diag-step-wrap');
      if (el) el.classList.add('is-exit');
      global.setTimeout(function () {
        state.stepIndex += 1;
        saveState({
          completed: false,
          selections: state.selections,
          stepIndex: state.stepIndex
        });
        renderStep();
        var nw = stepMount && stepMount.querySelector('.sh-diag-step-wrap');
        if (nw) {
          nw.classList.add('is-enter');
          global.requestAnimationFrame(function () {
            global.requestAnimationFrame(function () {
              nw.classList.remove('is-enter');
            });
          });
        }
      }, TRANS_MS);
    }

    function goBack() {
      if (state.stepIndex === 0) return;
      var el = stepMount && stepMount.querySelector('.sh-diag-step-wrap');
      if (el) el.classList.add('is-exit');
      global.setTimeout(function () {
        state.stepIndex -= 1;
        saveState({
          completed: false,
          selections: state.selections,
          stepIndex: state.stepIndex
        });
        renderStep();
        var nw = stepMount && stepMount.querySelector('.sh-diag-step-wrap');
        if (nw) {
          nw.classList.add('is-enter');
          global.requestAnimationFrame(function () {
            global.requestAnimationFrame(function () {
              nw.classList.remove('is-enter');
            });
          });
        }
      }, TRANS_MS);
    }

    if (openBtn) {
      openBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openOverlay();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        if (state.mode === 'steps' && state.selections.some(function (x) { return x != null; })) {
          if (!global.confirm('Leave diagnostic? Progress is saved.')) return;
        }
        closeOverlay();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        if (closeBtn) closeBtn.click();
      });
    }

    if (nextBtn) nextBtn.addEventListener('click', goNext);
    if (backBtn) backBtn.addEventListener('click', goBack);

    global.document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !overlay.classList.contains('is-open')) return;
      if (closeBtn) closeBtn.click();
    });

    syncEntryCta();

    global.StephuaryHomeDiagnostic = {
      open: openOverlay,
      close: closeOverlay,
      startNew: startNewDiagnostic,
      getState: function () {
        return state;
      },
      syncEntryCta: syncEntryCta
    };
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : this);
