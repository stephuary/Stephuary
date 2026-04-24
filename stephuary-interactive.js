(function () {
  (function initTimeAtmosphere() {
    if (window.__STEPHUARY_TIME_ATMOSPHERE_INIT) return;
    window.__STEPHUARY_TIME_ATMOSPHERE_INIT = true;
    try {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/stephuary-time-atmosphere.css';
      var head = document.head || document.getElementsByTagName('head')[0];
      if (head) head.appendChild(link);
    } catch (e) {}

    function computeTimeState() {
      var t = new Date().getHours() * 60 + new Date().getMinutes();
      if (t >= 180 && t < 420) return 'early';
      if (t >= 540 && t < 1020) return 'day';
      if (t >= 1080 && t < 1320) return 'evening';
      return 'night';
    }

    function applyTimeState() {
      if (!document.body) return;
      try {
        document.body.setAttribute('data-time', computeTimeState());
      } catch (e2) {}
    }

    if (document.body) applyTimeState();
    else document.addEventListener('DOMContentLoaded', applyTimeState);
    setInterval(applyTimeState, 60000);
  })();

  if (window.__STEPHUARY_INTERACTIVE_LOADED) return;
  window.__STEPHUARY_INTERACTIVE_LOADED = true;

  if (typeof window.STEPHUARY_CONFIG === 'undefined') {
    var _PAID = {
      diagnostic: '/capture',
      rooms: '/systems',
      'direction-system': '/direction-system',
      'revenue-system': '/revenue-system',
      'direction-lock': '/focused-review',
      'concept-build': '/private-access',
      snapshot: '/snapshot'
    };
    window.STEPHUARY_CONFIG = {
      FREE_MODE: false,
      PAID_TIER_HREF: _PAID,
      FREE_TIER_HREF: {},
      getTierPurchaseHref: function (tierId) {
        if (!tierId) return null;
        return Object.prototype.hasOwnProperty.call(_PAID, tierId) ? _PAID[tierId] : null;
      },
      shouldBypassPhasePaymentGate: function () {
        return false;
      },
      PRICING_STAIRCASE_VIDEO:
        'https://customer-vjyp7ff1wau3k7is.cloudflarestream.com/482fd025db674eaf7f1246937e0145b2/manifest/video.m3u8',
      PRICING_STAIRCASE_POSTER:
        'https://customer-vjyp7ff1wau3k7is.cloudflarestream.com/482fd025db674eaf7f1246937e0145b2/thumbnails/thumbnail.jpg?height=1080'
    };
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 767px)').matches;
  var PHASE_PATHS = ['/capture', '/monetize', '/structure', '/automation', '/sovereignty'];
  var PHASE_SHORT = ['Capture', 'Monetize', 'Structure', 'Automation', 'Sovereignty'];
  var STORAGE_VISITED = 'stephuary_phases_visited';
  var SESSION_SNAPSHOT_KEY = 'stephuary_session_snapshot_v1';
  var CAPTURE_STORE_KEYS = ['stephuary_capture_p01_v3', 'stephuary_capture_p01_v2'];
  var RESULT_STORE_KEY = 'stephuary_result_v1';
  var PROGRESS_KEY = 'stephuary_system_progress_v1';
  var OS_KEY = 'stephuary_os_v1';
  var ROOM_CHAIN = ['/systems'];
  var PHASE_CHAIN = {
    '/capture': '/monetize',
    '/monetize': '/structure',
    '/structure': '/automation',
    '/automation': '/sovereignty',
    '/sovereignty': '/results'
  };

  function normPath(p) {
    if (!p || p === '') return '/';
    var x = String(p).replace(/\/$/, '') || '/';
    return x;
  }

  function lsGetJson(k) {
    try {
      var r = localStorage.getItem(k);
      return r ? JSON.parse(r) : null;
    } catch (e) {
      return null;
    }
  }

  function lsGetCaptureJson() {
    var i;
    for (i = 0; i < CAPTURE_STORE_KEYS.length; i++) {
      var o = lsGetJson(CAPTURE_STORE_KEYS[i]);
      if (o) return o;
    }
    return null;
  }

  function lsSetJson(k, o) {
    try {
      localStorage.setItem(k, JSON.stringify(o));
    } catch (e) {}
  }

  var StephuarySession = {
    hasActiveSession: function () {
      try {
        if (localStorage.getItem('capture_complete') === 'true') return true;
        var cap = lsGetCaptureJson();
        if (cap && typeof cap.currentStep === 'number' && cap.currentStep > 1) return true;
        if (cap && cap.bits && cap.bits.some(function (b) { return b !== null && b !== undefined; })) return true;
        var res = lsGetJson(RESULT_STORE_KEY);
        if (res && (res.type_primary || res.diagnostic)) return true;
        var pr = lsGetJson(PROGRESS_KEY);
        if (pr && ((pr.completed && pr.completed.length) || (pr.phase && pr.phase > 1))) return true;
        var os = lsGetJson(OS_KEY);
        if (os && os.lastRoomId) return true;
      } catch (e) {}
      return false;
    },

    getResumeDiagnosticHref: function () {
      if (window.StephuaryDiagnosticFlow && typeof window.StephuaryDiagnosticFlow.getResumeHref === 'function') {
        try {
          window.StephuaryDiagnosticFlow.migrateCompletionFlags();
          return window.StephuaryDiagnosticFlow.getResumeHref();
        } catch (eD) {}
      }
      if (window.StephuaryProgress && typeof window.StephuaryProgress.getResumeLabel === 'function') {
        var lbl = window.StephuaryProgress.getResumeLabel();
        if (lbl && lbl.href) return lbl.href;
      }
      var cap = lsGetCaptureJson();
      if (cap && cap.currentStep) return '/capture';
      return '/capture';
    },

    suggestNextHref: function (path) {
      var n = normPath(path);
      if (n === '/capture') {
        if (localStorage.getItem('capture_complete') === 'true') return '/monetize';
        return '/capture';
      }
      if (n === '/results') return '/systems';
      if (PHASE_CHAIN[n]) return PHASE_CHAIN[n];
      for (var i = 0; i < ROOM_CHAIN.length; i++) {
        if (ROOM_CHAIN[i] === n) return i < ROOM_CHAIN.length - 1 ? ROOM_CHAIN[i + 1] : '/systems';
      }
      return '/systems';
    },

    getContextualOutput: function () {
      var res = lsGetJson(RESULT_STORE_KEY);
      if (res && res.diagnostic) {
        var d = res.diagnostic;
        var ver = res.result_version || 'mixed_general';
        var h = 5.5 + (ver.length % 7) * 1.35 + (res.type_primary ? res.type_primary.length * 0.04 : 0);
        h = Math.min(28, Math.max(2.5, h));
        var rate = 52 + (String(ver).split('').reduce(function (a, c) { return a + c.charCodeAt(0); }, 0) % 38);
        var money = Math.round(h * rate * 48 / 100) * 100;
        return {
          targetMoney: money,
          targetHours: h,
          cat: res.type_primary || 'Diagnostic profile',
          act: d.fix_first || 'Pick one move from your results and schedule it.',
          timeLine: d.what_it_costs || d.main_problem || '',
          useContextual: true
        };
      }
      var cap = lsGetCaptureJson();
      if (cap && cap.bits && cap.bits.length) {
        var filled = 0;
        for (var i = 0; i < cap.bits.length; i++) {
          if (cap.bits[i] !== null && cap.bits[i] !== undefined) filled++;
        }
        if (filled > 0) {
          var h2 = 2.2 + filled * 0.85 + (cap.currentStep || 1) * 0.12;
          h2 = Math.min(22, h2);
          var money2 = Math.round(12000 + filled * 2400 + (cap.currentStep || 1) * 400);
          var lines = [
            'Incomplete passes keep attention split across open threads.',
            'Each unanswered step leaves cost unmeasured.',
            'Stopping mid-diagnostic freezes the pattern before it is named.'
          ];
          return {
            targetMoney: money2,
            targetHours: h2,
            cat: 'In-progress diagnostic',
            act: 'Finish the remaining questions so the readout can lock.',
            timeLine: lines[Math.min(lines.length - 1, Math.floor(filled / 3))],
            useContextual: true
          };
        }
      }
      return null;
    },

    persistSnapshot: function (extra) {
      var snap = {
        at: Date.now(),
        path: normPath(window.location.pathname),
        phase: null,
        room: null,
        captureStep: null,
        resultType: null
      };
      try {
        var pr = lsGetJson(PROGRESS_KEY);
        if (pr) snap.phase = pr.phase;
        var os = lsGetJson(OS_KEY);
        if (os && os.lastRoomId) snap.room = os.lastRoomId;
        var cap = lsGetCaptureJson();
        if (cap && cap.currentStep != null) snap.captureStep = cap.currentStep;
        var res = lsGetJson(RESULT_STORE_KEY);
        if (res && res.type_primary) snap.resultType = res.type_primary;
      } catch (e) {}
      if (extra && typeof extra === 'object') {
        for (var k in extra) {
          if (Object.prototype.hasOwnProperty.call(extra, k)) snap[k] = extra[k];
        }
      }
      lsSetJson(SESSION_SNAPSHOT_KEY, snap);
    }
  };

  window.StephuarySession = StephuarySession;

  var SPATIAL_NAV_KEY = 'sh_spatial_nav';

  function ensurePageTransitionOverlay() {
    var el = document.getElementById('page-transition');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'page-transition';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    return el;
  }

  /* ——— Spatial page transition (outbound) + entry (inbound) ——— */
  function initPageTransition() {
    var overlay = ensurePageTransitionOverlay();

    document.addEventListener(
      'click',
      function (e) {
        var a = e.target.closest && e.target.closest('a[href]');
        if (!a || a.target === '_blank' || a.getAttribute('download')) return;
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) !== '/') return;
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
        try {
          var u = new URL(a.href, window.location.origin);
          if (u.pathname === window.location.pathname) return;
        } catch (err) {
          return;
        }
        e.preventDefault();
        var url = a.href;
        if (reduceMotion) {
          try {
            sessionStorage.setItem(SPATIAL_NAV_KEY, '1');
          } catch (err2) {}
          window.location.href = url;
          return;
        }
        try {
          sessionStorage.setItem(SPATIAL_NAV_KEY, '1');
        } catch (err3) {}
        document.body.classList.add('sh-transition-out');
        overlay.classList.add('is-active', 'sh-outgoing');
        var delay = isMobile ? 200 : 280;
        window.setTimeout(function () {
          window.location.href = url;
        }, delay);
      },
      true
    );
  }

  function initSpatialNavigation() {
    if (!document.body) return;
    if (reduceMotion) {
      document.body.classList.add('sh-page-ready');
      return;
    }

    var landing = false;
    try {
      landing = sessionStorage.getItem(SPATIAL_NAV_KEY) === '1';
      if (landing) sessionStorage.removeItem(SPATIAL_NAV_KEY);
    } catch (e) {}

    /* Pricing: skip soft-entry (opacity:0 on body children) — avoids blank/stuck paint on heavy CSS. */
    if (document.body.classList.contains('pricing-page') && !landing) {
      document.body.classList.add('sh-page-ready');
      return;
    }

    var ov = ensurePageTransitionOverlay();

    if (landing) {
      document.documentElement.classList.add('sh-landing-pending');
      ov.classList.add('is-active', 'sh-landing');
      document.body.classList.add('sh-page-entry', 'sh-spatial-from-nav');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          document.documentElement.classList.remove('sh-landing-pending');
          ov.classList.add('sh-revealing');
          document.body.classList.add('sh-page-entry--reveal');
          window.setTimeout(function () {
            ov.classList.remove('is-active', 'sh-landing', 'sh-revealing', 'sh-outgoing');
            document.body.classList.remove('sh-transition-out');
            document.body.classList.remove('sh-page-entry', 'sh-page-entry--reveal', 'sh-spatial-from-nav');
            document.body.classList.add('sh-page-ready');
          }, isMobile ? 400 : 540);
        });
      });
    } else {
      document.body.classList.add('sh-page-soft-entry');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          document.body.classList.add('sh-page-soft-entry--on');
          window.setTimeout(function () {
            document.body.classList.add('sh-page-ready');
          }, 440);
        });
      });
    }

    function recoverPageInteractable() {
      try {
        var o = document.getElementById('page-transition');
        if (o) o.classList.remove('is-active', 'sh-outgoing', 'sh-landing', 'sh-revealing');
        document.documentElement.classList.remove('sh-landing-pending');
        document.body.classList.remove(
          'sh-transition-out',
          'sh-page-entry',
          'sh-page-entry--reveal',
          'sh-spatial-from-nav',
          'sh-page-soft-entry',
          'sh-page-soft-entry--on'
        );
        document.body.classList.add('sh-page-ready');
      } catch (err) {}
    }

    window.addEventListener(
      'pageshow',
      function (ev) {
        if (!ev.persisted) return;
        recoverPageInteractable();
      },
      false
    );

    /* If boot() or env init fails before soft-entry finishes, the page can stay invisible. */
    window.setTimeout(function () {
      try {
        if (!document.body || document.body.classList.contains('sh-page-ready')) return;
        recoverPageInteractable();
      } catch (err2) {}
    }, 2800);
  }

  function magneticStrength() {
    return document.body.classList.contains('sys-adaptive--engaged') ? 0.14 : 0.08;
  }

  /* ——— Magnetic ——— */
  function initMagnetic() {
    if (reduceMotion || isMobile) return;
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        var s = magneticStrength();
        el.style.transform = 'translate(' + dx * s + 'px,' + dy * s + 'px) scale(1.02)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ——— Compact header particles ——— */
  /* ——— Global environment depth (particles + horizon + parallax) ——— */
  function initParallaxDepthVars() {
    var doc = document.documentElement;
    var mx = 0;
    var my = 0;
    var ticking = false;
    function apply() {
      ticking = false;
      var w = window.innerWidth || 1;
      var h = window.innerHeight || 1;
      var px = (mx / w - 0.5) * 2;
      var py = (my / h - 0.5) * 2;
      var maxS = Math.max(1, (document.documentElement.scrollHeight || 1) - h);
      var sd = Math.min(1, (window.scrollY || 0) / maxS);
      var sy = window.scrollY || 0;
      var bgPx = -sy * (isMobile ? 0.022 : 0.042);
      var fgPx = sy * (isMobile ? 0.008 : 0.016);
      var sc = 1 + Math.min(0.006, sy * 0.0001);
      doc.style.setProperty('--sh-parallax-x', px.toFixed(5));
      doc.style.setProperty('--sh-parallax-y', py.toFixed(5));
      doc.style.setProperty('--sh-scroll-d', sd.toFixed(5));
      doc.style.setProperty('--sh-scroll-bg', bgPx.toFixed(2) + 'px');
      doc.style.setProperty('--sh-scroll-fg', fgPx.toFixed(2) + 'px');
      doc.style.setProperty('--sh-scroll-scale', sc.toFixed(5));
      window.__shParallax = { x: px, y: py, sd: sd, sy: sy };
    }
    function req() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    }
    document.addEventListener(
      'mousemove',
      function (e) {
        mx = e.clientX;
        my = e.clientY;
        req();
      },
      { passive: true }
    );
    window.addEventListener(
      'scroll',
      function () {
        req();
      },
      { passive: true }
    );
    apply();
  }

  function initEnvironmentPulse() {
    document.addEventListener(
      'sh-env-pulse',
      function () {
        document.body.classList.add('sh-env-pulse');
        window.setTimeout(function () {
          document.body.classList.remove('sh-env-pulse');
        }, 720);
      },
      false
    );
  }

  function initPricingImmersiveZone() {
    var path = normPath(window.location.pathname);
    if (path !== '/pricing') return;
    function bind() {
      var cb = document.getElementById('tier-custom-build');
      var gate = document.getElementById('pricing-build-gate');
      function setImmersive(on) {
        document.body.classList.toggle('sh-zone--immersive', !!on);
      }
      if (cb) {
        cb.addEventListener('toggle', function () {
          setImmersive(!!cb.open);
        });
        if (cb.open) setImmersive(true);
      }
      if (gate) {
        var obs = new MutationObserver(function () {
          setImmersive(!gate.hasAttribute('hidden'));
        });
        obs.observe(gate, { attributes: true, attributeFilter: ['hidden'] });
        if (!gate.hasAttribute('hidden')) setImmersive(true);
      }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
    else bind();
    window.setTimeout(bind, 400);
  }

  function initEnvironmentDepth() {
    if (document.getElementById('sh-env-depth')) return;
    if (!document.body) return;

    var path = normPath(window.location.pathname);

    /* Pricing uses its own earth aura in pricing.html. The global #sh-env-depth layer
       (blue grid + particles) stacks above body::before and hid the aura after JS ran. */
    if (path === '/pricing') {
      initPricingImmersiveZone();
      return;
    }

    /* Access page: local screening-room atmosphere only — no CEI depth layer. */
    if (path === '/access') return;

    /* System map: CSS-only portal atmosphere in systems.html — no canvas/grid CEI layer. */
    if (path === '/systems') return;

    var zone = 'default';
    if (path === '/systems' || path === '/') zone = 'cei';
    else if (path === '/pricing') zone = 'pricing';
    else if (path === '/capture' || path === '/results' || path === '/execution' || path === '/systems') zone = 'cei';

    var mobileLight = isMobile;
    var body = document.body;
    var earlySky =
      typeof document !== 'undefined' &&
      document.documentElement &&
      document.documentElement.classList.contains('early-mode');
    if (earlySky) {
      try {
        body.classList.add('sh-env-early-sky');
      } catch (e) {}
    }
    body.classList.add('sh-zone--' + zone);
    if (path === '/results') body.classList.add('sh-page--results');
    if (path === '/execution') body.classList.add('sh-page--execution');

    var root = document.createElement('div');
    root.id = 'sh-env-depth';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML =
      '<div class="sh-depth-field" aria-hidden="true"></div>' +
      '<div class="sh-horizon" aria-hidden="true">' +
      '<div class="sh-horizon__radial"></div>' +
      '<div class="sh-horizon__grid"></div>' +
      '</div>' +
      '<canvas class="sh-depth-canvas sh-depth-canvas--bg"></canvas>' +
      '<canvas class="sh-depth-canvas sh-depth-canvas--mid"></canvas>' +
      '<div class="sh-depth-fg-wrap"><canvas class="sh-depth-canvas sh-depth-canvas--fg"></canvas></div>';

    body.insertBefore(root, body.firstChild);
    body.classList.add('sh-has-env-depth');
    if (mobileLight) body.classList.add('sh-mobile-depth');

    initParallaxDepthVars();
    initEnvironmentPulse();
    initPricingImmersiveZone();

    if (reduceMotion) return;

    var cBg = root.querySelector('.sh-depth-canvas--bg');
    var cMid = root.querySelector('.sh-depth-canvas--mid');
    var cFg = root.querySelector('.sh-depth-canvas--fg');
    if (!cBg || !cMid || !cFg) return;

    var ctxBg = cBg.getContext('2d');
    var ctxMid = cMid.getContext('2d');
    var ctxFg = cFg.getContext('2d');
    if (!ctxBg || !ctxMid || !ctxFg) return;

    function makePts(n, opts) {
      var out = [];
      var i;
      for (i = 0; i < n; i++) {
        out.push({
          x: Math.random() * 400,
          y: Math.random() * 400,
          r: opts.r0 + Math.random() * (opts.r1 - opts.r0),
          a: opts.a0 + Math.random() * (opts.a1 - opts.a0),
          vx: (Math.random() - 0.5) * opts.vx,
          vy: (Math.random() - 0.5) * opts.vy
        });
      }
      return out;
    }

    var nBg = mobileLight ? 28 : 68;
    var nMid = mobileLight ? 22 : 46;
    var nFg = mobileLight ? 0 : 24;
    if (earlySky) {
      nBg = mobileLight ? 2 : 3;
      nMid = 0;
      nFg = 0;
    }

    var ptsBg = makePts(
      nBg,
      earlySky
        ? { r0: 0.12, r1: 0.45, a0: 0.008, a1: 0.028, vx: 0.04, vy: 0.04 }
        : { r0: 0.12, r1: 0.55, a0: 0.012, a1: 0.042, vx: 0.05, vy: 0.05 }
    );
    var ptsMid = earlySky ? [] : makePts(nMid, { r0: 0.35, r1: 1.15, a0: 0.035, a1: 0.1, vx: 0.14, vy: 0.14 });
    var ptsFg = !earlySky && nFg ? makePts(nFg, { r0: 1.0, r1: 2.6, a0: 0.07, a1: 0.16, vx: 0.28, vy: 0.28 }) : [];

    var cloudPts = [];
    function makeCloudPts(w, h) {
      var out = [];
      var i;
      for (i = 0; i < 5; i++) {
        out.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.72,
          rx: 72 + Math.random() * 108,
          ry: 26 + Math.random() * 42,
          a: 0.032 + Math.random() * 0.048,
          vx: 0.1 + Math.random() * 0.18,
          vy: (Math.random() - 0.5) * 0.055
        });
      }
      return out;
    }

    function stepCloudPts(pts, w, h, mult) {
      var i;
      var p;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        p.x += p.vx * mult;
        p.y += p.vy * mult;
        if (p.x > w + p.rx * 1.2) p.x = -p.rx * 1.2;
        if (p.x < -p.rx * 1.2) p.x = w + p.rx * 1.2;
        if (p.y < -p.ry) p.y = h * 0.15;
        if (p.y > h + p.ry) p.y = h * 0.1;
      }
    }

    function drawEarlySkyLayers() {
      var w = cBg.width / dprCap;
      var h = cBg.height / dprCap;
      var fadeBg = 'rgba(18,10,12,0.11)';
      var fadeMid = 'rgba(22,14,12,0.1)';
      ctxBg.fillStyle = fadeBg;
      ctxBg.fillRect(0, 0, w, h);
      ctxMid.fillStyle = fadeMid;
      ctxMid.fillRect(0, 0, w, h);
      var i;
      var p;
      var a;
      for (i = 0; i < ptsBg.length; i++) {
        p = ptsBg[i];
        a = p.a * (0.82 + 0.18 * Math.sin(t + p.x * 0.005));
        if (a > 0.08) a = 0.08;
        ctxBg.beginPath();
        ctxBg.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctxBg.fillStyle = 'rgba(232,220,205,' + a + ')';
        ctxBg.fill();
      }
      var pulse = document.body.classList.contains('sh-env-pulse') ? 1.18 : 1;
      for (i = 0; i < cloudPts.length; i++) {
        p = cloudPts[i];
        var cx = p.x;
        var cy = p.y;
        var ca = p.a * pulse;
        var grd = ctxMid.createRadialGradient(cx, cy, 0, cx, cy, p.rx * 1.15 * pulse);
        grd.addColorStop(0, 'rgba(230,205,165,' + ca * 0.9 + ')');
        grd.addColorStop(0.4, 'rgba(195,155,105,' + ca * 0.45 + ')');
        grd.addColorStop(0.75, 'rgba(155,110,75,' + ca * 0.12 + ')');
        grd.addColorStop(1, 'rgba(120,85,60,0)');
        ctxMid.save();
        ctxMid.translate(cx, cy);
        ctxMid.scale(1, Math.max(0.35, p.ry / p.rx));
        ctxMid.translate(-cx, -cy);
        ctxMid.beginPath();
        ctxMid.arc(cx, cy, p.rx, 0, Math.PI * 2);
        ctxMid.fillStyle = grd;
        ctxMid.fill();
        ctxMid.restore();
      }
    }

    var t = 0;
    var dprCap = Math.min(window.devicePixelRatio || 1, mobileLight ? 1.5 : 2);

    function sizeAll() {
      var w = window.innerWidth || 400;
      var h = window.innerHeight || 400;
      var dpr = dprCap;
      [cBg, cMid, cFg].forEach(function (c) {
        c.width = w * dpr;
        c.height = h * dpr;
        c.style.width = w + 'px';
        c.style.height = h + 'px';
      });
      var ctxs = [ctxBg, ctxMid, ctxFg];
      ctxs.forEach(function (x) {
        x.setTransform(dpr, 0, 0, dpr, 0, 0);
      });
      var i;
      var pts;
      for (var pass = 0; pass < 3; pass++) {
        pts = pass === 0 ? ptsBg : pass === 1 ? ptsMid : ptsFg;
        if (!pts.length) continue;
        for (i = 0; i < pts.length; i++) {
          pts[i].x = Math.random() * w;
          pts[i].y = Math.random() * h;
        }
      }
      if (earlySky) {
        cloudPts = makeCloudPts(w, h);
      }
    }

    sizeAll();
    window.addEventListener('resize', sizeAll, { passive: true });

    function stepParticles(pts, w, h, wrap, mult) {
      var i;
      var p;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        p.x += p.vx * mult;
        p.y += p.vy * mult;
        if (wrap) {
          if (p.x < -4) p.x = w + 4;
          if (p.x > w + 4) p.x = -4;
          if (p.y < -4) p.y = h + 4;
          if (p.y > h + 4) p.y = -4;
        } else {
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      }
    }

    function drawLayer(ctx, pts, fade, t0, isWhite) {
      var w = cBg.width / dprCap;
      var h = cBg.height / dprCap;
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, w, h);
      var i;
      var p;
      var a;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        a = p.a * (0.88 + 0.12 * Math.sin(t0 + p.x * 0.004 + p.y * 0.003));
        if (document.body.classList.contains('sh-env-pulse')) a *= 1.22;
        if (document.body.classList.contains('sh-transition-out')) a *= 1.35;
        if (a > 0.32) a = 0.32;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isWhite ? 'rgba(255,255,255,' + a + ')' : 'rgba(58,107,255,' + (a * 0.85) + ')';
        ctx.fill();
      }
    }

    function frame() {
      var homeBoost = path === '/' ? 1.14 : 1;
      var slowSky = earlySky ? 0.88 : 1;
      t += 0.01 * homeBoost * slowSky;
      var w = cBg.width / dprCap;
      var h = cBg.height / dprCap;
      var slow = document.body.classList.contains('sys-scroll--slow') ? 0.72 : 1;
      var fast = document.body.classList.contains('sys-scroll--fast') ? 1.18 : 1;
      var vm = slow * fast;
      var navB = document.body.classList.contains('sh-transition-out') ? 2.35 : 1;

      if (earlySky) {
        stepParticles(ptsBg, w, h, true, 0.48 * vm * navB * homeBoost * slowSky);
        stepCloudPts(cloudPts, w, h, 0.88 * vm * navB * slowSky);
        drawEarlySkyLayers();
        var wf = cFg.width / dprCap;
        var hf = cFg.height / dprCap;
        ctxFg.clearRect(0, 0, wf, hf);
        requestAnimationFrame(frame);
        return;
      }

      stepParticles(ptsBg, w, h, true, 0.55 * vm * navB * homeBoost);
      stepParticles(ptsMid, w, h, false, 1 * vm * navB * homeBoost);
      if (ptsFg.length) stepParticles(ptsFg, w, h, false, 1.35 * vm * navB * homeBoost);

      drawLayer(ctxBg, ptsBg, 'rgba(5,5,5,0.1)', t, true);
      drawLayer(ctxMid, ptsMid, 'rgba(7,7,8,0.14)', t + 1.2, true);
      if (ptsFg.length) drawLayer(ctxFg, ptsFg, 'rgba(6,8,12,0.18)', t + 2.4, true);

      requestAnimationFrame(frame);
    }
    frame();
  }

  function initHeaderParticles(canvas) {
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var parent = canvas.parentElement;
    var pts = [];
    function size() {
      var w = parent.clientWidth || 400;
      var h = parent.clientHeight || 200;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];
      for (var i = 0; i < 48; i++) {
        pts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.3 + Math.random() * 1.2,
          a: 0.04 + Math.random() * 0.1,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15
        });
      }
    }
    size();
    window.addEventListener('resize', size, { passive: true });
    var t = 0;
    function loop() {
      t += 0.008;
      var w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      var h = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));
      ctx.fillStyle = 'rgba(5,5,5,0.25)';
      ctx.fillRect(0, 0, w, h);
      var navB = document.body.classList.contains('sh-transition-out') ? 2.05 : 1;
      pts.forEach(function (p) {
        p.x += p.vx * navB;
        p.y += p.vy * navB;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        var dwellBoost = 1;
        if (document.body.classList.contains('sys-adaptive--dwell3')) dwellBoost = 1.75;
        else if (document.body.classList.contains('sys-adaptive--dwell2')) dwellBoost = 1.65;
        else if (document.body.classList.contains('sys-adaptive--dwell1')) dwellBoost = 1.45;
        var a = p.a * (0.85 + 0.15 * Math.sin(t + p.x * 0.01)) * dwellBoost;
        if (a > 0.32) a = 0.32;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + a + ')';
        ctx.fill();
      });
      requestAnimationFrame(loop);
    }
    loop();
  }

  function setupVisual(el, type) {
    if (!el || reduceMotion) return;
    if (el.querySelector('canvas')) return;
    var canvas = document.createElement('canvas');
    el.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var w = 400,
      h = 120;
    var mx = 0.5,
      my = 0.5;
    var scrollStab = 0;
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
    });
    el.addEventListener('mouseleave', function () {
      mx = 0.5;
      my = 0.5;
    });
    window.addEventListener(
      'scroll',
      function () {
        scrollStab = Math.min(1, window.scrollY / 400);
      },
      { passive: true }
    );
    function scrollParallaxMult() {
      if (document.body.classList.contains('sys-scroll--slow')) return 1.14;
      if (document.body.classList.contains('sys-scroll--fast')) return 0.78;
      return 1;
    }

    function resize() {
      var r = el.getBoundingClientRect();
      w = Math.max(200, Math.floor(r.width));
      h = Math.max(80, Math.floor(r.height));
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    var t = 0;
    var nodes = 5;
    var orbitAngles = [Math.random() * 6, Math.random() * 6, Math.random() * 6, Math.random() * 6];

    function draw() {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(8,8,7,0.4)';
      ctx.fillRect(0, 0, w, h);

      if (type === 'constellation') {
        var y = h * 0.55;
        ctx.strokeStyle = 'rgba(58,107,255,0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w * 0.08, y);
        ctx.lineTo(w * 0.92, y);
        ctx.stroke();
        for (var i = 0; i < nodes; i++) {
          var x = w * (0.1 + (0.8 * i) / (nodes - 1));
          var pulse = 0.6 + 0.4 * Math.sin(t * 1.2 + i * 0.7);
          var isCur = i === 0;
          var rad = isCur ? 7 + pulse * 2 : 5 + pulse;
          ctx.beginPath();
          ctx.arc(x, y, rad, 0, Math.PI * 2);
          ctx.fillStyle = isCur ? 'rgba(43,79,212,' + (0.35 + pulse * 0.2) + ')' : 'rgba(255,255,255,' + (0.08 + pulse * 0.06) + ')';
          ctx.fill();
          if (isCur) {
            ctx.strokeStyle = 'rgba(58,107,255,0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      } else if (type === 'orbit') {
        var cx = w * 0.5,
          cy = h * 0.5;
        var pull = 1 - Math.abs(mx - 0.5) * 0.35;
        var R = Math.min(w, h) * 0.28 * pull * scrollParallaxMult();
        for (var o = 0; o < 4; o++) {
          orbitAngles[o] += 0.004 + o * 0.001;
          var ox = cx + Math.cos(orbitAngles[o]) * R;
          var oy = cy + Math.sin(orbitAngles[o]) * R * 0.85;
          ctx.beginPath();
          ctx.arc(ox, oy, 4 + o * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(58,107,255,' + (0.25 + o * 0.05) + ')';
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(196,163,90,0.35)';
        ctx.fill();
      } else if (type === 'wave') {
        var amp = (10 + mx * 22 + (1 - scrollStab) * 8) * scrollParallaxMult();
        ctx.strokeStyle = 'rgba(58,107,255,0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (var px = 0; px <= w; px += 2) {
          var yy = h * 0.5 + Math.sin(px * 0.04 + t * 1.5) * amp;
          if (px === 0) ctx.moveTo(px, yy);
          else ctx.lineTo(px, yy);
        }
        ctx.stroke();
      } else if (type === 'portal-haze') {
        var th = t * 0.011;
        ctx.fillStyle = 'rgba(5,4,5,0.92)';
        ctx.fillRect(0, 0, w, h);
        var cx = w * 0.5;
        var cy = h * 0.45;
        var pulse = 0.92 + Math.sin(th * 1.1) * 0.08;
        var g0 = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.62);
        g0.addColorStop(0, 'rgba(59,15,25,' + (0.14 * pulse) + ')');
        g0.addColorStop(0.35, 'rgba(110,48,88,' + (0.07 * pulse) + ')');
        g0.addColorStop(0.65, 'rgba(62,38,72,' + (0.05 * pulse) + ')');
        g0.addColorStop(1, 'transparent');
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = g0;
        ctx.fillRect(0, 0, w, h);
        var g1 = ctx.createRadialGradient(cx * 0.85, cy * 1.1, 0, cx, cy, w * 0.55);
        g1.addColorStop(0, 'rgba(196,163,90,' + (0.09 + Math.sin(th * 0.8) * 0.02) + ')');
        g1.addColorStop(0.5, 'rgba(180,90,130,0.05)');
        g1.addColorStop(1, 'transparent');
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
      } else if (type === 'pricing-field') {
        var pr2 = window.__shParallax || { x: 0, y: 0, sd: 0 };
        var px = pr2.x * 6 + pr2.sd * 3;
        var py = pr2.y * 5;
        var activeId = 'decision';
        try {
          if (typeof document !== 'undefined' && document.body) {
            activeId = document.body.getAttribute('data-pricing-cei') || 'decision';
          }
        } catch (eP) {}
        var ceiOrder = ['behavior', 'environment', 'decision', 'time', 'revenue', 'friction', 'attention'];
        var selIdx = ceiOrder.indexOf(activeId);
        if (selIdx < 0) selIdx = 2;
        var nodeXY = [
          [0.12, 0.28],
          [0.36, 0.28],
          [0.6, 0.28],
          [0.84, 0.28],
          [0.24, 0.72],
          [0.5, 0.72],
          [0.76, 0.72]
        ];
        ctx.fillStyle = 'rgba(10,10,8,0.55)';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(244,237,224,0.055)';
        ctx.lineWidth = 1;
        var gs = 22;
        var gx2;
        for (gx2 = 0; gx2 < w; gx2 += gs) {
          ctx.beginPath();
          ctx.moveTo(gx2 + px, 0);
          ctx.lineTo(gx2 + px, h);
          ctx.stroke();
        }
        var gy2;
        for (gy2 = 0; gy2 < h; gy2 += gs) {
          ctx.beginPath();
          ctx.moveTo(0, gy2 + py);
          ctx.lineTo(w, gy2 + py);
          ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(92,118,72,0.07)';
        ctx.beginPath();
        ctx.moveTo(w * 0.08 + px, h * 0.5 + py);
        ctx.lineTo(w * 0.92 + px, h * 0.5 + py);
        ctx.stroke();
        function traceFullPath() {
          ctx.beginPath();
          ctx.moveTo(w * nodeXY[0][0] + px, h * nodeXY[0][1] + py);
          var pi;
          for (pi = 1; pi < nodeXY.length; pi++) {
            ctx.lineTo(w * nodeXY[pi][0] + px, h * nodeXY[pi][1] + py);
          }
        }
        ctx.strokeStyle = 'rgba(88,108,62,0.11)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 10]);
        traceFullPath();
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(196,163,90,' + (0.14 + Math.sin(t * 0.55) * 0.04) + ')';
        ctx.lineWidth = 1.35;
        traceFullPath();
        ctx.stroke();
        var traceA = (t * 0.09) % 1;
        ctx.strokeStyle = 'rgba(212,180,120,0.32)';
        ctx.lineWidth = 1.05;
        ctx.setLineDash([3, 44]);
        ctx.lineDashOffset = -traceA * 120;
        traceFullPath();
        ctx.stroke();
        ctx.lineDashOffset = 0;
        ctx.setLineDash([]);
        var hiSeg = Math.min(selIdx, nodeXY.length - 2);
        ctx.strokeStyle = 'rgba(196,163,90,0.38)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        var a0 = nodeXY[hiSeg];
        var a1 = nodeXY[hiSeg + 1];
        ctx.moveTo(w * a0[0] + px, h * a0[1] + py);
        ctx.lineTo(w * a1[0] + px, h * a1[1] + py);
        ctx.stroke();
        var ci;
        for (ci = 0; ci < nodeXY.length; ci++) {
          var np = nodeXY[ci];
          var pulseN = 0.55 + 0.45 * Math.sin(t * 0.7 + ci * 0.85);
          var isSel = ci === selIdx;
          var isOnPath = ci <= selIdx;
          var rad = isSel ? 4.5 + pulseN * 1.2 : 3 + pulseN * 0.8;
          ctx.beginPath();
          ctx.arc(w * np[0] + px, h * np[1] + py, rad, 0, Math.PI * 2);
          ctx.fillStyle = isSel
            ? 'rgba(196,163,90,' + (0.38 + pulseN * 0.2) + ')'
            : isOnPath
              ? 'rgba(132,148,98,' + (0.18 + pulseN * 0.1) + ')'
              : 'rgba(244,237,224,' + (0.06 + pulseN * 0.05) + ')';
          ctx.fill();
          if (isSel || (isOnPath && ci === selIdx - 1)) {
            ctx.strokeStyle = 'rgba(196,163,90,0.35)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      } else if (type === 'grid') {
        var pr = window.__shParallax || { x: 0, y: 0, sd: 0 };
        var gox = pr.x * 10 + pr.sd * 6;
        var goy = pr.y * 8;
        ctx.strokeStyle = 'rgba(244,237,224,0.06)';
        for (var gx = 0; gx < w; gx += 24) {
          ctx.beginPath();
          ctx.moveTo(gx + gox, 0);
          ctx.lineTo(gx + gox, h);
          ctx.stroke();
        }
        for (var gy = 0; gy < h; gy += 24) {
          ctx.beginPath();
          ctx.moveTo(0, gy + goy);
          ctx.lineTo(w, gy + goy);
          ctx.stroke();
        }
        for (var d = 0; d < 12; d++) {
          var gxd = ((t * 20 + d * 37) % (w + 40)) - 20 + gox;
          var gyd = (h * 0.3 + (d * 17) % h) % h + goy;
          ctx.fillStyle = 'rgba(58,107,255,' + (0.15 + (d % 3) * 0.05) + ')';
          ctx.fillRect(gxd, gyd, 2, 2);
        }
      } else if (type === 'systemmap') {
        var prm = window.__shParallax || { x: 0, y: 0, sd: 0 };
        var ox = prm.x * 5 + prm.sd * 2;
        var oy = prm.y * 4;
        var hoverId = '';
        try {
          if (typeof document !== 'undefined' && document.body && document.body.dataset) {
            hoverId = document.body.dataset.sysMapHover || '';
          }
        } catch (eM) {}
        ctx.fillStyle = 'rgba(8,8,7,0.35)';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(244,237,224,0.04)';
        ctx.lineWidth = 1;
        var gs3;
        for (gs3 = 0; gs3 < w; gs3 += 26) {
          ctx.beginPath();
          ctx.moveTo(gs3 + ox, 0);
          ctx.lineTo(gs3 + ox, h);
          ctx.stroke();
        }
        var gs4;
        for (gs4 = 0; gs4 < h; gs4 += 26) {
          ctx.beginPath();
          ctx.moveTo(0, gs4 + oy);
          ctx.lineTo(w, gs4 + oy);
          ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(92,118,72,0.06)';
        ctx.beginPath();
        ctx.moveTo(w * 0.08 + ox, h * 0.88 + oy);
        ctx.lineTo(w * 0.92 + ox, h * 0.12 + oy);
        ctx.stroke();
        var phaseIds = ['capture', 'monetize', 'structure', 'automation', 'sovereignty'];
        var pts = [
          [0.07, 0.44],
          [0.28, 0.38],
          [0.5, 0.44],
          [0.72, 0.38],
          [0.93, 0.44]
        ];
        ctx.strokeStyle = 'rgba(58,107,255,0.07)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w * 0.07 + ox, h * 0.5 + oy);
        for (var q = 1; q < pts.length; q++) {
          ctx.lineTo(w * pts[q][0] + ox, h * (0.5 + Math.sin(t * 0.25 + q) * 0.02) + oy);
        }
        ctx.stroke();
        function strokePhasePath(dash, lineW, strokeStyle) {
          ctx.strokeStyle = strokeStyle;
          ctx.lineWidth = lineW;
          if (dash) {
            ctx.setLineDash(dash);
            ctx.lineDashOffset = -t * 8;
          } else {
            ctx.setLineDash([]);
            ctx.lineDashOffset = 0;
          }
          ctx.beginPath();
          ctx.moveTo(w * pts[0][0] + ox, h * pts[0][1] + oy);
          var pj;
          for (pj = 1; pj < pts.length; pj++) {
            var p0a = pts[pj - 1];
            var p1a = pts[pj];
            var mxa = (p0a[0] + p1a[0]) / 2;
            var mya = (p0a[1] + p1a[1]) / 2 - 0.04;
            ctx.quadraticCurveTo(w * mxa + ox, h * mya + oy, w * p1a[0] + ox, h * p1a[1] + oy);
          }
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.lineDashOffset = 0;
        }
        strokePhasePath(null, 1.35, 'rgba(196,163,90,0.16)');
        strokePhasePath([4, 16], 1, 'rgba(196,163,90,0.28)');
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(244,237,224,0.07)';
        ctx.moveTo(w * 0.5 + ox, h * 0.44 + oy);
        ctx.lineTo(w * 0.5 + ox, h * 0.76 + oy);
        ctx.stroke();
        var pbX = w * 0.5 + ox;
        var pbY = h * 0.76 + oy;
        var pk;
        for (pk = 0; pk < pts.length; pk++) {
          var hx = phaseIds[pk] === hoverId;
          var pulseP = 0.6 + 0.4 * Math.sin(t * 0.65 + pk * 0.7);
          var xr = w * pts[pk][0] + ox;
          var yr = h * pts[pk][1] + oy;
          ctx.beginPath();
          ctx.arc(xr, yr, hx ? 5.5 + pulseP * 0.8 : 4 + pulseP * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = hx
            ? 'rgba(196,163,90,' + (0.42 + pulseP * 0.15) + ')'
            : 'rgba(58,107,255,' + (0.18 + pulseP * 0.1) + ')';
          ctx.fill();
          if (hx) {
            ctx.strokeStyle = 'rgba(212,180,120,0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        var pbHover = hoverId === 'results';
        var pulseB = 0.55 + 0.45 * Math.sin(t * 0.7 + 2.1);
        ctx.beginPath();
        ctx.arc(pbX, pbY, pbHover ? 4.5 + pulseB * 0.7 : 3.2 + pulseB * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = pbHover
          ? 'rgba(244,237,224,' + (0.22 + pulseB * 0.12) + ')'
          : 'rgba(244,237,224,' + (0.08 + pulseB * 0.06) + ')';
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }
    draw();
  }

  function getPrimaryCta() {
    var el = document.querySelector('[data-adaptive-primary]');
    if (el) return el;
    el = document.querySelector('.sys-compact .sys-btn--pri, #phase-header .sys-btn--pri');
    if (el) return el;
    el = document.querySelector('.tier-stack .tier-cta-primary');
    if (el) return el;
    el = document.querySelector(
      '#hero-cta-primary, #diag-cta-primary, main .btn--pri, .hero .btn--pri, .hero-inner .btn--pri, #hero .btn-primary.home-diag-cta, .section-cta .btn-primary.home-diag-cta'
    );
    return el;
  }

  function syncPhaseProgress() {
    var path = normPath(window.location.pathname);
    var arr = [];
    try {
      var raw = localStorage.getItem(STORAGE_VISITED);
      arr = raw ? JSON.parse(raw) : [];
    } catch (e) {}
    if (PHASE_PATHS.indexOf(path) >= 0 && arr.indexOf(path) < 0) {
      arr.push(path);
      try {
        localStorage.setItem(STORAGE_VISITED, JSON.stringify(arr));
      } catch (e2) {}
    }
    document.querySelectorAll('.sh-map-node[href]').forEach(function (a) {
      var p = normPath(a.getAttribute('href') || '');
      a.classList.remove('is-phase-visited', 'is-phase-current');
      if (arr.indexOf(p) >= 0) a.classList.add('is-phase-visited');
      if (p === path) a.classList.add('is-phase-current');
    });
    document.querySelectorAll('a.phase-card[href]').forEach(function (a) {
      var p = normPath(a.getAttribute('href') || '');
      a.classList.remove('is-phase-visited', 'is-phase-current');
      if (arr.indexOf(p) >= 0) a.classList.add('is-phase-visited');
      if (p === path) a.classList.add('is-phase-current');
    });
  }

  function injectPhaseRail() {
    var path = normPath(window.location.pathname);
    var idx = PHASE_PATHS.indexOf(path);
    if (idx < 0) return;

    var arr = [];
    try {
      var raw = localStorage.getItem(STORAGE_VISITED);
      arr = raw ? JSON.parse(raw) : [];
    } catch (e) {}

    var wrap = document.createElement('div');
    wrap.className = 'sys-phase-rail-wrap';
    wrap.id = 'sys-phase-rail-wrap';
    wrap.setAttribute('aria-label', 'Phase navigation');

    var nav = document.createElement('div');
    nav.className = 'sys-phase-rail-nav';

    var prevHref = idx === 0 ? '/' : PHASE_PATHS[idx - 1];
    var prev = document.createElement('a');
    prev.href = prevHref;
    prev.className = 'sys-phase-rail-nav__link sys-phase-rail-nav__link--prev magnetic';
    prev.textContent = idx === 0 ? '← Home' : '← ' + PHASE_SHORT[idx - 1];
    prev.setAttribute('title', idx === 0 ? 'Home' : 'Previous phase');

    var hub = document.createElement('a');
    hub.href = '/systems';
    hub.className = 'sys-phase-rail-nav__hub magnetic';
    hub.textContent = '◇';
    hub.setAttribute('title', 'System map');
    hub.setAttribute('aria-label', 'Open system map');

    var nextHref = idx === PHASE_PATHS.length - 1 ? '/results' : PHASE_PATHS[idx + 1];
    var next = document.createElement('a');
    next.href = nextHref;
    next.className = 'sys-phase-rail-nav__link sys-phase-rail-nav__link--next magnetic';
    next.textContent =
      idx === PHASE_PATHS.length - 1 ? 'Results →' : PHASE_SHORT[idx + 1] + ' →';
    next.setAttribute('title', idx === PHASE_PATHS.length - 1 ? 'Results' : 'Next phase');

    nav.appendChild(prev);
    nav.appendChild(hub);
    nav.appendChild(next);

    var rail = document.createElement('div');
    rail.className = 'sys-phase-rail';
    rail.id = 'sys-phase-rail-dots';
    rail.setAttribute('role', 'list');

    var pi;
    for (pi = 0; pi < 5; pi++) {
      var dot = document.createElement('a');
      var pth = PHASE_PATHS[pi];
      dot.href = pth;
      dot.className = 'sys-phase-rail__dot';
      dot.setAttribute('role', 'listitem');
      dot.setAttribute('title', 'Phase ' + (pi + 1) + ' · ' + PHASE_SHORT[pi]);
      dot.setAttribute('aria-label', 'Phase ' + (pi + 1) + ' · ' + PHASE_SHORT[pi]);
      if (arr.indexOf(pth) >= 0) dot.classList.add('is-visited');
      if (idx === pi) {
        dot.classList.add('is-current');
        dot.setAttribute('aria-current', 'page');
      }
      dot.textContent = String(pi + 1);
      rail.appendChild(dot);
    }

    wrap.appendChild(nav);
    wrap.appendChild(rail);
    var anchor = document.getElementById('diag-phase-rail-host');
    if (anchor) {
      anchor.appendChild(wrap);
    } else {
      document.body.appendChild(wrap);
    }
  }

  function initAdaptiveLayer() {
    syncPhaseProgress();
    injectPhaseRail();

    if (reduceMotion || isMobile) return;

    var body = document.body;
    var scrollClassTimer = 0;
    var lastY = window.scrollY || 0;
    var lastTs = Date.now();
    var velSmooth = 0;

    window.setTimeout(function () {
      body.classList.add('sys-adaptive--dwell1');
    }, 6200);
    window.setTimeout(function () {
      body.classList.add('sys-adaptive--dwell2');
      var p = getPrimaryCta();
      if (p) {
        p.classList.add('sys-adaptive-cta-pulse');
        function endPulse() {
          p.classList.remove('sys-adaptive-cta-pulse');
          p.removeEventListener('animationend', endPulse);
        }
        p.addEventListener('animationend', endPulse);
        window.setTimeout(function () {
          p.classList.remove('sys-adaptive-cta-pulse');
        }, 1200);
      }
    }, 13200);
    window.setTimeout(function () {
      body.classList.add('sys-adaptive--dwell3');
    }, 27600);

    window.addEventListener(
      'scroll',
      function () {
        var now = Date.now();
        var y = window.scrollY;
        var dt = Math.max(8, now - lastTs);
        var dy = Math.abs(y - lastY);
        var vel = dy / dt;
        velSmooth = velSmooth * 0.82 + vel * 0.18;
        lastY = y;
        lastTs = now;
        window.clearTimeout(scrollClassTimer);
        scrollClassTimer = window.setTimeout(function () {
          body.classList.remove('sys-scroll--fast', 'sys-scroll--slow');
          document.documentElement.style.setProperty('--sys-reveal-duration', '0.55s');
          if (velSmooth > 0.42) {
            body.classList.add('sys-scroll--fast');
            document.documentElement.style.setProperty('--sys-reveal-duration', '0.22s');
          } else if (velSmooth < 0.11 && y > 72) {
            body.classList.add('sys-scroll--slow');
            document.documentElement.style.setProperty('--sys-reveal-duration', '0.88s');
          }
        }, 140);
      },
      { passive: true }
    );

    var moveCount = 0;
    document.addEventListener(
      'mousemove',
      function () {
        moveCount++;
      },
      { passive: true }
    );
    window.setInterval(function () {
      if (moveCount > 55) body.classList.add('sys-adaptive--engaged');
      else if (moveCount < 12) body.classList.remove('sys-adaptive--engaged');
      moveCount = Math.floor(moveCount * 0.9);
    }, 420);

    document.addEventListener(
      'click',
      function (e) {
        moveCount += 18;
        var t = e.target.closest('a, button, .sh-map-node, .tier-cta, .btn, .sys-btn');
        if (!t) return;
        t.classList.add('sys-adaptive--clicked');
        window.setTimeout(function () {
          t.classList.remove('sys-adaptive--clicked');
        }, 280);
      },
      true
    );

    var mx = 0,
      my = 0,
      pauseTimer = 0;
    document.addEventListener(
      'mousemove',
      function (e) {
        mx = e.clientX;
        my = e.clientY;
        window.clearTimeout(pauseTimer);
        document.querySelectorAll('.sys-adaptive--nearby').forEach(function (el) {
          el.classList.remove('sys-adaptive--nearby');
        });
        pauseTimer = window.setTimeout(function () {
          var best = null;
          var bestD = 160;
          document.querySelectorAll('a, button, .sh-map-node, .tier-cta, .sys-btn, .btn, .phase-card').forEach(function (el) {
            var r = el.getBoundingClientRect();
            if (r.width < 2 || r.height < 2) return;
            var cx = r.left + r.width / 2;
            var cy = r.top + r.height / 2;
            var d = Math.sqrt((mx - cx) * (mx - cx) + (my - cy) * (my - cy));
            if (d < bestD) {
              bestD = d;
              best = el;
            }
          });
          if (best && bestD < 130) best.classList.add('sys-adaptive--nearby');
        }, 860);
      },
      { passive: true }
    );
  }

  function initLiveOutput() {
    // Live estimate panel removed intentionally.
  }

  function initHomeReturn() {
    if (normPath(window.location.pathname) !== '/') return;
    if (document.getElementById('hero-cta-primary')) return;
    var def = document.getElementById('hero-actions-default');
    var ret = document.getElementById('hero-actions-return');
    if (!def || !ret) return;
    if (!StephuarySession.hasActiveSession()) return;
    def.setAttribute('hidden', '');
    ret.removeAttribute('hidden');
    var lead = document.getElementById('hero-lead');
    if (lead) {
      lead.textContent =
        'Your diagnostic and outputs are saved on this device. Continue where you left off.';
    }
    var rd = document.getElementById('hero-resume-diag');
    var vr = document.getElementById('hero-view-results');
    if (rd) rd.href = StephuarySession.getResumeDiagnosticHref();
    if (vr) vr.href = '/results';
    var pill = document.getElementById('home-resume');
    if (pill) pill.style.display = 'none';
  }

  function initFlowEndBar() {
    var p = normPath(window.location.pathname);
    /* Omit /capture: standalone 7-question page has its own nav + must not stack a second “Exit → /” bar. */
    var phaseOnly = ['/monetize', '/structure', '/automation', '/sovereignty'];
    if (phaseOnly.indexOf(p) === -1) return;
    if (document.getElementById('sh-flow-end')) return;
    var next = StephuarySession.suggestNextHref(p);
    var el = document.createElement('div');
    el.id = 'sh-flow-end';
    el.className = 'sh-flow-end';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Continue');
    var priLabel = 'Continue';
    if (next === '/results') {
      priLabel = 'View readout';
    }
    var rowInner =
      '<a class="sh-flow-end__pri" href="' +
      next +
      '">' +
      priLabel +
      '</a>' +
      '<a class="sh-flow-end__exit" href="/">Exit</a>';
    el.innerHTML =
      '<p class="sh-flow-end__saved">Progress saved on this device.</p>' +
      '<div class="sh-flow-end__row sh-flow-end__row--single">' +
      rowInner +
      '</div>';
    document.body.appendChild(el);
    document.body.classList.add('has-flow-end');
  }

  function ensurePersonalizeScript() {
    if (document.querySelector('script[src*="stephuary-personalization"]')) return;
    var sp = document.createElement('script');
    sp.src = '/stephuary-personalization.js';
    sp.defer = true;
    document.head.appendChild(sp);
  }

  function ensureGlobalMapScript() {
    if (normPath(window.location.pathname) === '/pricing') return;
    if (document.querySelector('script[src*="stephuary-global-map"]')) return;
    var sg = document.createElement('script');
    sg.src = '/stephuary-global-map.js';
    sg.defer = true;
    document.head.appendChild(sg);
  }

  function ensureMagneticFlowScript() {
    if (document.querySelector('script[src*="stephuary-magnetic-flow"]')) return;
    var mf = document.createElement('script');
    mf.src = '/stephuary-magnetic-flow.js';
    mf.defer = true;
    document.head.appendChild(mf);
  }

  function initCollapsibleProgressBars() {
    document.querySelectorAll('.progress-bar-wrap').forEach(function (wrap) {
      if (wrap.getAttribute('data-sh-progress-collapsible') === '1') return;
      var meta = wrap.querySelector('.progress-meta');
      var track = wrap.querySelector('.progress-track');
      var countEl = wrap.querySelector('.progress-count');
      if (!meta || !track || !countEl) return;
      wrap.setAttribute('data-sh-progress-collapsible', '1');
      wrap.classList.add('progress-bar-wrap--collapsible');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'progress-bar-toggle';
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Hide progress bar');
      btn.innerHTML = '<span class="progress-bar-toggle__icon" aria-hidden="true">▼</span>';
      var end = document.createElement('span');
      end.className = 'progress-bar-meta-end';
      countEl.parentNode.insertBefore(end, countEl);
      end.appendChild(countEl);
      end.appendChild(btn);
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var collapsed = wrap.classList.toggle('progress-bar-wrap--collapsed');
        btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        btn.setAttribute('aria-label', collapsed ? 'Show progress bar' : 'Hide progress bar');
      });
    });
  }

  function boot() {
    /* Entry state must recover even if later init throws — run first. */
    initSpatialNavigation();

    initEnvironmentDepth();
    var ric =
      window.requestIdleCallback ||
      function (cb, opts) {
        return window.setTimeout(function () {
          cb({ didTimeout: true, timeRemaining: function () { return 0; } });
        }, (opts && opts.timeout) || 1);
      };
    ric(
      function () {
        try {
          ensurePersonalizeScript();
        } catch (e) {}
      },
      { timeout: 3200 }
    );
    ensureGlobalMapScript();
    ensureMagneticFlowScript();
    initPageTransition();
    initMagnetic();
    initCollapsibleProgressBars();
    initAdaptiveLayer();
    initHomeReturn();
    initFlowEndBar();

    var hCanvas = document.querySelector('.sys-compact__bg canvas');
    if (hCanvas) initHeaderParticles(hCanvas);

    var vis = document.getElementById('phase-visual');
    if (vis) {
      var typ = vis.getAttribute('data-visual') || 'constellation';
      if (typ !== 'layers') setupVisual(vis, typ);
    }

    var sv = document.getElementById('sys-visual');
    if (sv) {
      var svTyp = sv.getAttribute('data-visual') || 'systemmap';
      if (svTyp !== 'layers') setupVisual(sv, svTyp);
    }

    /* Layer parallax */
    var layers = document.querySelector('.sys-layers');
    if (layers && !reduceMotion) {
      window.addEventListener(
        'scroll',
        function () {
          var mult = 1;
          if (document.body.classList.contains('sys-scroll--slow')) mult = 1.16;
          if (document.body.classList.contains('sys-scroll--fast')) mult = 0.78;
          var y = window.scrollY * 0.04 * mult;
          layers.querySelectorAll('.sys-layer').forEach(function (L, i) {
            L.style.transform = 'translateY(' + (i * 2 - y) + 'px)';
          });
        },
        { passive: true }
      );
    }

    window.addEventListener('load', function () {
      window.dispatchEvent(new Event('resize'));
      window.setTimeout(function () {
        if (window.StephuaryGlobalMap && typeof window.StephuaryGlobalMap.init === 'function') {
          window.StephuaryGlobalMap.init();
        }
        if (window.StephuaryMagneticFlow && typeof window.StephuaryMagneticFlow.refresh === 'function') {
          window.StephuaryMagneticFlow.refresh();
        }
      }, 120);
      window.setTimeout(function () {
        if (window.StephuaryMagneticFlow && typeof window.StephuaryMagneticFlow.refresh === 'function') {
          window.StephuaryMagneticFlow.refresh();
        }
      }, 320);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
