/**
 * Stephuary shared hero field — configurable intensity + theme tint.
 * Does not run on pages without .sh-hero__canvas-wrap[data-sh-hero-init]
 */
(function () {
  function initCursor() {
    var glow = document.querySelector('.sh-cursor-glow');
    if (!glow || window.matchMedia('(max-width:767px)').matches) return;
    document.body.classList.add('sh-cursor-on');
    var raf = 0;
    var mx = 0;
    var my = 0;
    var lx = 0;
    var ly = 0;
    function tick() {
      lx += (mx - lx) * 0.12;
      ly += (my - ly) * 0.12;
      glow.style.transform = 'translate3d(' + lx + 'px,' + ly + 'px,0)';
      raf = requestAnimationFrame(tick);
    }
    document.addEventListener(
      'mousemove',
      function (e) {
        mx = e.clientX;
        my = e.clientY;
      },
      { passive: true }
    );
    var interactive = 'a, button, .sh-map-node, .sh-btn, .btn, .btn-start, .btn-solid, [data-sh-hover]';
    document.addEventListener(
      'mouseover',
      function (e) {
        if (e.target.closest(interactive)) document.body.classList.add('sh-cursor-hover');
      },
      true
    );
    document.addEventListener(
      'mouseout',
      function (e) {
        if (e.target.closest(interactive)) document.body.classList.remove('sh-cursor-hover');
      },
      true
    );
    tick();
  }

  function runHero(root) {
    var wrap = root.querySelector('.sh-hero__canvas-wrap');
    var canvasBack = root.querySelector('.sh-hero-canvas-back');
    var canvasFront = root.querySelector('.sh-hero-canvas-front');
    if (!wrap || !canvasBack || !canvasFront) return;

    var intensity = parseFloat(root.getAttribute('data-sh-intensity') || '1');
    if (isNaN(intensity)) intensity = 1;
    var theme = root.getAttribute('data-sh-theme') || 'default';

    var themeTint = {
      default: { ox: 1, bl: 1, rb: 1 },
      phase1: { ox: 0.85, bl: 1.15, rb: 1.1 },
      phase2: { ox: 1.35, bl: 0.9, rb: 0.95 },
      phase3: { ox: 1.05, bl: 1.05, rb: 1 },
      phase4: { ox: 0.75, bl: 0.75, rb: 0.85 },
      phase5: { ox: 1, bl: 1.08, rb: 1.02 }
    };
    var tnt = themeTint[theme] || themeTint.default;

    var ctxB = canvasBack.getContext('2d', { alpha: false });
    var ctxF = canvasFront.getContext('2d', { alpha: true });
    if (!ctxB || !ctxF) return;

    var width = 300;
    var height = 300;
    var t = 0;
    var particlesBack = [];
    var particlesFront = [];

    function cfgLayer(layer) {
      var base = {
        far: { rMin: 0.2, rMax: 0.95, sp: 0.016, a: 0.055 },
        mid: { rMin: 0.5, rMax: 1.55, sp: 0.038, a: 0.125 },
        near: { rMin: 1, rMax: 2.5, sp: 0.024, a: 0.22 }
      };
      var c = base[layer];
      var slow = 0.52;
      var bright = 1.22 * intensity;
      return {
        rMin: c.rMin,
        rMax: c.rMax,
        sp: c.sp * slow,
        a: Math.min(0.5, c.a * bright * tnt.rb)
      };
    }

    function makeParticle(layer, w, h, isFront) {
      var c = cfgLayer(layer);
      var bright = layer === 'near' && Math.random() < 0.32;
      var baseA = bright ? Math.min(0.48, c.a * 1.85) : c.a;
      if (isFront && layer !== 'near') return null;
      if (!isFront && layer === 'near') return null;
      return {
        layer: layer,
        x: Math.random() * w,
        y: Math.random() * h,
        r: c.rMin + Math.random() * (c.rMax - c.rMin),
        dx: (Math.random() - 0.5) * c.sp,
        dy: (Math.random() - 0.5) * c.sp,
        alpha: baseA,
        twinkle: bright ? 0.35 + Math.random() * 0.5 : 0
      };
    }

    function initParticles() {
      var w = Math.max(1, width);
      var h = Math.max(1, height);
      var narrow = window.matchMedia('(max-width: 767px)').matches;
      var mul = intensity * (narrow ? 0.92 : 1.08);
      var nFar = Math.round((narrow ? 48 : 78) * mul);
      var nMid = Math.round((narrow ? 38 : 62) * mul);
      var nNear = Math.round((narrow ? 14 : 22) * mul);
      particlesBack = [];
      particlesFront = [];
      var i;
      for (i = 0; i < nFar; i++) {
        var p = makeParticle('far', w, h, false);
        if (p) particlesBack.push(p);
      }
      for (i = 0; i < nMid; i++) {
        p = makeParticle('mid', w, h, false);
        if (p) particlesBack.push(p);
      }
      for (i = 0; i < nNear; i++) {
        p = makeParticle('near', w, h, true);
        if (p) particlesFront.push(p);
      }
    }

    function measure() {
      var rect = root.getBoundingClientRect();
      var w = Math.floor(rect.width);
      var h = Math.floor(rect.height);
      if (w < 2 || h < 2) {
        w = Math.max(2, Math.floor(window.innerWidth));
        h = Math.max(2, Math.floor(window.innerHeight));
      }
      return { w: w, h: h };
    }

    function resize() {
      var m = measure();
      width = m.w;
      height = m.h;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      [canvasBack, canvasFront].forEach(function (cv) {
        cv.width = Math.floor(width * dpr);
        cv.height = Math.floor(height * dpr);
        cv.style.width = width + 'px';
        cv.style.height = height + 'px';
      });
      ctxB.setTransform(1, 0, 0, 1, 0, 0);
      ctxB.scale(dpr, dpr);
      ctxF.setTransform(1, 0, 0, 1, 0, 0);
      ctxF.scale(dpr, dpr);
      initParticles();
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () {
        resize();
      });
      ro.observe(root);
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(resize);
    });
    window.addEventListener('load', resize, { passive: true });

    function drawBack() {
      t += 0.00125;
      var ox = (0.62 + Math.sin(t * 0.78) * 0.14) * tnt.ox;
      var bl = (0.58 + Math.cos(t * 0.65) * 0.14) * tnt.bl;
      var grad = ctxB.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#060608');
      grad.addColorStop(0.36, 'rgba(118, 12, 12, ' + ox + ')');
      grad.addColorStop(0.63, 'rgba(22, 48, 132, ' + bl + ')');
      grad.addColorStop(1, '#050508');
      ctxB.fillStyle = grad;
      ctxB.fillRect(0, 0, width, height);

      var ap = t * 0.32;
      ctxB.save();
      ctxB.lineWidth = 1;
      ctxB.globalAlpha = 0.048 * intensity;
      ctxB.strokeStyle = 'rgba(58, 107, 255, 0.95)';
      ctxB.beginPath();
      if (typeof ctxB.ellipse === 'function') {
        ctxB.ellipse(width * 0.27, height * 0.54, width * 0.44, height * 0.36, ap * 0.12, 0.15, Math.PI * 1.32);
      } else {
        ctxB.arc(width * 0.35, height * 0.5, width * 0.35, 0.2, Math.PI * 1.2);
      }
      ctxB.stroke();
      ctxB.globalAlpha = 0.04 * intensity;
      ctxB.strokeStyle = 'rgba(140, 36, 36, 0.9)';
      ctxB.beginPath();
      if (typeof ctxB.ellipse === 'function') {
        ctxB.ellipse(width * 0.74, height * 0.4, width * 0.34, height * 0.29, -ap * 0.1, -0.08, Math.PI * 1.48);
      } else {
        ctxB.arc(width * 0.68, height * 0.42, width * 0.28, -0.1, Math.PI * 1.35);
      }
      ctxB.stroke();
      ctxB.restore();

      particlesBack.forEach(function (p) {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < -6 || p.x > width + 6) p.dx *= -1;
        if (p.y < -6 || p.y > height + 6) p.dy *= -1;
        var a = p.alpha;
        if (p.twinkle) {
          a *= 0.82 + 0.18 * Math.sin(t * 2.05 + p.x * 0.007 + p.y * 0.005);
        }
        ctxB.beginPath();
        ctxB.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctxB.fillStyle = 'rgba(255,255,255,' + a + ')';
        ctxB.fill();
      });
    }

    function drawFront() {
      ctxF.clearRect(0, 0, width, height);
      particlesFront.forEach(function (p) {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < -6 || p.x > width + 6) p.dx *= -1;
        if (p.y < -6 || p.y > height + 6) p.dy *= -1;
        var a = p.alpha;
        if (p.twinkle) {
          a *= 0.82 + 0.18 * Math.sin(t * 2.2 + p.x * 0.008 + p.y * 0.006);
        }
        ctxF.beginPath();
        ctxF.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctxF.fillStyle = 'rgba(255,255,255,' + a + ')';
        ctxF.fill();
      });
    }

    function draw() {
      drawBack();
      drawFront();
      requestAnimationFrame(draw);
    }
    draw();
  }

  function boot() {
    document.querySelectorAll('.sh-hero[data-sh-hero-init]').forEach(runHero);
    initCursor();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
