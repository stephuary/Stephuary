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

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var particles = [];
    var animFrameId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    var COLORS = [
      'rgba(255,255,255,',
      'rgba(255,255,255,',
      'rgba(255,200,180,',
      'rgba(191,90,242,',
      'rgba(200,169,110,'
    ];

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.7 + 0.5,
        opacity: Math.random() * 0.6 + 0.4,
        speed: Math.random() * 0.15 + 0.03,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        offset: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.08
      };
    }

    function initParticles() {
      particles = Array.from({ length: 180 }, createParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var now = Date.now() / 1000;

      particles.forEach(function (p) {
        var pulse = Math.sin(now + p.offset) * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.max(0, p.opacity + pulse) + ')';
        ctx.fill();
        if (p.opacity > 0.6) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color + '0.06)';
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
