/**
 * Stephuary pricing page — guided section focus, rail, sticky CTA, smooth anchors.
 * Assumes data-guided-panel / data-guided-stage attributes in pricing.html.
 */
(function () {
  'use strict';

  var RAIL_ORDER = ['start', 'decide', 'build', 'diagnose', 'access', 'apply', 'scale'];

  function initSmoothAnchors() {
    var reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    document.addEventListener(
      'click',
      function (e) {
        var a = e.target && e.target.closest && e.target.closest('a.pricing-anchor-scroll[href^="#"]');
        if (!a) return;
        var id = a.getAttribute('href');
        if (!id || id.charAt(0) !== '#' || id.length < 2) return;
        var el = document.getElementById(id.slice(1));
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      false
    );
  }

  function initGuided() {
    var body = document.body;
    if (!body.classList.contains('pricing-page')) return;

    var reduceMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      document.documentElement.style.scrollBehavior = 'smooth';
    } else {
      document.documentElement.style.scrollBehavior = 'auto';
    }

    initSmoothAnchors();

    var flow = document.getElementById('pricing-groups');
    var rail = document.getElementById('pricing-flow-rail');
    var railItems = rail
      ? Array.prototype.slice.call(rail.querySelectorAll('[data-rail-stage]'))
      : [];
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-guided-panel]'));
    var sticky = document.getElementById('pricing-sticky-cta');
    var stickyLink = document.getElementById('pricing-sticky-cta-link');

    var installEl = document.getElementById('pricing-flow-installation');
    var scaleEl = document.getElementById('pricing-flow-scale');

    if (!panels.length || !flow) return;

    body.classList.add('pricing-page--guided');

    function scorePanel(el) {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight;
      var vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      if (vis < 24) return -Infinity;
      var center = (r.top + r.bottom) / 2;
      var mid = vh * 0.4;
      return vis * 1.2 - Math.abs(center - mid) * 0.15;
    }

    function pickActivePanel() {
      var best = null;
      var bestScore = -Infinity;
      panels.forEach(function (p) {
        var s = scorePanel(p);
        if (s > bestScore) {
          bestScore = s;
          best = p;
        }
      });
      if (bestScore <= 0) return null;
      return best;
    }

    function updateRail(activePanel) {
      if (!railItems.length) return;
      var stage = activePanel && activePanel.getAttribute('data-guided-stage');
      if (!stage) {
        railItems.forEach(function (li) {
          li.classList.remove('is-active', 'is-complete', 'is-future');
        });
        return;
      }
      var key = stage;
      if (stage === 'installation' || stage === 'preapply') key = 'apply';
      var idx = RAIL_ORDER.indexOf(key);
      if (idx < 0) idx = 0;

      railItems.forEach(function (li) {
        var rs = li.getAttribute('data-rail-stage');
        var i = RAIL_ORDER.indexOf(rs);
        li.classList.toggle('is-active', rs === key);
        li.classList.toggle('is-complete', i >= 0 && i < idx);
        li.classList.toggle('is-future', i > idx);
      });
    }

    function syncSticky(activePanel) {
      if (!sticky || !stickyLink) return;

      var scrollY = window.scrollY || window.pageYOffset;

      if (scrollY < 64) {
        sticky.hidden = true;
        return;
      }

      if (scaleEl) {
        var sr = scaleEl.getBoundingClientRect();
        if (sr.bottom < 48) {
          sticky.hidden = true;
          return;
        }
      }

      sticky.hidden = false;

      var st = activePanel && activePanel.getAttribute('data-guided-stage');
      var pid = activePanel && activePanel.id;

      if (st === 'start') {
        stickyLink.textContent = 'Start here';
        stickyLink.setAttribute('href', '#pricing-flow-entry');
        return;
      }

      if (st === 'decide' || st === 'build' || st === 'diagnose') {
        stickyLink.textContent = "See what's broken";
        stickyLink.setAttribute('href', '#pricing-flow-diagnose');
        return;
      }

      if (st === 'access' || pid === 'pricing-flow-operator') {
        stickyLink.textContent = 'Continue to installation';
        stickyLink.setAttribute('href', '#pricing-flow-installation');
        return;
      }

      if (st === 'preapply') {
        stickyLink.textContent = 'Install the system';
        stickyLink.setAttribute('href', '#pricing-flow-installation');
        return;
      }

      if (pid === 'pricing-flow-installation' || st === 'installation') {
        stickyLink.textContent = 'Install the system';
        stickyLink.setAttribute('href', '/private-access');
        return;
      }

      if (st === 'apply' && pid === 'pricing-flow-transformation') {
        stickyLink.textContent = 'Continue';
        stickyLink.setAttribute(
          'href',
          document.getElementById('pricing-flow-full-title')
            ? '#pricing-flow-full-title'
            : '#pricing-flow-scale'
        );
        return;
      }

      if (st === 'scale') {
        stickyLink.textContent = 'Custom builds';
        stickyLink.setAttribute('href', '#tier-custom-build');
        return;
      }

      stickyLink.textContent = "See what's broken";
      stickyLink.setAttribute('href', '#pricing-flow-diagnose');
    }

    var scheduled = null;
    function tick() {
      scheduled = null;
      var active = pickActivePanel();

      panels.forEach(function (p) {
        p.classList.toggle('is-guided-active', active === p);
      });


      updateRail(active);
      syncSticky(active);
    }

    function onScrollOrResize() {
      if (scheduled) return;
      scheduled = window.requestAnimationFrame(tick);
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    tick();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGuided);
  } else {
    initGuided();
  }
})();
