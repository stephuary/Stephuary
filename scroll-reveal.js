/**
 * Homepage — intersection-based reveal (.reveal → .is-visible).
 */
(function () {
  function initScrollReveal() {
    var nodes = document.querySelectorAll('.reveal');
    if (!nodes.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    nodes.forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initScrollReveal);
  else window.setTimeout(initScrollReveal, 0);
})();
