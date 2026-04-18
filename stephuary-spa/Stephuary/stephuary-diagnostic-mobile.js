/**
 * Diagnostic phases 01–05: mobile scroll + safe insets helpers.
 * Loaded on capture, monetize, structure, automation, sovereignty.
 */
(function (global) {
  var MQ_COMPACT = '(max-width: 768px)';

  function prefersReducedMotion() {
    try {
      return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function scrollBehaviorForNav() {
    if (prefersReducedMotion()) return 'auto';
    try {
      if (global.matchMedia && global.matchMedia(MQ_COMPACT).matches) return 'auto';
    } catch (e2) {}
    return 'smooth';
  }

  if (typeof global.history !== 'undefined' && 'scrollRestoration' in global.history) {
    try {
      global.history.scrollRestoration = 'manual';
    } catch (e3) {}
  }

  function stickyNavHeight() {
    var nav = document.querySelector('.global-nav');
    if (nav) {
      var r = nav.getBoundingClientRect();
      if (r.height > 0) return r.height;
    }
    var topNav = document.querySelector('.top-nav');
    if (topNav) {
      var pos = window.getComputedStyle(topNav).position;
      if (pos === 'sticky' || pos === 'fixed') {
        var r2 = topNav.getBoundingClientRect();
        if (r2.height > 0) return r2.height;
      }
    }
    return 0;
  }

  function flowVisible() {
    var flow = document.getElementById('flow');
    if (!flow) return false;
    var cs = window.getComputedStyle(flow);
    return cs.display !== 'none' && cs.visibility !== 'hidden';
  }

  /**
   * Scroll so the active question (or #flow) sits below fixed/sticky top chrome.
   */
  function scrollToActiveQuestion(opts) {
    opts = opts || {};
    if (!flowVisible()) return;
    var behavior = opts.behavior != null ? opts.behavior : scrollBehaviorForNav();
    var step =
      document.querySelector('#steps-root .step.active') ||
      document.querySelector('#flow .step.active');
    var el = step || document.getElementById('flow');
    if (!el) return;

    var docEl = document.documentElement;
    var navPad = 0;
    try {
      var v = global.getComputedStyle(docEl).getPropertyValue('--diag-nav-offset');
      if (v) navPad = parseFloat(v) || 0;
    } catch (e4) {}

    var navH = stickyNavHeight();
    var extra = typeof opts.offsetExtra === 'number' ? opts.offsetExtra : 8;
    var top =
      el.getBoundingClientRect().top +
      (global.pageYOffset || docEl.scrollTop) -
      Math.max(navH, navPad) -
      extra;

    global.scrollTo({ top: Math.max(0, top), behavior: behavior });
  }

  function scrollToSummary(opts) {
    opts = opts || {};
    var summary = document.getElementById('summary');
    if (!summary) return;
    var cs = window.getComputedStyle(summary);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    var behavior = opts.behavior != null ? opts.behavior : scrollBehaviorForNav();
    var navH = stickyNavHeight();
    var extra = 8;
    var top =
      summary.getBoundingClientRect().top +
      (global.pageYOffset || document.documentElement.scrollTop) -
      navH -
      extra;
    global.scrollTo({ top: Math.max(0, top), behavior: behavior });
  }

  function scrollToTop(opts) {
    opts = opts || {};
    var behavior = opts.behavior != null ? opts.behavior : scrollBehaviorForNav();
    global.scrollTo({ top: 0, behavior: behavior });
  }

  function runAfterLayout(fn) {
    global.requestAnimationFrame(function () {
      global.requestAnimationFrame(fn);
    });
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else fn();
  }

  function syncTopNavDetailsOpen() {
    var d = document.querySelector('.diag-top-nav-details');
    if (!d) return;
    try {
      d.open = global.matchMedia && global.matchMedia('(min-width: 769px)').matches;
    } catch (e5) {}
  }

  function bindTopNavDetailsMedia() {
    try {
      var m = global.matchMedia('(min-width: 769px)');
      if (m && m.addEventListener) m.addEventListener('change', syncTopNavDetailsOpen);
      else if (m && m.addListener) m.addListener(syncTopNavDetailsOpen);
    } catch (e6) {}
  }

  function initialScrollFix() {
    runAfterLayout(function () {
      syncTopNavDetailsOpen();
      var sum = document.getElementById('summary');
      var sumOn =
        sum &&
        (sum.style.display === 'flex' ||
          sum.style.display === 'block' ||
          window.getComputedStyle(sum).display === 'flex' ||
          window.getComputedStyle(sum).display === 'block');
      if (sumOn) {
        scrollToSummary({ behavior: 'auto' });
      } else if (flowVisible()) {
        scrollToActiveQuestion({ behavior: 'auto' });
      } else {
        scrollToTop({ behavior: 'auto' });
      }
    });
  }

  function initCaptureLiveReadDrawer() {
    var body = document.body;
    if (!body.classList.contains('page-capture')) return;
    var toggle = document.getElementById('liveReadDrawerToggle');
    var backdrop = document.getElementById('liveReadBackdrop');
    if (!toggle || !backdrop) return;

    function setOpen(on) {
      body.classList.toggle('capture-live-read-open', !!on);
      toggle.setAttribute('aria-expanded', on ? 'true' : 'false');
      backdrop.setAttribute('aria-hidden', on ? 'false' : 'true');
      try {
        var shell = document.getElementById('livePanelShell');
        if (shell && global.matchMedia && global.matchMedia('(max-width:768px)').matches) {
          shell.open = !!on;
        }
      } catch (eS) {}
    }

    toggle.addEventListener('click', function () {
      setOpen(!body.classList.contains('capture-live-read-open'));
    });

    backdrop.addEventListener('click', function () {
      setOpen(false);
    });

    global.addEventListener(
      'keydown',
      function (e) {
        if (e.key !== 'Escape') return;
        if (!body.classList.contains('capture-live-read-open')) return;
        setOpen(false);
      },
      true
    );

    try {
      var mq = global.matchMedia('(max-width:768px)');
      function sync() {
        if (!mq.matches) setOpen(false);
      }
      if (mq.addEventListener) mq.addEventListener('change', sync);
      else if (mq.addListener) mq.addListener(sync);
      sync();
    } catch (eMq) {}
  }

  function initLivePanelChrome() {
    var shell = document.getElementById('livePanelShell');
    if (!shell) return;
    try {
      document.body.classList.add('diag-has-live-chrome');
    } catch (eL) {}
    function applyDesktopOpen() {
      try {
        if (global.matchMedia && global.matchMedia('(min-width: 961px)').matches) {
          shell.open = true;
        }
      } catch (e0) {}
    }
    applyDesktopOpen();
    try {
      var mq = global.matchMedia('(min-width: 961px)');
      if (mq && mq.addEventListener) mq.addEventListener('change', applyDesktopOpen);
      else if (mq && mq.addListener) mq.addListener(applyDesktopOpen);
    } catch (e1) {}
    shell.addEventListener('toggle', function () {
      try {
        if (global.matchMedia && !global.matchMedia('(min-width: 961px)').matches) {
          document.body.classList.toggle('diag-live-open', !!shell.open);
        } else {
          document.body.classList.remove('diag-live-open');
        }
      } catch (e2) {}
    });
  }

  onReady(function () {
    syncTopNavDetailsOpen();
    bindTopNavDetailsMedia();
    initLivePanelChrome();
    initCaptureLiveReadDrawer();
    initialScrollFix();
  });

  global.addEventListener('pageshow', function (ev) {
    if (ev.persisted) initialScrollFix();
  });

  global.StephuaryDiagnosticMobile = {
    scrollToActiveQuestion: scrollToActiveQuestion,
    scrollToSummary: scrollToSummary,
    scrollToTop: scrollToTop,
    MQ_COMPACT: MQ_COMPACT
  };
})(typeof window !== 'undefined' ? window : this);
