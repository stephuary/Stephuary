/**
 * Early Mode: 3:00–7:00 local → html.early-mode.
 * God Hour: 4:00–7:00 local → html.god-hour (subset of early; see stephuary-god-hour.css).
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

  function computeGodHour() {
    try {
      var h = new Date().getHours();
      return h >= 4 && h < 7;
    } catch (e2) {
      return false;
    }
  }

  function apply() {
    var on = compute();
    var gh = computeGodHour();
    var el = global.document.documentElement;
    el.classList.toggle('early-mode', on);
    el.classList.toggle('god-hour', gh);
    el.setAttribute('data-early-mode', on ? 'true' : 'false');
    el.setAttribute('data-god-hour', gh ? 'true' : 'false');
    try {
      global.dispatchEvent(
        new CustomEvent('earlymodechange', { detail: { isEarlyMode: on, isGodHour: gh } })
      );
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

  function getIsGodHour() {
    try {
      return global.document.documentElement.classList.contains('god-hour');
    } catch (e3) {
      return false;
    }
  }

  /** Monthly free 1:1 email strip lives at bottom of index.html (stephuary-private-selection.js). */
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
    computeGodHour: computeGodHour,
    getIsEarlyMode: getIsEarlyMode,
    getIsGodHour: getIsGodHour
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
