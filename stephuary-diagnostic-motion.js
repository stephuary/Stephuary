/**
 * Quiet step + summary motion for diagnostic phases.
 * Requires: stephuary-diagnostic-motion.css
 */
(function () {
  var EXIT_MS = 220;
  var ENTER_CLEAR_MS = 480;

  function prefersReducedMotion() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  /**
   * After user selects an answer: exit current step, then run callback (goTo / phase completion).
   * @param {HTMLElement} stepEl - the .step element
   * @param {function} done
   */
  function afterAnswer(stepEl, done) {
    if (!stepEl || typeof done !== 'function') {
      done();
      return;
    }
    if (prefersReducedMotion()) {
      window.setTimeout(done, EXIT_MS);
      return;
    }
    stepEl.classList.add('step--exiting');
    window.setTimeout(function () {
      stepEl.classList.remove('step--exiting');
      done();
      window.requestAnimationFrame(function () {
        var active = document.querySelector('#flow .step.active');
        if (!active) return;
        active.classList.add('step--entering');
        window.setTimeout(function () {
          active.classList.remove('step--entering');
        }, ENTER_CLEAR_MS);
      });
    }, EXIT_MS);
  }

  /**
   * Staggered reveal for #summary (generic: direct children).
   */
  function revealSummary() {
    document.documentElement.classList.add('diag-summary-open');
    var sum = document.getElementById('summary');
    if (!sum || prefersReducedMotion()) return;
    sum.classList.remove('summary--motion-stagger');
    void sum.offsetWidth;
    sum.classList.add('summary--motion-stagger');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var active = document.querySelector('#flow .step.active');
    if (!active || prefersReducedMotion()) return;
    active.classList.add('step--entering');
    window.setTimeout(function () {
      active.classList.remove('step--entering');
    }, 520);
  });

  window.StephuaryDiagnosticMotion = {
    afterAnswer: afterAnswer,
    revealSummary: revealSummary,
    EXIT_MS: EXIT_MS
  };
})();
