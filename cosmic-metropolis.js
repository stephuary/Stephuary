/**
 * Cosmic Metropolis — one arrival sequence per session (home only).
 */
(function () {
  var SESSION_KEY = 'stephuary_cosmic_metropolis';
  var root = document.documentElement;
  var el = null;
  var timers = [];
  var done = false;
  var touchBlock = null;

  function lockSiteShell() {
    var shell = document.getElementById('site-shell');
    if (shell && 'inert' in shell) shell.inert = true;
  }

  function releaseSiteShell() {
    var shell = document.getElementById('site-shell');
    if (shell && 'inert' in shell) shell.inert = false;
  }

  function attachTouchBlock() {
    if (touchBlock) return;
    touchBlock = function (e) {
      e.preventDefault();
    };
    document.addEventListener('touchmove', touchBlock, { passive: false, capture: true });
  }

  function detachTouchBlock() {
    if (!touchBlock) return;
    document.removeEventListener('touchmove', touchBlock, { capture: true });
    touchBlock = null;
  }

  function isHome() {
    try {
      var p = window.location.pathname || '/';
      return p === '/' || p === '/index' || p === '/index.html' || p === '/homepage' || p === '/homepage.html';
    } catch (e) {
      return false;
    }
  }

  function reduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function lowPower() {
    return window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
  }

  function markSeen() {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch (e) {}
  }

  function clearTimers() {
    timers.forEach(function (id) {
      window.clearTimeout(id);
    });
    timers = [];
  }

  function stripPhaseClasses() {
    var cl = root.classList;
    [
      'cosmic-intro--running',
      'cosmic-intro--phase-grid',
      'cosmic-intro--phase-signals',
      'cosmic-intro--phase-orbits',
      'cosmic-intro--phase-core',
      'cosmic-intro--phase-ripple',
      'cosmic-intro--phase-flash',
      'cosmic-intro--phase-copy',
      'cosmic-intro--phase-copy-a',
      'cosmic-intro--phase-copy-b',
      'cosmic-intro--phase-cta',
      'cosmic-intro--phase-hold'
    ].forEach(function (c) {
      cl.remove(c);
    });
  }

  function applySettled() {
    root.classList.add('cosmic-metropolis--settled');
  }

  function finish(instant) {
    if (done) return;
    done = true;
    clearTimers();
    detachTouchBlock();
    markSeen();
    applySettled();

    function revealSite() {
      root.classList.remove('cosmic-intro--pending');
      releaseSiteShell();
      try {
        window.dispatchEvent(new CustomEvent('cosmicmetropolisdone'));
      } catch (e) {}
    }

    if (el) {
      el.setAttribute('aria-hidden', 'true');
      if (instant) {
        stripPhaseClasses();
        el.style.display = 'none';
        el.classList.remove('cosmic-metropolis--exit');
        revealSite();
      } else {
        el.classList.add('cosmic-metropolis--exit');
        window.setTimeout(function () {
          stripPhaseClasses();
          el.style.display = 'none';
          el.classList.remove('cosmic-metropolis--exit');
          revealSite();
        }, 680);
      }
    } else {
      stripPhaseClasses();
      revealSite();
    }
  }

  function skip() {
    finish(false);
  }

  function bindSkip() {
    var opts = { passive: true, capture: true };
    function onFirstInteract() {
      skip();
      window.removeEventListener('click', onFirstInteract, true);
      window.removeEventListener('scroll', onFirstInteract, opts);
      window.removeEventListener('touchstart', onFirstInteract, opts);
      window.removeEventListener('wheel', onFirstInteract, opts);
      window.removeEventListener('keydown', onKey, true);
    }
    function onKey(e) {
      if (e.repeat) return;
      onFirstInteract();
    }
    window.addEventListener('click', onFirstInteract, true);
    window.addEventListener('scroll', onFirstInteract, opts);
    window.addEventListener('touchstart', onFirstInteract, opts);
    window.addEventListener('wheel', onFirstInteract, opts);
    window.addEventListener('keydown', onKey, true);
  }

  function schedule(fn, ms) {
    timers.push(window.setTimeout(fn, ms));
  }

  function runSequence() {
    var short = lowPower();
    /** Final hold after all copy is visible (ms); exit fade runs after this. */
    var HOLD_MS = 2500;
    var t = short
      ? { g: 200, s: 450, o: 700, c: 950, r: 1100, f: 1180, x: 1250, ca: 1350, cb: 1550, ct: 1750 }
      : { g: 520, s: 1280, o: 2080, c: 2880, r: 3180, f: 3280, x: 3420, ca: 3680, cb: 4480, ct: 5180 };

    root.classList.add('cosmic-intro--running');

    schedule(function () {
      root.classList.add('cosmic-intro--phase-grid');
    }, t.g);

    schedule(function () {
      root.classList.add('cosmic-intro--phase-signals');
    }, t.s);

    schedule(function () {
      root.classList.add('cosmic-intro--phase-orbits');
    }, t.o);

    schedule(function () {
      root.classList.add('cosmic-intro--phase-core');
    }, t.c);

    schedule(function () {
      root.classList.add('cosmic-intro--phase-ripple');
    }, t.r);

    schedule(function () {
      root.classList.add('cosmic-intro--phase-flash');
    }, t.f);

    schedule(function () {
      root.classList.remove('cosmic-intro--phase-flash');
    }, t.x);

    schedule(function () {
      root.classList.add('cosmic-intro--phase-copy', 'cosmic-intro--phase-copy-a');
    }, t.ca);

    schedule(function () {
      root.classList.add('cosmic-intro--phase-copy-b');
    }, t.cb);

    schedule(function () {
      root.classList.add('cosmic-intro--phase-cta', 'cosmic-intro--phase-hold');
    }, t.ct);

    schedule(function () {
      finish(false);
    }, t.ct + HOLD_MS);
  }

  function init() {
    if (!isHome()) return;
    if (!root.classList.contains('cosmic-intro--pending')) return;

    el = document.getElementById('cosmic-metropolis');
    if (!el) {
      stripPhaseClasses();
      root.classList.remove('cosmic-intro--pending');
      releaseSiteShell();
      markSeen();
      return;
    }

    if (reduceMotion()) {
      el.style.display = 'none';
      markSeen();
      applySettled();
      root.classList.remove('cosmic-intro--pending');
      releaseSiteShell();
      return;
    }

    el.setAttribute('aria-hidden', 'false');
    lockSiteShell();
    attachTouchBlock();
    bindSkip();
    runSequence();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
