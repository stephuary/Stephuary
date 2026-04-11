(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 767px)').matches;

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

  /* ——— Cursor ——— */
  function initCursor() {
    if (reduceMotion || isMobile) return;
    var dot = document.querySelector('.cursor-dot');
    var glow = document.querySelector('.sh-cursor-glow.sys-cursor-ring');
    if (!dot) return;
    document.body.classList.add('sys-cursor-on');
    var mx = 0,
      my = 0,
      lx = 0,
      ly = 0;
    document.addEventListener(
      'mousemove',
      function (e) {
        mx = e.clientX;
        my = e.clientY;
      },
      { passive: true }
    );
    function tick() {
      lx += (mx - lx) * 0.18;
      ly += (my - ly) * 0.18;
      dot.style.transform = 'translate3d(' + lx + 'px,' + ly + 'px,0)';
      if (glow) glow.style.transform = 'translate3d(' + lx + 'px,' + ly + 'px,0)';
      requestAnimationFrame(tick);
    }
    tick();
    var sel = 'a, button, .sh-map-node, .sys-btn, .tier-cta, .btn, .magnetic, [data-interactive]';
    document.addEventListener(
      'mouseover',
      function (e) {
        if (e.target.closest(sel)) document.body.classList.add('sys-cursor-hover');
      },
      true
    );
    document.addEventListener(
      'mouseout',
      function (e) {
        if (e.target.closest(sel)) document.body.classList.remove('sys-cursor-hover');
      },
      true
    );
  }

  /* ——— Magnetic ——— */
  function initMagnetic() {
    if (reduceMotion || isMobile) return;
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + dx * 0.08 + 'px,' + dy * 0.08 + 'px) scale(1.02)';
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
        var a = p.a * (0.85 + 0.15 * Math.sin(t + p.x * 0.01));
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
        var R = Math.min(w, h) * 0.28 * pull;
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
        var amp = 10 + mx * 22 + (1 - scrollStab) * 8;
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

  function boot() {
    initPageTransition();
    initCursor();
    initMagnetic();

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
          var y = window.scrollY * 0.04;
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
