/**
 * DiagnosticFlow: five phase panels (existing copy from phase pages) + result.
 * Same-page overlay on index — no route change for the orientation flow.
 */
(function (global) {
  var STORAGE_KEY = 'stephuary_home_diag_flow_v2';
  var LEGACY_KEY = 'stephuary_home_diag_v1';
  var PHASE_COUNT = 5;

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

  /** Result after orientation: full interactive diagnostic starts at Capture. */
  function buildResult() {
    return {
      summary:
        'You need to run the interactive diagnostic to lock what breaks first. Capture anchors the full five-phase sequence on this device.',
      primaryLabel: 'Your next step is Phase 01 — Capture — where the questions write your live read.',
      primaryHref: '/capture',
      primaryCta: 'Start here',
      secondaryHref: '/private-access',
      secondaryText: 'If you need deeper support → Services'
    };
  }

  function init() {
    try {
      global.localStorage.removeItem(LEGACY_KEY);
    } catch (e0) {}

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
      currentStep: 1,
      result: null
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
        state.currentStep = PHASE_COUNT;
        return;
      }
      if (saved && saved.mode === 'steps' && typeof saved.currentStep === 'number') {
        state.mode = 'steps';
        state.currentStep = Math.min(PHASE_COUNT, Math.max(1, saved.currentStep));
        state.result = null;
        return;
      }
      state.mode = 'steps';
      state.currentStep = 1;
      state.result = null;
    }

    function syncEntryCta() {
      if (!openBtn) return;
      var saved = loadState();
      if (saved && saved.completed && saved.result) {
        openBtn.textContent = 'View your route';
      } else if (saved && saved.mode === 'steps' && saved.currentStep > 1 && !saved.completed) {
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
      state = { mode: 'steps', currentStep: 1, result: null };
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

    function renderPhaseStep() {
      if (!stepMount) return;
      var tpl = global.document.getElementById('sh-diag-phase-' + state.currentStep);
      var wrap = global.document.createElement('div');
      wrap.className = 'sh-diag-step-wrap';
      if (state.currentStep === 1) wrap.classList.add('sh-diag-step-wrap--capture');

      if (tpl && tpl.content) {
        wrap.appendChild(global.document.importNode(tpl.content, true));
      } else {
        wrap.innerHTML =
          '<p class="sh-diag-phase-fallback">Phase ' +
          state.currentStep +
          ' content is missing.</p>';
      }

      stepMount.innerHTML = '';
      stepMount.appendChild(wrap);
      if (progressEl) {
        progressEl.style.display = '';
        progressEl.textContent = 'Step ' + state.currentStep + ' of 5';
      }
      if (navEl) navEl.style.display = '';
      if (backBtn) backBtn.disabled = state.currentStep <= 1;
      updateNext();
    }

    function updateNext() {
      if (!nextBtn) return;
      nextBtn.disabled = false;
      nextBtn.textContent = state.currentStep >= PHASE_COUNT ? 'See result' : 'Next';
    }

    function renderResult() {
      if (!stepMount) return;
      var r = state.result || buildResult();
      state.result = r;
      saveState({
        mode: 'result',
        completed: true,
        currentStep: PHASE_COUNT,
        result: r,
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
        '<p class="sh-diag-result__new"><button type="button" class="sh-diag-new" id="sh-diag-new">Run orientation again</button></p>' +
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
      renderPhaseStep();
      global.document.documentElement.setAttribute('data-sh-home-state', 'diagnostic');
    }

    function persistStep() {
      saveState({
        mode: 'steps',
        completed: false,
        currentStep: state.currentStep
      });
    }

    function goNext() {
      if (state.currentStep >= PHASE_COUNT) {
        state.mode = 'result';
        state.result = buildResult();
        render();
        syncEntryCta();
        return;
      }
      var el = stepMount && stepMount.querySelector('.sh-diag-step-wrap');
      if (el) el.classList.add('is-exit');
      global.setTimeout(function () {
        state.currentStep += 1;
        persistStep();
        renderPhaseStep();
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
      if (state.currentStep <= 1) return;
      var el = stepMount && stepMount.querySelector('.sh-diag-step-wrap');
      if (el) el.classList.add('is-exit');
      global.setTimeout(function () {
        state.currentStep -= 1;
        persistStep();
        renderPhaseStep();
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
        if (state.mode === 'steps' && state.currentStep > 1) {
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

    global.StephuaryDiagnosticFlow = {
      getCurrentStep: function () {
        return state.currentStep;
      },
      getMode: function () {
        return state.mode;
      }
    };
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : this);
