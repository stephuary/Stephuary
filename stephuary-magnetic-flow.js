/**
 * Magnetic flow: one primary next action per page, subtle timing, scroll clarity, idle hint.
 * No modals. Works with StephuaryPersonalize when present.
 */
(function (global) {
  var doc = global.document;
  var reduceMotion =
    global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function normPath(p) {
    var x = String(p || '').replace(/\/$/, '') || '/';
    return x;
  }

  function getPath() {
    return normPath(global.location.pathname);
  }

  function getDelayMs() {
    var d = 280;
    try {
      if (global.StephuaryPersonalize && typeof global.StephuaryPersonalize.refresh === 'function') {
        global.StephuaryPersonalize.refresh();
        var st = global.StephuaryPersonalize.getState();
        if (st) {
          if (st.stageConfidence === 'high') d = 210;
          else if (st.stageConfidence === 'low') d = 380;
          if (st.behavior && st.behavior.fastScroll) {
            d = Math.max(160, d - 60);
          }
          if (st.recommendedTier === 'direction-lock') d = Math.min(d, 230);
        }
      }
    } catch (e) {}
    return d;
  }

  function findPrimary() {
    var path = getPath();
    if (path === '/results') {
      var miss = doc.getElementById('state-missing');
      if (miss && miss.classList.contains('visible')) {
        return doc.getElementById('results-missing-cta') || doc.querySelector('#state-missing a[href="/capture"]');
      }
      return (
        doc.querySelector('#results-primary-cta') ||
        doc.querySelector('#actionSteps a[data-sh-flow-primary]')
      );
    }
    if (path === '/pricing') {
      return doc.querySelector('.sh-pricing-rec__cta');
    }
    var ex = doc.querySelector('[data-sh-flow-primary]');
    if (ex) return ex;
    if (path === '/') {
      return doc.querySelector('#hero-cta-primary');
    }
    if (path === '/capture') {
      return (
        doc.querySelector('#summary [data-sh-flow-primary]') ||
        doc.querySelector('#summary .action-primary a[href="/results"]')
      );
    }
    if (path === '/systems') {
      var ban = doc.getElementById('resume-banner');
      if (ban && ban.classList.contains('visible')) {
        return doc.querySelector('#resume-link');
      }
      return doc.querySelector('.sh-system-map a[href="/capture"]');
    }
    if (
      path === '/monetize' ||
      path === '/structure' ||
      path === '/automation' ||
      path === '/sovereignty'
    ) {
      return doc.querySelector('#summary [data-sh-flow-primary], #summary .action-primary .btn-solid');
    }
    return null;
  }

  function clearStates() {
    doc.querySelectorAll('.sh-magnetic--ready, .sh-magnetic--active').forEach(function (el) {
      el.classList.remove('sh-magnetic--ready', 'sh-magnetic--active');
    });
    doc.querySelectorAll('.sh-flow-dim').forEach(function (el) {
      el.classList.remove('sh-flow-dim');
    });
    doc.body.classList.remove('sh-magnetic-idle-hint');
  }

  var activateTimer = null;

  function applyPricingRecommended() {
    if (getPath() !== '/pricing') return;
    doc.querySelectorAll('.inner-tier--recommended').forEach(function (t) {
      t.classList.remove('inner-tier--recommended');
    });
    doc.querySelectorAll('.tier-cta[data-sh-flow-primary]').forEach(function (a) {
      a.removeAttribute('data-sh-flow-primary');
    });
    try {
      if (!global.StephuaryPersonalize || typeof global.StephuaryPersonalize.refresh !== 'function') return;
      global.StephuaryPersonalize.refresh();
      var st = global.StephuaryPersonalize.getState();
      if (!st || !st.recommendedTier) return;
      var tier = doc.querySelector('.inner-tier[data-tier-id="' + st.recommendedTier + '"]');
      if (tier) {
        tier.classList.add('inner-tier--recommended');
      }
    } catch (e) {}
  }

  function activate() {
    clearStates();
    applyPricingRecommended();
    var primary = findPrimary();
    if (!primary) return;
    doc.body.classList.add('sh-magnetic-flow-on');

    doc.querySelectorAll('[data-sh-flow-secondary]').forEach(function (el) {
      el.classList.add('sh-flow-dim');
    });
    if (getPath() === '/pricing') {
      doc.querySelectorAll('.tier-cta').forEach(function (cta) {
        cta.classList.add('sh-flow-dim');
      });
    }

    var delay = reduceMotion ? 0 : getDelayMs();
    if (activateTimer) global.clearTimeout(activateTimer);
    activateTimer = global.setTimeout(function () {
      primary.classList.add('sh-magnetic--ready');
      global.requestAnimationFrame(function () {
        primary.classList.add('sh-magnetic--active');
      });
    }, delay);
  }

  function bindProximity(el) {
    if (!el || reduceMotion) return;
    el.addEventListener(
      'mousemove',
      function (e) {
        var r = el.getBoundingClientRect();
        if (r.width < 1) return;
        var mx = (e.clientX - r.left) / r.width - 0.5;
        var my = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--sh-mx', (mx * 5).toFixed(2) + 'px');
        el.style.setProperty('--sh-my', (my * 4).toFixed(2) + 'px');
      },
      { passive: true }
    );
    el.addEventListener(
      'mouseleave',
      function () {
        el.style.setProperty('--sh-mx', '0px');
        el.style.setProperty('--sh-my', '0px');
      },
      { passive: true }
    );
  }

  var lastActivity = Date.now();
  var idleTimer = null;

  function bindIdleHint() {
    function check() {
      if (Date.now() - lastActivity > 2600) {
        doc.body.classList.add('sh-magnetic-idle-hint');
      } else {
        doc.body.classList.remove('sh-magnetic-idle-hint');
      }
    }
    function bump() {
      lastActivity = Date.now();
      doc.body.classList.remove('sh-magnetic-idle-hint');
    }
    ['mousemove', 'scroll', 'touchstart', 'keydown', 'wheel'].forEach(function (ev) {
      global.addEventListener(ev, bump, { passive: true });
    });
    idleTimer = global.setInterval(check, 420);
  }

  var setupOnceDone = false;
  function setupOnce() {
    if (setupOnceDone) return;
    setupOnceDone = true;
    bindScrollClarity();
    bindIdleHint();
  }

  function bindScrollClarity() {
    var sections = doc.querySelectorAll('[data-sh-flow-section]');
    if (sections.length < 2 || !('IntersectionObserver' in global)) return;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          var t = en.target;
          var clear = en.isIntersecting && en.intersectionRatio > 0.12;
          t.classList.toggle('sh-flow-section--focus', clear);
          t.classList.toggle('sh-flow-section--soft', !clear);
        });
      },
      { root: null, rootMargin: '-12% 0px -18% 0px', threshold: [0, 0.08, 0.2, 0.45, 0.75] }
    );
    sections.forEach(function (s) {
      obs.observe(s);
    });
  }

  function init() {
    setupOnce();
    activate();
    bindProximity(findPrimary());
  }

  function refresh() {
    if (activateTimer) global.clearTimeout(activateTimer);
    setupOnce();
    activate();
    bindProximity(findPrimary());
  }

  global.StephuaryMagneticFlow = {
    init: init,
    refresh: refresh,
    activate: activate
  };

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', function () {
      global.setTimeout(init, 0);
    });
  } else {
    global.setTimeout(init, 0);
  }
})(typeof window !== 'undefined' ? window : this);
