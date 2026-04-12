(function () {
  if (window.__STEPHUARY_INTERACTIVE_LOADED) return;
  window.__STEPHUARY_INTERACTIVE_LOADED = true;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 767px)').matches;
  var PHASE_PATHS = ['/capture', '/monetize', '/structure', '/automation', '/sovereignty'];
  var STORAGE_VISITED = 'stephuary_phases_visited';
  var SESSION_SNAPSHOT_KEY = 'stephuary_session_snapshot_v1';
  var CAPTURE_STORE_KEY = 'stephuary_capture_p01_v2';
  var RESULT_STORE_KEY = 'stephuary_result_v1';
  var PROGRESS_KEY = 'stephuary_system_progress_v1';
  var OS_KEY = 'stephuary_os_v1';
  var ROOM_CHAIN = [
    '/room-01-extraction',
    '/room-02-direction',
    '/room-03-transaction',
    '/room-04-infrastructure',
    '/room-05-cognition'
  ];
  var PHASE_CHAIN = {
    '/capture': '/monetize',
    '/monetize': '/structure',
    '/structure': '/automation',
    '/automation': '/sovereignty',
    '/sovereignty': '/systems'
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

  function lsSetJson(k, o) {
    try {
      localStorage.setItem(k, JSON.stringify(o));
    } catch (e) {}
  }

  var StephuarySession = {
    hasActiveSession: function () {
      try {
        if (localStorage.getItem('capture_complete') === 'true') return true;
        var cap = lsGetJson(CAPTURE_STORE_KEY);
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
      if (window.StephuaryProgress && typeof window.StephuaryProgress.getResumeLabel === 'function') {
        var lbl = window.StephuaryProgress.getResumeLabel();
        if (lbl && lbl.href) return lbl.href;
      }
      var cap = lsGetJson(CAPTURE_STORE_KEY);
      if (cap && cap.currentStep) return '/capture';
      return '/capture';
    },

    suggestNextHref: function (path) {
      var n = normPath(path);
      if (n === '/capture') {
        if (localStorage.getItem('capture_complete') === 'true') return '/monetize';
        return '/capture';
      }
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
      var cap = lsGetJson(CAPTURE_STORE_KEY);
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
        var cap = lsGetJson(CAPTURE_STORE_KEY);
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

  /* ——— Page transition ——— */
  function initPageTransition() {
    if (reduceMotion) return;
    var overlay = document.getElementById('page-transition');
    if (!overlay) return;
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
        overlay.classList.add('is-active');
        var url = a.href;
        window.setTimeout(function () {
          window.location.href = url;
        }, 520);
      },
      true
    );
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
      pts.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
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
      } else if (type === 'grid') {
        ctx.strokeStyle = 'rgba(244,237,224,0.06)';
        for (var gx = 0; gx < w; gx += 24) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, h);
          ctx.stroke();
        }
        for (var gy = 0; gy < h; gy += 24) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(w, gy);
          ctx.stroke();
        }
        for (var d = 0; d < 12; d++) {
          var gx = ((t * 20 + d * 37) % (w + 40)) - 20;
          var gy = (h * 0.3 + (d * 17) % h) % h;
          ctx.fillStyle = 'rgba(58,107,255,' + (0.15 + (d % 3) * 0.05) + ')';
          ctx.fillRect(gx, gy, 2, 2);
        }
      } else if (type === 'systemmap') {
        ctx.strokeStyle = 'rgba(244,237,224,0.08)';
        for (var g = 0; g < w; g += 32) {
          ctx.beginPath();
          ctx.moveTo(g, 0);
          ctx.lineTo(g, h);
          ctx.stroke();
        }
        var nx = [0.12, 0.35, 0.55, 0.75, 0.9];
        var ny = h * 0.5;
        ctx.strokeStyle = 'rgba(58,107,255,' + (0.2 + Math.sin(t) * 0.08) + ')';
        ctx.beginPath();
        ctx.moveTo(w * nx[0], ny);
        for (var j = 1; j < nx.length; j++) ctx.lineTo(w * nx[j], ny + Math.sin(t + j) * 3);
        ctx.stroke();
        nx.forEach(function (xi, k) {
          ctx.beginPath();
          ctx.arc(w * xi, ny, 5, 0, Math.PI * 2);
          ctx.fillStyle = k === 0 ? 'rgba(43,79,212,0.45)' : 'rgba(255,255,255,0.12)';
          ctx.fill();
        });
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
    el = document.querySelector('main .btn--pri, .hero .btn--pri, .hero-inner .btn--pri');
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
    if (idx < 0 && path !== '/systems') return;
    var rail = document.createElement('div');
    rail.className = 'sys-phase-rail';
    rail.setAttribute('aria-hidden', 'true');
    var arr = [];
    try {
      var raw = localStorage.getItem(STORAGE_VISITED);
      arr = raw ? JSON.parse(raw) : [];
    } catch (e) {}
    for (var i = 0; i < 5; i++) {
      var s = document.createElement('span');
      var pth = PHASE_PATHS[i];
      if (arr.indexOf(pth) >= 0) s.classList.add('is-visited');
      if (idx === i) s.classList.add('is-current');
      rail.appendChild(s);
    }
    document.body.appendChild(rail);
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
    if (document.getElementById('sh-live-panel')) return;
    if (document.body.getAttribute('data-live-output') === 'off') return;

    var STORAGE = 'stephuary_live_output_v1';
    var STORAGE_PANEL_CLOSED = 'outputPanelClosed';

    function getPanelClosed() {
      try {
        return localStorage.getItem(STORAGE_PANEL_CLOSED) === '1';
      } catch (e) {
        return false;
      }
    }

    function setPanelClosed(closed) {
      try {
        if (closed) localStorage.setItem(STORAGE_PANEL_CLOSED, '1');
        else localStorage.removeItem(STORAGE_PANEL_CLOSED);
      } catch (e) {}
    }
    var PATH_PHASES = [
      { path: '/', n: 0, name: 'Home', where: 'Home', cat: 'Overview', act: 'Open Capture when you want a structured read on leaks.' },
      { path: '/capture', n: 1, name: 'Extraction', where: "You're in Capture", cat: 'Leak visibility', act: 'Finish one full pass of the diagnostic.' },
      { path: '/monetize', n: 2, name: 'Position', where: "You're in Position", cat: 'Offer clarity', act: 'Name one buyer and one price before you add tools.' },
      { path: '/structure', n: 3, name: 'Structure', where: "You're in Structure", cat: 'Delivery & packaging', act: 'Turn the concept into one page you can send.' },
      { path: '/automation', n: 4, name: 'Automation', where: "You're in Automation", cat: 'Execution load', act: 'Automate one repeat step this week.' },
      { path: '/sovereignty', n: 5, name: 'Sovereignty', where: "You're in Sovereignty", cat: 'Ownership', act: 'Pick one system you control end to end.' },
      { path: '/systems', n: 0, name: 'System', where: 'System map', cat: 'Flow overview', act: 'Open the phase that matches your next decision.' },
      { path: '/pricing', n: 0, name: 'Pricing', where: 'Pricing', cat: 'Entry choice', act: 'Pick one tier that matches how much support you want.' },
      { path: '/results', n: 0, name: 'Results', where: 'Results', cat: 'Readout', act: 'Note one cut and one keep from the readout.' },
      { path: '/playbooks', n: 0, name: 'Rooms', where: 'Rooms', cat: 'Focused topic', act: 'Complete one room before starting another.' },
      { path: '/access', n: 0, name: 'Access', where: 'Club access', cat: 'Request', act: 'Send the form when your situation needs direct work.' },
      { path: '/snapshot', n: 0, name: 'Snapshot', where: 'Snapshot', cat: 'Full review', act: 'Book the snapshot when you want the full written pass.' }
    ];

    function pathInfo() {
      var p = normPath(window.location.pathname);
      for (var i = 0; i < PATH_PHASES.length; i++) {
        if (PATH_PHASES[i].path === p) return PATH_PHASES[i];
      }
      if (/^\/room-/.test(p)) {
        return {
          n: 0,
          name: 'Room',
          where: "You're in a room",
          cat: 'Focused topic',
          act: 'Finish this room before opening another.'
        };
      }
      return {
        n: 0,
        name: 'Site',
        where: 'Browsing',
        cat: 'Operating clarity',
        act: 'Open Capture when you want a structured read on leaks.'
      };
    }

    function loadStore() {
      try {
        var raw = localStorage.getItem(STORAGE);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return {
        scrollAcc: 0,
        interactAcc: 0,
        sessionStart: Date.now(),
        smoothMoney: 42000,
        smoothHours: 6.2,
        lastPath: ''
      };
    }

    var store = loadStore();
    var pageEnter = Date.now();
    var scrollAcc = store.scrollAcc || 0;
    var interactAcc = store.interactAcc || 0;
    var lastScrollY = window.scrollY;
    var smoothMoney = store.smoothMoney;
    var smoothHours = store.smoothHours;
    var ctxPre = StephuarySession.getContextualOutput();
    if (ctxPre && ctxPre.useContextual) {
      smoothMoney = ctxPre.targetMoney;
      smoothHours = ctxPre.targetHours;
    }
    var statusText = 'Calculating…';
    var lastStatusTick = 0;

    var root = document.createElement('aside');
    root.id = 'sh-live-panel';
    root.className = 'sh-live-panel';
    root.setAttribute('aria-label', 'Live output estimate');
    root.innerHTML =
      '<div class="sh-live-panel__chrome">' +
      '<div class="sh-live-panel__top">' +
      '<span class="sh-live-panel__phase" id="sh-live-phase">—</span>' +
      '<span class="sh-live-panel__status" id="sh-live-status">Calculating…</span>' +
      '</div>' +
      '<dl class="sh-live-panel__metrics">' +
      '<div><dt>Est. yearly loss</dt><dd id="sh-live-money">—</dd></div>' +
      '<div><dt>Time / week</dt><dd id="sh-live-time">—</dd></div>' +
      '<div><dt>Category</dt><dd id="sh-live-cat">—</dd></div>' +
      '<div><dt>Next move</dt><dd id="sh-live-action">—</dd></div>' +
      '</dl>' +
      '<p class="sh-live-panel__note" id="sh-live-note" hidden></p>' +
      '<p class="sh-live-panel__save" id="sh-live-save-wrap" hidden>' +
      '<button type="button" class="sh-live-panel__btn" id="sh-live-save-btn">Save your results</button></p>' +
      '<div class="sh-live-panel__summary" id="sh-live-summary-block" hidden>' +
      '<pre class="sh-live-panel__summary-pre" id="sh-live-summary-text"></pre>' +
      '</div>' +
      '<div class="sh-live-panel__bar">' +
      '<button type="button" class="sh-live-panel__btn" id="sh-live-toggle-summary">Summary</button>' +
      '<button type="button" class="sh-live-panel__btn" id="sh-live-copy">Copy</button>' +
      '<button type="button" class="sh-live-panel__btn" id="sh-live-download">Download</button>' +
      '<button type="button" class="sh-live-panel__btn" id="sh-live-share">Share</button>' +
      '</div>' +
      '</div>' +
      '<button type="button" class="sh-live-panel__dock" id="sh-live-dock" title="View live output" aria-label="View results">View Results</button>';

    document.body.appendChild(root);

    var elPhase = document.getElementById('sh-live-phase');
    var elStatus = document.getElementById('sh-live-status');
    var elMoney = document.getElementById('sh-live-money');
    var elTime = document.getElementById('sh-live-time');
    var elCat = document.getElementById('sh-live-cat');
    var elAction = document.getElementById('sh-live-action');
    var elSummaryBlock = document.getElementById('sh-live-summary-block');
    var elSummaryText = document.getElementById('sh-live-summary-text');
    var btnDock = document.getElementById('sh-live-dock');
    var chrome = root.querySelector('.sh-live-panel__chrome');

    function clampLivePanelToViewport() {
      if (document.body.classList.contains('pricing-page')) return;
      var vw = window.innerWidth || document.documentElement.clientWidth;
      if (vw <= 980) {
        root.style.removeProperty('width');
        root.style.removeProperty('max-width');
        root.style.removeProperty('min-width');
        root.style.removeProperty('right');
        root.style.removeProperty('left');
        if (btnDock) {
          btnDock.style.removeProperty('width');
          btnDock.style.removeProperty('max-width');
          btnDock.style.removeProperty('right');
          btnDock.style.removeProperty('left');
        }
        return;
      }
      var pad = 24;
      var maxW = Math.min(380, Math.max(0, vw - pad * 2));
      root.style.boxSizing = 'border-box';
      root.style.left = 'auto';
      root.style.right = pad + 'px';
      root.style.width = maxW + 'px';
      root.style.maxWidth = maxW + 'px';
      root.style.minWidth = Math.min(300, maxW) + 'px';
      var rect = root.getBoundingClientRect();
      if (rect.right > vw - 8) {
        root.style.right = Math.max(8, vw - rect.width - 8) + 'px';
        root.style.left = 'auto';
      }
      rect = root.getBoundingClientRect();
      if (rect.left < 8) {
        root.style.left = '8px';
        root.style.right = 'auto';
        var wFix = Math.min(380, vw - 16);
        root.style.width = wFix + 'px';
        root.style.maxWidth = wFix + 'px';
        root.style.minWidth = Math.min(300, wFix) + 'px';
      }
      if (btnDock) {
        btnDock.style.boxSizing = 'border-box';
        if (root.style.left === '8px') {
          btnDock.style.left = '8px';
          btnDock.style.right = 'auto';
        } else {
          btnDock.style.left = 'auto';
          btnDock.style.right = root.style.right || pad + 'px';
        }
        btnDock.style.maxWidth = root.style.maxWidth;
      }
    }

    window.addEventListener(
      'resize',
      function () {
        clampLivePanelToViewport();
      },
      { passive: true }
    );

    function persist() {
      try {
        localStorage.setItem(
          STORAGE,
          JSON.stringify({
            scrollAcc: scrollAcc,
            interactAcc: interactAcc,
            sessionStart: store.sessionStart,
            smoothMoney: smoothMoney,
            smoothHours: smoothHours,
            lastPath: normPath(window.location.pathname)
          })
        );
      } catch (e) {}
    }

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function computeTargets() {
      var info = pathInfo();
      var ctx = StephuarySession.getContextualOutput();
      var tOnPage = (Date.now() - pageEnter) / 1000;
      if (ctx && ctx.useContextual) {
        var scrollBoost = Math.min(9000, scrollAcc * 0.014);
        var interactBoost = Math.min(7000, interactAcc * 45);
        var wave = Math.sin(Date.now() / 8200) * 520;
        return {
          info: {
            n: info.n,
            name: info.name,
            where: info.where,
            cat: ctx.cat,
            act: ctx.act
          },
          targetMoney: Math.round(ctx.targetMoney + scrollBoost + interactBoost + wave),
          targetHours: Math.min(
            38,
            Math.max(2.1, ctx.targetHours + scrollAcc * 0.0001 + interactAcc * 0.035 + tOnPage * 0.015)
          ),
          timeLine: ctx.timeLine || ''
        };
      }
      var pathBoost = info.n > 0 ? info.n * 900 : 400;
      var scrollBoost = Math.min(28000, scrollAcc * 0.018);
      var interactBoost = Math.min(22000, interactAcc * 85);
      var dwellBoost = Math.min(12000, tOnPage * 12);
      var base = 18000 + pathBoost + scrollBoost + interactBoost + dwellBoost;
      var wave = Math.sin(Date.now() / 8200) * 600;
      var targetMoney = Math.round(base + wave);
      var hBase = 3.2 + info.n * 0.35 + scrollAcc * 0.00012 + interactAcc * 0.04 + tOnPage * 0.028;
      var targetHours = Math.min(38, Math.max(2.1, hBase + Math.sin(Date.now() / 6400) * 0.35));
      return { info: info, targetMoney: targetMoney, targetHours: targetHours, timeLine: '' };
    }

    function updateStatus() {
      var now = Date.now();
      if (lastStatusTick > 0 && now - lastStatusTick < 2800) return;
      lastStatusTick = now;
      if (scrollAcc > 400 && interactAcc > 8) statusText = 'Most time is lost here';
      else if (scrollAcc > 120 || interactAcc > 3) statusText = 'Updating…';
      else if (now - pageEnter < 4000) statusText = 'Calculating…';
      else statusText = 'Updating…';
      elStatus.textContent = statusText;
    }

    function formatMoney(n) {
      return '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }

    function formatHours(h) {
      return h.toFixed(1) + ' h';
    }

    function buildSummaryText(comp) {
      return (
        'Stephuary · live estimate\n' +
        '—\n' +
        'Phase: ' +
        (comp.info.n > 0
          ? '0' + comp.info.n + ' active · ' + comp.info.name
          : comp.info.name + ' · ' + comp.info.where) +
        '\n' +
        'Est. yearly loss: ' +
        formatMoney(Math.round(smoothMoney)) +
        '\n' +
        'Time loss / week: ' +
        formatHours(smoothHours) +
        '\n' +
        'Time pattern: ' +
        (comp.timeLine || '—') +
        '\n' +
        'Category: ' +
        comp.info.cat +
        '\n' +
        'Next move: ' +
        comp.info.act +
        '\n'
      );
    }

    function tick() {
      var comp = computeTargets();
      smoothMoney = lerp(smoothMoney, comp.targetMoney, 0.08);
      smoothHours = lerp(smoothHours, comp.targetHours, 0.1);

      var phaseLine =
        comp.info.n > 0
          ? 'Phase ' +
            (comp.info.n < 10 ? '0' + comp.info.n : comp.info.n) +
            ' active · ' +
            comp.info.name
          : comp.info.where;
      elPhase.textContent = phaseLine;
      elMoney.textContent = formatMoney(Math.round(smoothMoney));
      elTime.textContent = formatHours(smoothHours);
      elCat.textContent = comp.info.cat;
      elAction.textContent = comp.info.act;
      try {
        if (
          window.StephuaryPersonalize &&
          typeof window.StephuaryPersonalize.afterLivePanelTick === 'function'
        ) {
          window.StephuaryPersonalize.afterLivePanelTick({
            elMoney: elMoney,
            elTime: elTime,
            elCat: elCat,
            elAction: elAction,
            formatMoney: formatMoney,
            formatHours: formatHours
          });
        }
      } catch (eP) {}
      var noteEl = document.getElementById('sh-live-note');
      if (noteEl) {
        if (comp.timeLine) {
          noteEl.textContent = comp.timeLine;
          noteEl.hidden = false;
        } else {
          noteEl.textContent = '';
          noteEl.hidden = true;
        }
      }
      var saveWrap = document.getElementById('sh-live-save-wrap');
      if (saveWrap) saveWrap.hidden = interactAcc < 22;
      elSummaryText.textContent = buildSummaryText(comp);
      updateStatus();
      persist();
      try {
        StephuarySession.persistSnapshot({ smoothMoney: smoothMoney, smoothHours: smoothHours });
      } catch (e2) {}
    }

    window.addEventListener(
      'scroll',
      function () {
        var dy = Math.abs(window.scrollY - lastScrollY);
        lastScrollY = window.scrollY;
        scrollAcc += dy;
      },
      { passive: true }
    );

    document.addEventListener(
      'click',
      function (e) {
        if (e.target.closest('#sh-live-panel')) return;
        interactAcc += 1;
      },
      true
    );

    window.addEventListener('beforeunload', persist);

    document.getElementById('sh-live-toggle-summary').addEventListener('click', function () {
      elSummaryBlock.hidden = !elSummaryBlock.hidden;
    });

    document.getElementById('sh-live-copy').addEventListener('click', function () {
      var t = elSummaryText.textContent || '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).catch(function () {});
      } else {
        var ta = document.createElement('textarea');
        ta.value = t;
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
        } catch (e) {}
        document.body.removeChild(ta);
      }
      elStatus.textContent = 'Updating…';
      window.setTimeout(function () {
        elStatus.textContent = statusText;
      }, 1400);
    });

    function doDownloadSummary() {
      var t = elSummaryText.textContent || '';
      var blob = new Blob([t], { type: 'text/plain;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'stephuary-output.txt';
      a.click();
      URL.revokeObjectURL(a.href);
    }

    document.getElementById('sh-live-download').addEventListener('click', doDownloadSummary);

    var saveBtn = document.getElementById('sh-live-save-btn');
    if (saveBtn) saveBtn.addEventListener('click', doDownloadSummary);

    document.getElementById('sh-live-share').addEventListener('click', function () {
      var t = elSummaryText.textContent || '';
      if (navigator.share) {
        navigator.share({ title: 'Stephuary output', text: t }).catch(function () {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(t).catch(function () {});
          }
        });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).catch(function () {});
      }
    });

    btnDock.setAttribute('aria-hidden', 'true');
    btnDock.addEventListener('click', function () {
      setPanelClosed(false);
      root.classList.remove('sh-live-panel--collapsed');
      btnDock.setAttribute('aria-hidden', 'true');
      root.classList.add('sh-live-panel--visible');
      clampLivePanelToViewport();
    });

    var collapseBtn = document.createElement('button');
    collapseBtn.type = 'button';
    collapseBtn.className = 'sh-live-panel__min';
    collapseBtn.setAttribute('aria-label', 'Minimize live output');
    collapseBtn.setAttribute('title', 'Minimize');
    collapseBtn.textContent = '−';

    var revealTimer = null;

    collapseBtn.addEventListener('click', function () {
      if (revealTimer) {
        window.clearTimeout(revealTimer);
        revealTimer = null;
      }
      setPanelClosed(true);
      root.classList.add('sh-live-panel--collapsed');
      btnDock.setAttribute('aria-hidden', 'false');
      root.classList.add('sh-live-panel--visible');
      clampLivePanelToViewport();
    });
    chrome.insertBefore(collapseBtn, chrome.firstChild);

    window.setInterval(tick, 1100);
    tick();

    if (getPanelClosed()) {
      root.classList.add('sh-live-panel--collapsed');
      btnDock.setAttribute('aria-hidden', 'false');
      root.classList.add('sh-live-panel--visible');
    } else {
      revealTimer = window.setTimeout(
        function () {
          revealTimer = null;
          root.classList.add('sh-live-panel--visible');
        },
        reduceMotion ? 400 : 2400
      );
    }

    clampLivePanelToViewport();
    window.setTimeout(clampLivePanelToViewport, 0);
    window.addEventListener('load', clampLivePanelToViewport, { passive: true });

    window.setTimeout(function () {
      if (window.StephuaryPersonalize && typeof window.StephuaryPersonalize.applyLivePanel === 'function') {
        window.StephuaryPersonalize.applyLivePanel(root);
      }
    }, 0);
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
    var phaseOnly = ['/capture', '/monetize', '/structure', '/automation', '/sovereignty'];
    if (phaseOnly.indexOf(p) === -1) return;
    if (document.getElementById('sh-flow-end')) return;
    var next = StephuarySession.suggestNextHref(p);
    var el = document.createElement('div');
    el.id = 'sh-flow-end';
    el.className = 'sh-flow-end';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Next steps');
    el.innerHTML =
      '<p class="sh-flow-end__saved">Your progress is saved automatically on this device.</p>' +
      '<div class="sh-flow-end__row">' +
      '<a class="sh-flow-end__pri" href="' +
      next +
      '">Continue to next step</a>' +
      '<a class="sh-flow-end__sec" href="/results">View full results</a>' +
      '<a class="sh-flow-end__ter" href="/">Exit and save progress</a>' +
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

  function boot() {
    ensurePersonalizeScript();
    initPageTransition();
    initMagnetic();
    initAdaptiveLayer();
    initLiveOutput();
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
    if (sv) setupVisual(sv, 'systemmap');

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
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
