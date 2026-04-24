/* Stephuary consent + GA4 loader.
 * GA4 must only load after explicit accept.
 * Consent is stored in localStorage under `sh_consent`.
 * Values: 'accepted' | 'rejected' (anything else = not yet decided).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'sh_consent';
  // TODO(stephanie): replace with live GA4 Measurement ID before launch
  var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function loadGA4() {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;
    if (window.__sh_ga_loaded) return;
    window.__sh_ga_loaded = true;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  function renderBanner() {
    if (document.getElementById('sh-consent-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'sh-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.innerHTML =
      '<div class="sh-consent__inner">' +
      '<p class="sh-consent__copy">We use minimal cookies for analytics. You can accept or reject. Essential site cookies are always on. <a href="/privacy#cookies">Read more</a>.</p>' +
      '<div class="sh-consent__actions">' +
      '<button type="button" class="sh-consent__btn" data-sh-consent="rejected">Reject</button>' +
      '<button type="button" class="sh-consent__btn sh-consent__btn--accept" data-sh-consent="accepted">Accept</button>' +
      '</div></div>';
    document.body.appendChild(banner);

    banner.addEventListener('click', function (e) {
      var t = e.target;
      if (!(t instanceof Element)) return;
      var choice = t.getAttribute('data-sh-consent');
      if (!choice) return;
      setConsent(choice);
      if (choice === 'accepted') {
        loadGA4();
      }
      banner.remove();
    });
  }

  function init() {
    var consent = getConsent();
    if (consent === 'accepted') {
      loadGA4();
      return;
    }
    if (consent === 'rejected') {
      return;
    }
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(
        function () {
          renderBanner();
        },
        { timeout: 2e3 }
      );
    } else {
      setTimeout(renderBanner, 600);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
