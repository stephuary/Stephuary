/**
 * Global site config. Set FREE_MODE = false for production (paid / Stripe flows).
 * Load before stephuary-interactive.js and other Stephuary bundles.
 */
(function (global) {
  var FREE_MODE = true;

  var PAID_TIER_HREF = {
    diagnostic: '/capture',
    rooms: '/playbooks',
    'direction-system': '/phases/direction',
    'revenue-system': '/phases/revenue',
    'direction-lock': '/focused-review',
    'concept-build': '/access',
    snapshot: '/snapshot'
  };

  var FREE_TIER_HREF = {
    diagnostic: '/capture',
    rooms: '/playbooks',
    'direction-system': '/room-02-direction',
    'revenue-system': '/monetize',
    'direction-lock': '/focused-review',
    'concept-build': '/access',
    snapshot: '/snapshot#free-flow'
  };

  function getTierPurchaseHref(tierId) {
    if (!tierId) return null;
    if (FREE_MODE && Object.prototype.hasOwnProperty.call(FREE_TIER_HREF, tierId)) {
      return FREE_TIER_HREF[tierId];
    }
    if (Object.prototype.hasOwnProperty.call(PAID_TIER_HREF, tierId)) return PAID_TIER_HREF[tierId];
    return null;
  }

  function shouldBypassPhasePaymentGate() {
    return !!FREE_MODE;
  }

  global.STEPHUARY_CONFIG = {
    FREE_MODE: FREE_MODE,
    getTierPurchaseHref: getTierPurchaseHref,
    PAID_TIER_HREF: PAID_TIER_HREF,
    FREE_TIER_HREF: FREE_TIER_HREF,
    shouldBypassPhasePaymentGate: shouldBypassPhasePaymentGate
  };

  function onReady(fn) {
    if (!global.document) return;
    if (global.document.readyState === 'loading') global.document.addEventListener('DOMContentLoaded', fn);
    else global.setTimeout(fn, 0);
  }

  function patchPricingTierLinks() {
    if (!global.document.querySelectorAll) return;
    global.document.querySelectorAll('[data-tier-id] .tier-cta').forEach(function (a) {
      var row = a.closest('[data-tier-id]');
      if (!row) return;
      var id = row.getAttribute('data-tier-id');
      if (!id) return;
      var href = getTierPurchaseHref(id);
      if (href) a.setAttribute('href', href);
    });
  }

  function patchProductPageCtAs() {
    global.document.querySelectorAll('a[href="/pricing#tier-direction"]').forEach(function (a) {
      a.setAttribute('href', getTierPurchaseHref('direction-system'));
    });
    global.document.querySelectorAll('a[href="/pricing#tier-revenue"]').forEach(function (a) {
      a.setAttribute('href', getTierPurchaseHref('revenue-system'));
    });
  }

  function bypassStripeCheckoutAnchors() {
    if (!FREE_MODE) return;
    global.document.querySelectorAll('a[href*="checkout.stripe.com"]').forEach(function (a) {
      if (a.getAttribute('data-paid-href')) return;
      a.setAttribute('data-paid-href', a.getAttribute('href') || '');
      var path = (global.location.pathname || '').toLowerCase();
      if (path.indexOf('snapshot') >= 0) {
        a.setAttribute('href', '#free-flow');
      } else if (path.indexOf('focused-review') >= 0 || path.indexOf('focused') >= 0) {
        a.setAttribute('href', '#free-flow');
      } else {
        a.setAttribute('href', '#free-flow');
      }
    });
  }

  function showFreeModeBanner() {
    if (!FREE_MODE || !global.document.body) return;
    try {
      global.document.documentElement.classList.add('stephuary-free-mode');
    } catch (e) {}
    var b = global.document.createElement('p');
    b.className = 'stephuary-free-mode-banner';
    b.textContent = 'Testing mode active';
    b.setAttribute('aria-hidden', 'true');
    global.document.body.appendChild(b);
  }

  onReady(function () {
    patchPricingTierLinks();
    patchProductPageCtAs();
    bypassStripeCheckoutAnchors();
    showFreeModeBanner();
  });
})(typeof window !== 'undefined' ? window : this);
