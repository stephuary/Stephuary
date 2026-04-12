/**
 * Private Selection — Early Mode + signal-based visibility; monthly local storage.
 */
(function (global) {
  var STORAGE_KEY = 'stephuary_private_selection_v1';
  var SESSION_DWELL = 'ps_dwell_sec';
  var SESSION_SEEN = 'ps_section_ids';

  function monthKey() {
    var d = new Date();
    var m = d.getMonth() + 1;
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m;
  }

  function isEarlyMode() {
    try {
      return global.document.documentElement.classList.contains('early-mode');
    } catch (e) {
      return false;
    }
  }

  function hasDiagnostic() {
    try {
      return global.localStorage.getItem('diagnosticCompleted') === 'true';
    } catch (e) {
      return false;
    }
  }

  function getDwellSec() {
    try {
      return parseInt(global.sessionStorage.getItem(SESSION_DWELL) || '0', 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function getSectionCount() {
    try {
      var raw = global.sessionStorage.getItem(SESSION_SEEN);
      if (!raw) return 0;
      var a = JSON.parse(raw);
      return Array.isArray(a) ? a.length : 0;
    } catch (e) {
      return 0;
    }
  }

  function hasMeaningfulTime() {
    return getDwellSec() >= 120;
  }

  function hasMultiSection() {
    return getSectionCount() >= 3;
  }

  function secondarySignal() {
    return hasDiagnostic() || hasMeaningfulTime() || hasMultiSection();
  }

  function shouldShowFeature() {
    return isEarlyMode() && secondarySignal();
  }

  function loadStore() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || o.v !== 1) return null;
      return o;
    } catch (e) {
      return null;
    }
  }

  function saveStore(o) {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
    } catch (e) {}
  }

  function currentMonthEntry() {
    var mk = monthKey();
    var st = loadStore();
    if (!st || st.month !== mk) return null;
    return st.entry || null;
  }

  function hasSubmittedThisMonth() {
    var e = currentMonthEntry();
    return !!(e && e.submittedAt);
  }

  function gatherDiagnosticSnapshot() {
    var snap = {
      diagnosticCompleted: hasDiagnostic(),
      result: null,
      userState: null
    };
    try {
      var r = global.localStorage.getItem('stephuary_result_v1');
      if (r) snap.result = JSON.parse(r);
    } catch (e) {}
    try {
      var u = global.localStorage.getItem('stephuary_user_state_v1');
      if (u) snap.userState = JSON.parse(u);
    } catch (e) {}
    return snap;
  }

  function prefillFromSnapshot() {
    var out = { build: '', stuck: '', extra: '' };
    try {
      var r = global.localStorage.getItem('stephuary_result_v1');
      if (r) {
        var o = JSON.parse(r);
        if (o.diagnostic) {
          if (o.diagnostic.main_problem) out.build = String(o.diagnostic.main_problem).trim();
          if (o.diagnostic.fix_first) out.stuck = String(o.diagnostic.fix_first).trim();
        }
        if (!out.build && o.type_primary) out.build = String(o.type_primary).trim();
      }
    } catch (e) {}
    try {
      var u = global.localStorage.getItem('stephuary_user_state_v1');
      if (u) {
        var st = JSON.parse(u);
        if (st.outputs) {
          if (!out.build && st.outputs.mainIssue) out.build = String(st.outputs.mainIssue).trim();
          if (!out.stuck && st.outputs.nextMove) out.stuck = String(st.outputs.nextMove).trim();
        }
      }
    } catch (e) {}
    return out;
  }

  var dwellTimer = null;
  function tickDwell() {
    try {
      var n = getDwellSec() + 10;
      global.sessionStorage.setItem(SESSION_DWELL, String(n));
    } catch (e) {}
  }

  function bindDwell() {
    if (dwellTimer) return;
    dwellTimer = global.setInterval(tickDwell, 10000);
  }

  function bindSectionObserver() {
    if (!global.IntersectionObserver) return;
    var root = global.document.getElementById('main-content');
    if (!root) return;
    var sections = root.querySelectorAll('section[id], section[data-sh-flow-section]');
    if (!sections.length) return;

    var list = Array.prototype.slice.call(sections);
    var seen = new Set();
    try {
      var prev = JSON.parse(global.sessionStorage.getItem(SESSION_SEEN) || '[]');
      if (Array.isArray(prev)) prev.forEach(function (id) { seen.add(id); });
    } catch (e) {}

    function persistSeen() {
      try {
        global.sessionStorage.setItem(SESSION_SEEN, JSON.stringify(Array.from(seen)));
      } catch (e) {}
    }

    function sectionKey(el) {
      if (el.id) return String(el.id).slice(0, 64);
      var ds = el.getAttribute('data-sh-flow-section');
      if (ds !== null && ds !== '') return ('data-' + ds).slice(0, 64);
      var ix = list.indexOf(el);
      return 'sec-' + (ix >= 0 ? ix : 0);
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting || en.intersectionRatio < 0.25) return;
          var key = sectionKey(en.target);
          if (seen.has(key)) return;
          seen.add(key);
          persistSeen();
          tryMount();
        });
      },
      { root: null, threshold: [0, 0.25, 0.5] }
    );

    list.forEach(function (sec) {
      obs.observe(sec);
    });
  }

  function getSessionId() {
    try {
      var k = 'ps_session_id';
      var id = global.sessionStorage.getItem(k);
      if (!id) {
        id = 'ps_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
        global.sessionStorage.setItem(k, id);
      }
      return id;
    } catch (e) {
      return null;
    }
  }

  function syncEarlySlot() {
    var slot = global.document.getElementById('early-private-slot');
    if (!slot) return;
    if (shouldShowFeature()) {
      slot.classList.add('early-private-slot--visible');
      slot.removeAttribute('hidden');
    } else {
      slot.classList.remove('early-private-slot--visible');
      slot.setAttribute('hidden', '');
    }
  }

  function mountHTML() {
    return (
      '<section class="private-selection" id="private-selection" aria-label="Private Selection">' +
      '<div class="private-selection__inner">' +
      '<h2 class="private-selection__title">Private Selection</h2>' +
      '<p class="private-selection__body">Once a month, one build is selected.</p>' +
      '<p class="private-selection__body private-selection__body--sub">Selection is based on clarity, not application.</p>' +
      '<button type="button" class="btn btn--ghost private-selection__enter" id="ps-open-btn">Enter</button>' +
      (hasSubmittedThisMonth()
        ? '<p class="private-selection__status" id="ps-inline-status">Entry submitted this month.</p>'
        : '') +
      '</div></section>'
    );
  }

  function tryMount() {
    var mount = global.document.getElementById('private-selection-mount');
    if (!mount) return;

    syncEarlySlot();

    if (!shouldShowFeature()) {
      mount.innerHTML = '';
      mount.setAttribute('hidden', '');
      return;
    }

    mount.removeAttribute('hidden');
    if (!mount.querySelector('#private-selection')) {
      mount.innerHTML = mountHTML();
      var btn = global.document.getElementById('ps-open-btn');
      if (btn) btn.addEventListener('click', openOverlay);
    } else {
      var stEl = global.document.getElementById('ps-inline-status');
      if (hasSubmittedThisMonth()) {
        if (!stEl) {
          var inner = mount.querySelector('.private-selection__inner');
          if (inner) {
            var p = global.document.createElement('p');
            p.className = 'private-selection__status';
            p.id = 'ps-inline-status';
            p.textContent = 'Entry submitted this month.';
            inner.appendChild(p);
          }
        }
      } else if (stEl) {
        stEl.remove();
      }
    }
  }

  function openOverlay(opts) {
    opts = opts || {};
    if (!shouldShowFeature()) return;
    var overlay = global.document.getElementById('ps-overlay');
    if (!overlay) return;

    var formView = global.document.getElementById('ps-view-form');
    var doneView = global.document.getElementById('ps-view-done');
    var form = global.document.getElementById('ps-form');
    var updateBtn = global.document.getElementById('ps-update-entry');

    var showForm = !hasSubmittedThisMonth() || opts.update === true;

    if (showForm) {
      if (formView) formView.hidden = false;
      if (doneView) doneView.hidden = true;
      if (form) {
        var entry = currentMonthEntry();
        var b = form.querySelector('[name="build"]');
        var s = form.querySelector('[name="stuck"]');
        var x = form.querySelector('[name="extra"]');
        if (entry && entry.submittedAt) {
          if (b) b.value = entry.build || '';
          if (s) s.value = entry.stuck || '';
          if (x) x.value = entry.extra || '';
        } else {
          var pre = prefillFromSnapshot();
          if (b && !b.value) b.value = pre.build;
          if (s && !s.value) s.value = pre.stuck;
          if (x && !x.value) x.value = pre.extra;
        }
      }
    } else {
      if (formView) formView.hidden = true;
      if (doneView) doneView.hidden = false;
    }

    if (updateBtn) {
      updateBtn.hidden = showForm || !hasSubmittedThisMonth();
    }

    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    global.document.body.classList.add('ps-open');
    var closeBtn = global.document.getElementById('ps-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeOverlay() {
    var overlay = global.document.getElementById('ps-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    global.document.body.classList.remove('ps-open');
  }

  function submitForm(ev) {
    ev.preventDefault();
    var form = global.document.getElementById('ps-form');
    if (!form) return;

    var mk = monthKey();

    var fd = new FormData(form);
    var build = (fd.get('build') || '').toString().trim();
    var stuck = (fd.get('stuck') || '').toString().trim();
    var extra = (fd.get('extra') || '').toString().trim();
    if (!build || !stuck) return;

    var entry = {
      submittedAt: Date.now(),
      build: build,
      stuck: stuck,
      extra: extra,
      diagnosticSnapshot: gatherDiagnosticSnapshot(),
      sessionDwellSec: getDwellSec(),
      sectionSignals: getSectionCount(),
      sessionId: getSessionId()
    };

    saveStore({
      v: 1,
      month: mk,
      entry: entry
    });

    var formView = global.document.getElementById('ps-view-form');
    var doneView = global.document.getElementById('ps-view-done');
    if (formView) formView.hidden = true;
    if (doneView) doneView.hidden = false;
    var updateBtn = global.document.getElementById('ps-update-entry');
    if (updateBtn) updateBtn.hidden = false;
    tryMount();
  }

  function bindOverlay() {
    var overlay = global.document.getElementById('ps-overlay');
    if (!overlay) return;

    var bg = overlay.querySelector('[data-ps-close]');
    if (bg) bg.addEventListener('click', closeOverlay);

    var closeBtn = global.document.getElementById('ps-close');
    if (closeBtn) closeBtn.addEventListener('click', closeOverlay);

    var form = global.document.getElementById('ps-form');
    if (form) form.addEventListener('submit', submitForm);

    var upd = global.document.getElementById('ps-update-entry');
    if (upd) {
      upd.addEventListener('click', function () {
        openOverlay({ update: true });
      });
    }

    global.document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeOverlay();
    });
  }

  function bindEarlySlot() {
    var slot = global.document.getElementById('early-private-slot');
    if (!slot) return;
    var link = slot.querySelector('a');
    if (!link) return;
    link.setAttribute('href', '#');
    link.textContent = 'Private Selection';
    link.addEventListener('click', function (e) {
      e.preventDefault();
      if (!shouldShowFeature()) return;
      openOverlay();
    });
  }

  function init() {
    bindDwell();
    bindSectionObserver();
    bindOverlay();
    bindEarlySlot();
    tryMount();
    global.addEventListener('earlymodechange', function () {
      tryMount();
    });
    global.setInterval(function () {
      tryMount();
    }, 20000);
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.StephuaryPrivateSelection = {
    shouldShowFeature: shouldShowFeature,
    tryMount: tryMount,
    syncEarlySlot: syncEarlySlot,
    openOverlay: openOverlay,
    closeOverlay: closeOverlay,
    hasSubmittedThisMonth: hasSubmittedThisMonth
  };
})(typeof window !== 'undefined' ? window : this);
