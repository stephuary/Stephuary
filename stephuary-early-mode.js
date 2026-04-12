/**
 * Early Mode: 3:00–7:00 local. Sets html.early-mode; optional easter egg + API.
 */
(function (global) {
  var CHECK_MS = 60000;

  function compute() {
    try {
      var h = new Date().getHours();
      return h >= 3 && h < 7;
    } catch (e) {
      return false;
    }
  }

  function apply() {
    var on = compute();
    var el = global.document.documentElement;
    el.classList.toggle('early-mode', on);
    el.setAttribute('data-early-mode', on ? 'true' : 'false');
    try {
      global.dispatchEvent(new CustomEvent('earlymodechange', { detail: { isEarlyMode: on } }));
    } catch (e) {}
    return on;
  }

  function getIsEarlyMode() {
    try {
      return global.document.documentElement.classList.contains('early-mode');
    } catch (e) {
      return false;
    }
  }

  /** #early-private-slot visibility is managed by stephuary-private-selection.js (One Free Spot). */
  function bindEasterEgg() {}

  function init() {
    apply();
    global.setInterval(apply, CHECK_MS);
    bindEasterEgg();
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  var api = {
    refresh: apply,
    compute: compute,
    getIsEarlyMode: getIsEarlyMode
  };
  try {
    Object.defineProperty(api, 'isEarlyMode', {
      get: function () {
        return getIsEarlyMode();
      },
      configurable: true
    });
  } catch (e) {}
  global.StephuaryEarlyMode = api;
})(typeof window !== 'undefined' ? window : this);
