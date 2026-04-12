/**
 * Early Mode: 3:00–7:00 local. Sets html.early-mode; optional easter egg + API.
 */
(function (global) {
  var CHECK_MS = 60000;
  var DWELL_MS = 42000;
  var SCROLL_THRESHOLD = 0.72;

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

  var eggBound = false;
  function bindEasterEgg() {
    if (eggBound) return;
    var slot = global.document.getElementById('early-private-slot');
    if (!slot) return;
    eggBound = true;

    var revealed = false;
    function reveal() {
      if (revealed) return;
      if (!getIsEarlyMode()) return;
      revealed = true;
      slot.classList.add('early-private-slot--visible');
      slot.removeAttribute('hidden');
    }

    global.setTimeout(function () {
      if (getIsEarlyMode()) reveal();
    }, DWELL_MS);

    function onScroll() {
      if (revealed || !getIsEarlyMode()) return;
      var doc = global.document.documentElement;
      var sh = doc.scrollHeight - global.innerHeight;
      if (sh <= 0) return;
      if ((global.scrollY || 0) / sh >= SCROLL_THRESHOLD) reveal();
    }

    global.addEventListener('scroll', onScroll, { passive: true });
    global.addEventListener('earlymodechange', function (ev) {
      if (ev && ev.detail && ev.detail.isEarlyMode) {
        global.setTimeout(function () {
          onScroll();
        }, 0);
      }
    });
  }

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
