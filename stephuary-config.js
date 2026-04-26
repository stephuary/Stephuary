/**
 * Global site config. FREE_MODE defaults to false (production / Stripe on).
 * To enable free-flow testing, set window.__STEPHUARY_FREE__ = true before this script loads.
 * Load before stephuary-interactive.js and other Stephuary bundles.
 */
(function (global) {
  // FREE_MODE: when true the site bypasses Stripe checkouts and Pricing/Snapshot CTAs
  // route to free-flow placeholders. Flip via window.__STEPHUARY_FREE__ before this file
  // loads (e.g. from a build script or env-injected inline snippet). Default = false (prod).
  var FREE_MODE = (typeof global !== 'undefined' && global.__STEPHUARY_FREE__) === true;

  var PAID_TIER_HREF = {
    diagnostic: '/capture',
    rooms: '/systems',
    'direction-system': '/direction-system',
    'revenue-system': '/revenue-system',
    'direction-lock': '/focused-review',
    'concept-build': '/private-access',
    snapshot: '/snapshot'
  };

  var FREE_TIER_HREF = {
    diagnostic: '/capture',
    rooms: '/systems',
    'direction-system': '/direction-system',
    'revenue-system': '/revenue-system',
    'direction-lock': '/focused-review',
    'concept-build': '/private-access',
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
    shouldBypassPhasePaymentGate: shouldBypassPhasePaymentGate,
    /**
     * Legacy: was FormSubmit for homepage monthly session capture. Site forms now POST to
     * /api/form-submit. Keep null unless a legacy script still reads this.
     */
    MONTHLY_FREE_SESSION_FORM_ACTION: null,
    /** Cloudflare Stream — pricing staircase strip. */
    PRICING_STAIRCASE_VIDEO:
      'https://customer-vjyp7ff1wau3k7is.cloudflarestream.com/482fd025db674eaf7f1246937e0145b2/manifest/video.m3u8',
    PRICING_STAIRCASE_POSTER:
      'https://customer-vjyp7ff1wau3k7is.cloudflarestream.com/482fd025db674eaf7f1246937e0145b2/thumbnails/thumbnail.jpg?height=1080'
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
    var path = (global.location.pathname || '').toLowerCase();
    if (path.indexOf('checkout') !== -1) return;
    global.document.querySelectorAll('a[href*="checkout.stripe.com"]').forEach(function (a) {
      if (a.getAttribute('data-paid-href')) return;
      a.setAttribute('data-paid-href', a.getAttribute('href') || '');
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
