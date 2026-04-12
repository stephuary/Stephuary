/**
 * System page atmosphere: star field, near glow, energy lines, breath.
 * Depends on #sh-env-depth from stephuary-interactive.js (same tick).
 */
(function () {
  if (!document.body || !document.body.classList.contains('page-systems')) return;

  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.matchMedia && window.matchMedia('(max-width: 767px)').matches;

  var dprCap = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 2);

  function makeStars(n) {
    var pts = [];
    var i;
    var w = window.innerWidth || 800;
    var h = window.innerHeight || 600;
    for (i = 0; i < n; i++) {
      pts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 0.55 + 0.25,
        a: Math.random() * 0.12 + 0.04,
        vx: (Math.random() - 0.5) * 0.035,
        vy: (Math.random() - 0.5) * 0.022
      });
    }
    return pts;
  }

  function makeNear(n) {
    var pts = [];
    var w = window.innerWidth || 800;
    var h = window.innerHeight || 600;
    var i;
    for (i = 0; i < n; i++) {
      pts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.2 + 0.9,
        a: Math.random() * 0.09 + 0.03,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.42
      });
    }
    return pts;
  }

  function stepPts(pts, w, h, wrap) {
    var i;
    var p;
    for (i = 0; i < pts.length; i++) {
      p = pts[i];
      p.x += p.vx;
      p.y += p.vy;
      if (wrap) {
        if (p.x < -2) p.x = w + 2;
        if (p.x > w + 2) p.x = -2;
        if (p.y < -2) p.y = h + 2;
        if (p.y > h + 2) p.y = -2;
      } else {
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
    }
  }

  function runStarfield(starsEl, nearEl) {
    var early =
      typeof document !== 'undefined' &&
      document.documentElement &&
      document.documentElement.classList.contains('early-mode');
    var nStar = early ? (mobile ? 14 : 28) : mobile ? 52 : 118;
    var nNear = early ? (mobile ? 5 : 9) : mobile ? 10 : 22;
    var starPts = makeStars(nStar);
    var nearPts = makeNear(nNear);
    var t = 0;

    var sctx = starsEl.getContext('2d');
    var nctx = nearEl.getContext('2d');
    if (!sctx || !nctx) return;

    function getW() {
      return window.innerWidth || 800;
    }
    function getH() {
      return window.innerHeight || 600;
    }

    function applySize() {
      var w = getW();
      var h = getH();
      [starsEl, nearEl].forEach(function (c) {
        c.width = w * dprCap;
        c.height = h * dprCap;
        c.style.width = w + 'px';
        c.style.height = h + 'px';
      });
      sctx.setTransform(dprCap, 0, 0, dprCap, 0, 0);
      nctx.setTransform(dprCap, 0, 0, dprCap, 0, 0);
      starPts = makeStars(nStar);
      nearPts = makeNear(nNear);
    }
    applySize();
    window.addEventListener('resize', applySize, { passive: true });

    function frame() {
      var w = getW();
      var h = getH();
      var i;
      var p;
      t += reduceMotion ? 0 : early ? 0.007 : 0.008;
      var bmul = document.body.classList.contains('systems-breath') ? 1.1 : 1;

      sctx.fillStyle = 'rgba(5,6,8,0.14)';
      sctx.fillRect(0, 0, w, h);
      for (i = 0; i < starPts.length; i++) {
        p = starPts[i];
        var tw = t * 0.4 + p.x * 0.001;
        var a = p.a * (0.9 + 0.1 * Math.sin(tw)) * bmul;
        if (a > 0.22) a = 0.22;
        sctx.beginPath();
        sctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        sctx.fillStyle = early
          ? 'rgba(255,228,210,' + (a * 0.55) + ')'
          : 'rgba(255,255,255,' + a + ')';
        sctx.fill();
      }
      if (!reduceMotion) stepPts(starPts, w, h, true);

      nctx.fillStyle = 'rgba(6,8,14,0.12)';
      nctx.fillRect(0, 0, w, h);
      for (i = 0; i < nearPts.length; i++) {
        p = nearPts[i];
        var a2 = p.a * (0.85 + 0.15 * Math.sin(t * 0.9 + p.y * 0.002)) * bmul;
        var grd = nctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        if (early) {
          grd.addColorStop(0, 'rgba(255, 190, 150,' + (a2 * 0.42) + ')');
          grd.addColorStop(0.45, 'rgba(200, 120, 95,' + (a2 * 0.2) + ')');
          grd.addColorStop(1, 'rgba(140, 80, 60,0)');
        } else {
          grd.addColorStop(0, 'rgba(120, 155, 255,' + (a2 * 0.55) + ')');
          grd.addColorStop(0.45, 'rgba(43, 79, 212,' + (a2 * 0.22) + ')');
          grd.addColorStop(1, 'rgba(43, 79, 212,0)');
        }
        nctx.beginPath();
        nctx.arc(p.x, p.y, p.r * 2.4, 0, Math.PI * 2);
        nctx.fillStyle = grd;
        nctx.fill();
      }
      if (!reduceMotion) stepPts(nearPts, w, h, false);

      if (!reduceMotion) window.requestAnimationFrame(frame);
    }

    frame();
  }

  function injectLayers() {
    var env = document.getElementById('sh-env-depth');
    if (!env) return false;
    if (document.getElementById('systems-stars-layer')) return true;

    var stars = document.createElement('canvas');
    stars.id = 'systems-stars-layer';
    stars.setAttribute('aria-hidden', 'true');
    env.insertBefore(stars, env.firstChild);

    var near = document.createElement('canvas');
    near.id = 'systems-near-glow-layer';
    near.setAttribute('aria-hidden', 'true');
    env.appendChild(near);

    var grad = document.createElement('div');
    grad.className = 'systems-atmo-gradient';
    grad.setAttribute('aria-hidden', 'true');
    env.appendChild(grad);

    if (!reduceMotion) {
      runStarfield(stars, near);
    }
    return true;
  }

  function initBreath() {
    if (reduceMotion) return;
    function pulse() {
      document.body.classList.add('systems-breath');
      window.setTimeout(function () {
        document.body.classList.remove('systems-breath');
      }, 2400);
    }
    pulse();
    window.setInterval(pulse, 9200);
  }

  function initEnergyLines() {
    var wrap = document.querySelector('.systems-flow-wrap');
    if (!wrap) return;

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'systems-energy-svg');
    svg.setAttribute('aria-hidden', 'true');
    var defs = document.createElementNS(svgNS, 'defs');
    var lg = document.createElementNS(svgNS, 'linearGradient');
    lg.setAttribute('id', 'systems-energy-grad');
    lg.setAttribute('x1', '0%');
    lg.setAttribute('y1', '0%');
    lg.setAttribute('x2', '100%');
    lg.setAttribute('y2', '0%');
    var s0 = document.createElementNS(svgNS, 'stop');
    s0.setAttribute('offset', '0%');
    s0.setAttribute('stop-color', 'rgba(43, 79, 212, 0.35)');
    var s1 = document.createElementNS(svgNS, 'stop');
    s1.setAttribute('offset', '50%');
    s1.setAttribute('stop-color', 'rgba(120, 140, 220, 0.25)');
    var s2 = document.createElementNS(svgNS, 'stop');
    s2.setAttribute('offset', '100%');
    s2.setAttribute('stop-color', 'rgba(196, 163, 90, 0.22)');
    lg.appendChild(s0);
    lg.appendChild(s1);
    lg.appendChild(s2);
    defs.appendChild(lg);
    svg.appendChild(defs);
    var depthAnchor = wrap.querySelector('.systems-flow-stack-depth');
    if (depthAnchor) {
      depthAnchor.insertAdjacentElement('afterend', svg);
    } else {
      wrap.insertBefore(svg, wrap.firstChild);
    }

    var resizeTimer = 0;
    function draw() {
      var nodes = wrap.querySelectorAll('.sh-map-node');
      if (nodes.length < 2) return;
      var rect = wrap.getBoundingClientRect();
      var w = rect.width;
      var h = rect.height;
      if (w < 8 || h < 8) return;
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      svg.querySelectorAll('path').forEach(function (p) {
        p.parentNode.removeChild(p);
      });
      var wr = wrap.getBoundingClientRect();
      var i;
      for (i = 0; i < nodes.length - 1; i++) {
        var a = nodes[i].getBoundingClientRect();
        var b = nodes[i + 1].getBoundingClientRect();
        var x1 = a.left + a.width / 2 - wr.left;
        var y1 = a.top + a.height / 2 - wr.top;
        var x2 = b.left + b.width / 2 - wr.left;
        var y2 = b.top + b.height / 2 - wr.top;
        var mx = (x1 + x2) / 2;
        var my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.08;
        var path = document.createElementNS(svgNS, 'path');
        path.setAttribute('class', 'systems-energy-path');
        var d = 'M ' + x1 + ' ' + y1 + ' Q ' + mx + ' ' + my + ' ' + x2 + ' ' + y2;
        path.setAttribute('d', d);
        path.style.animationDuration = 9.2 + i * 0.48 + 's';
        path.style.animationDelay = i * 0.55 + 's';
        svg.appendChild(path);
        if (!reduceMotion && !mobile) {
          var glow = document.createElementNS(svgNS, 'path');
          glow.setAttribute('d', d);
          glow.setAttribute('class', 'systems-energy-glow');
          glow.setAttribute('stroke', 'rgba(58, 94, 220, 0.14)');
          svg.appendChild(glow);
        }
      }
    }

    function schedule() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(draw, 80);
    }

    if (window.ResizeObserver) {
      var ro = new ResizeObserver(schedule);
      ro.observe(wrap);
    }
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('load', schedule, { passive: true });
    schedule();
  }

  function initStackScrollAtmo() {
    var wrap = document.querySelector('.systems-flow-wrap.systems-flow-stack');
    if (!wrap) return;
    function tick() {
      var r = wrap.getBoundingClientRect();
      var vh = window.innerHeight || 600;
      var overlap = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      var denom = r.height + vh;
      var vis = denom > 0 ? Math.min(Math.max(overlap / denom, 0), 1) : 0;
      var mid = 0.5;
      if (r.height > 8 && r.top < vh && r.bottom > 0) {
        mid = Math.min(
          Math.max((vh * 0.5 - r.top) / r.height, 0),
          1
        );
      }
      document.documentElement.style.setProperty('--systems-stack-visibility', vis.toFixed(4));
      document.documentElement.style.setProperty('--systems-stack-center', mid.toFixed(4));
    }
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick, { passive: true });
    tick();
  }

  function initFlowSectionPresence() {
    var wrap = document.querySelector('.systems-flow-wrap.systems-flow-stack');
    if (!wrap || !window.IntersectionObserver) return;
    var io = new IntersectionObserver(
      function (entries) {
        var on = false;
        entries.forEach(function (e) {
          if (e.isIntersecting && e.intersectionRatio > 0.08) on = true;
        });
        document.body.classList.toggle('systems-flow-ambient', on);
      },
      { root: null, rootMargin: '12% 0px 8% 0px', threshold: [0, 0.1, 0.25, 0.5] }
    );
    io.observe(wrap);
  }

  var injectTries = 0;
  function boot() {
    if (!injectLayers()) {
      if (injectTries++ < 100) {
        requestAnimationFrame(boot);
        return;
      }
      return;
    }
    /* Energy SVG node-to-node lines removed — portal field + thread carry progression. */
    initStackScrollAtmo();
    initFlowSectionPresence();
    initBreath();
    if (window.SystemsConstellation && typeof window.SystemsConstellation.init === 'function') {
      window.SystemsConstellation.init();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
