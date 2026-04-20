/**
 * Homepage — animate .section-who .stat-number from 0+ to 20+ when section enters view.
 */
(function () {
  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function initStatCounter() {
    var statEl = document.querySelector('.section-who .stat-number');
    if (!statEl) return;

    if (prefersReducedMotion()) {
      statEl.textContent = '20+';
      return;
    }

    var target = 20;
    var duration = 1800;
    var startTime = null;

    var observer = new IntersectionObserver(
      function (entries) {
        if (!entries[0] || !entries[0].isIntersecting) return;
        observer.disconnect();

        function tick(now) {
          if (startTime === null) startTime = now;
          var elapsed = now - startTime;
          var progress = Math.min(elapsed / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          statEl.textContent = Math.round(eased * target) + '+';
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );

    var root = document.querySelector('.section-who');
    observer.observe(root || statEl);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initStatCounter);
  else window.setTimeout(initStatCounter, 0);
})();
