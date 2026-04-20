/**
 * Homepage — cursor diagnostic light + page-scan teardown.
 */
(function () {
  function initCursorLight() {
    if (window.matchMedia('(hover: none)').matches) return;

    function handleMouseMove(e) {
      document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
      document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
  }

  function initPageScanRemoval() {
    var el = document.querySelector('.page-scan');
    if (!el) return;
    el.addEventListener(
      'animationend',
      function (e) {
        e.target.remove();
      },
      { once: true }
    );
  }

  function onReady() {
    initCursorLight();
    initPageScanRemoval();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else window.setTimeout(onReady, 0);
})();
