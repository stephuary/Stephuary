/**
 * Homepage — starfield canvas (data drift). Pauses when tab hidden.
 */
(function () {
  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function initStarfield() {
    var canvas = document.getElementById('starfield');
    if (!canvas) return;

    if (prefersReducedMotion()) {
      canvas.remove();
      return;
    }

    var isSnapshot = false;
    var isHome = false;
    try {
      isSnapshot = document.body && document.body.classList.contains('snapshot-page');
      isHome = document.body && document.body.getAttribute('data-sh-env') === 'home';
    } catch (e) {}

    /** Snapshot: ~30% lighter field. Home: canvas opacity also trimmed in CSS (stars stay subordinate to type). */
    var opacityMult = isSnapshot ? 0.7 : isHome ? 0.9 : 1;
    var particleCount = isSnapshot ? 120 : 180;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var particles = [];
    var animFrameId;

    var zone = { f: function () { return 2; } };
    function refreshZone() {
      if (!isHome) {
        zone = { f: function () { return 2; } };
        return;
      }
      var w = canvas.width;
      if (w <= 0) return;
      var cx = w * 0.5;
      var cy = window.innerHeight * 0.26;
      var rx = w * 0.38;
      var ry = window.innerHeight * 0.2;
      zone = {
        f: function (p) {
          var a = (p.x - cx) / rx;
          var b = (p.y - cy) / ry;
          return a * a + b * b;
        }
      };
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      refreshZone();
    }

    var COLORS = [
      'rgba(255,255,255,',
      'rgba(255,255,255,',
      'rgba(180,195,230,',
      'rgba(191,90,242,',
      'rgba(200,169,110,'
    ];

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.7 + 0.5,
        opacity: Math.random() * 0.6 + 0.4,
        /* Home: calmer, slower vertical drift and lateral motion */
        speed: isHome ? Math.random() * 0.11 + 0.02 : Math.random() * 0.15 + 0.03,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        offset: Math.random() * Math.PI * 2,
        drift: isHome ? (Math.random() - 0.5) * 0.055 : (Math.random() - 0.5) * 0.08
      };
    }

    function initParticles() {
      particles = Array.from({ length: particleCount }, createParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var now = Date.now() / 1000;
      if (isHome) refreshZone();

      particles.forEach(function (p) {
        var pulse = Math.sin(now + p.offset) * 0.3;
        var op = Math.max(0, p.opacity + pulse) * opacityMult;
        if (isHome) {
          var d = zone.f(p);
          if (d < 1) {
            var falloff = 0.4 + 0.6 * d;
            op *= falloff;
          } else if (d < 1.35) {
            op *= 0.5 + 0.5 * Math.min(1, (d - 1) / 0.35);
          }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + op + ')';
        ctx.fill();
        if (p.opacity > 0.6) {
          ctx.beginPath();
          var glowA = (isSnapshot ? 0.04 : isHome ? 0.045 : 0.06) * (isHome && zone.f(p) < 1 ? 0.55 : 1);
          ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color + glowA + ')';
          ctx.fill();
        }

        p.y -= p.speed;
        p.x += p.drift;

        if (p.y < -5) {
          p.y = canvas.height + 5;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;
      });

      animFrameId = requestAnimationFrame(draw);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(animFrameId);
      } else {
        draw();
      }
    });

    window.addEventListener(
      'resize',
      function () {
        resize();
      },
      { passive: true }
    );

    resize();
    initParticles();
    draw();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initStarfield);
  else window.setTimeout(initStarfield, 0);
})();
