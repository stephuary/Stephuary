/**
 * Private Selection — 3–7 AM local only; modal overlay; monthly local storage.
 */
(function (global) {
  var STORAGE_KEY = 'stephuary_private_selection_v2';
  var STORAGE_LEGACY = 'stephuary_private_selection_v1';

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

  function shouldShowFeature() {
    return isEarlyMode();
  }

  function loadStore() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && o.v === 2) return o;
      }
      var leg = global.localStorage.getItem(STORAGE_LEGACY);
      if (leg) {
        var o1 = JSON.parse(leg);
        if (o1 && o1.v === 1) return o1;
      }
    } catch (e) {}
    return null;
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

  function hasLegacyShape(entry) {
    return entry && (entry.stuck !== undefined) && (entry.year === undefined);
  }

  function hasSubmittedThisMonth() {
    var e = currentMonthEntry();
    return !!(e && e.submittedAt);
  }

  function loadPersonalizationState() {
    try {
      var raw = global.localStorage.getItem('stephuary_user_state_v1');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function loadResult() {
    try {
      var raw = global.localStorage.getItem('stephuary_result_v1');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Returns { kind, label } or null. kind is internal key for storage.
   */
  function pickDynamicQuestion(state, result) {
    state = state || {};
    var tags = state.tags || {};
    var scores = state.stageScores || {};
    var rec = String(state.recommendedTier || '');
    var bott = String(tags.bottleneck || '');
    var stage = String(state.stage || '');

    var snapScore = typeof scores.snapshot === 'number' ? scores.snapshot : 0;
    if (bott === 'needs_full_review' || snapScore >= 4 || stage === 'snapshot') {
      return { kind: 'snapshot', label: 'What feels unclear even after going through this?' };
    }
    if (
      rec.indexOf('direction') >= 0 ||
      bott === 'too_many_ideas' ||
      bott === 'scattered_focus' ||
      bott === 'no_offer' ||
      tags.directionClarity === 'none'
    ) {
      return { kind: 'direction', label: 'What are you deciding between right now?' };
    }
    if (rec.indexOf('revenue') >= 0 || bott === 'no_money_path' || tags.goal === 'make_money' || tags.goal === 'get_clients') {
      return { kind: 'revenue', label: 'How are you currently trying to make money from this?' };
    }
    if (
      rec.indexOf('lock') >= 0 ||
      bott === 'wrong_order' ||
      bott === 'execution_breakdown' ||
      (tags.executionIssue && tags.executionIssue !== 'none' && tags.executionIssue !== '')
    ) {
      return { kind: 'friction', label: 'What is slowing you down most day to day?' };
    }
    if (rec.indexOf('concept') >= 0 || bott === 'weak_positioning' || stage === 'concept') {
      return { kind: 'concept', label: 'Who is this actually for?' };
    }
    if (state.diagnosticCompleted || (result && result.diagnostic)) {
      return { kind: 'snapshot', label: 'What feels unclear even after going through this?' };
    }
    return null;
  }

  function gatherDiagnosticSnapshot() {
    var snap = {
      diagnosticCompleted: false,
      result: null,
      userState: null,
      dynamicKind: null
    };
    try {
      snap.diagnosticCompleted = global.localStorage.getItem('diagnosticCompleted') === 'true';
    } catch (e) {}
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
    var out = {
      build: '',
      year: '',
      stuck: '',
      tried: '',
      why: '',
      dynamic: ''
    };
    var r = loadResult();
    var st = loadPersonalizationState();
    try {
      if (r && r.diagnostic) {
        if (r.diagnostic.main_problem) out.build = String(r.diagnostic.main_problem).trim();
        if (r.diagnostic.fix_first) out.stuck = String(r.diagnostic.fix_first).trim();
      }
      if (!out.build && r && r.type_primary) out.build = String(r.type_primary).trim();
    } catch (e) {}
    try {
      if (st && st.outputs) {
        if (!out.build && st.outputs.mainIssue) out.build = String(st.outputs.mainIssue).trim();
        if (!out.stuck && st.outputs.nextMove) out.stuck = String(st.outputs.nextMove).trim();
        if (st.outputs.timeLoss) out.tried = 'Time cost context: ' + String(st.outputs.timeLoss).trim();
        if (st.outputs.moneyLoss) out.why = 'Cost context: ' + String(st.outputs.moneyLoss).trim();
      }
      if (st && st.stageReason && !out.why) out.why = String(st.stageReason).trim();
    } catch (e) {}
    return out;
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

  function tryMount() {
    syncEarlySlot();
  }

  function renderDynamicField() {
    var slot = global.document.getElementById('ps-dynamic-slot');
    if (!slot) return null;
    slot.innerHTML = '';
    var st = loadPersonalizationState();
    var res = loadResult();
    var pick = pickDynamicQuestion(st, res);
    if (!pick) return null;

    var wrap = global.document.createElement('div');
    wrap.className = 'ps-dynamic';
    wrap.setAttribute('data-ps-dynamic', pick.kind);

    var id = 'ps-field-dynamic';
    var lab = global.document.createElement('label');
    lab.className = 'ps-label';
    lab.setAttribute('for', id);
    lab.textContent = pick.label;

    var ta = global.document.createElement('textarea');
    ta.id = id;
    ta.className = 'ps-input';
    ta.name = 'dynamic';
    ta.rows = 3;
    ta.setAttribute('data-dynamic-kind', pick.kind);

    wrap.appendChild(lab);
    wrap.appendChild(ta);
    slot.appendChild(wrap);
    return pick.kind;
  }

  function openOverlay(opts) {
    opts = opts || {};
    if (!shouldShowFeature()) return;

    var overlay = global.document.getElementById('ps-overlay');
    if (!overlay) return;

    var formView = global.document.getElementById('ps-view-form');
    var doneView = global.document.getElementById('ps-view-done');
    var form = global.document.getElementById('ps-form');

    var showForm = !hasSubmittedThisMonth() || opts.update === true;

    if (showForm) {
      if (formView) formView.hidden = false;
      if (doneView) doneView.hidden = true;
      if (form) {
        form.reset();
        renderDynamicField();
        var entry = currentMonthEntry();
        var pre = prefillFromSnapshot();
        function setn(name, val) {
          var el = form.querySelector('[name="' + name + '"]');
          if (!el) return;
          el.value = val != null && val !== undefined ? String(val) : '';
        }
        if (entry && entry.submittedAt) {
          setn('build', entry.build);
          setn('stuck', entry.stuck);
          if (hasLegacyShape(entry)) {
            setn('year', '');
            setn('tried', entry.extra);
            setn('why', '');
          } else {
            setn('year', entry.year);
            setn('tried', entry.tried);
            setn('why', entry.why);
          }
          if (entry.dynamic) {
            var d = form.querySelector('[name="dynamic"]');
            if (d) d.value = entry.dynamic;
          }
        } else {
          setn('build', pre.build);
          setn('year', pre.year);
          setn('stuck', pre.stuck);
          setn('tried', pre.tried);
          setn('why', pre.why);
        }
      }
    } else {
      if (formView) formView.hidden = true;
      if (doneView) doneView.hidden = false;
    }

    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    global.document.body.classList.add('ps-open');

    var reduceMotion =
      global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      overlay.classList.add('is-open--ready');
    } else {
      global.requestAnimationFrame(function () {
        overlay.classList.add('is-open--ready');
      });
    }

    var closeBtn = global.document.getElementById('ps-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeOverlay() {
    var overlay = global.document.getElementById('ps-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-open--ready');
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
    var year = (fd.get('year') || '').toString().trim();
    var stuck = (fd.get('stuck') || '').toString().trim();
    var tried = (fd.get('tried') || '').toString().trim();
    var why = (fd.get('why') || '').toString().trim();
    var dynamic = (fd.get('dynamic') || '').toString().trim();
    var dynEl = form.querySelector('[name="dynamic"]');
    var dynamicKind = dynEl ? dynEl.getAttribute('data-dynamic-kind') || '' : '';

    if (!build || !year || !stuck || !tried || !why) return;

    var snap = gatherDiagnosticSnapshot();
    snap.dynamicKind = dynamicKind || null;

    var entry = {
      submittedAt: Date.now(),
      build: build,
      year: year,
      stuck: stuck,
      tried: tried,
      why: why,
      dynamic: dynamic,
      dynamicKind: dynamicKind,
      diagnosticSnapshot: snap
    };

    saveStore({
      v: 2,
      month: mk,
      entry: entry
    });

    var formView = global.document.getElementById('ps-view-form');
    var doneView = global.document.getElementById('ps-view-done');
    if (formView) formView.hidden = true;
    if (doneView) doneView.hidden = false;
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

    global.document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        e.preventDefault();
        closeOverlay();
      }
    });
  }

  function bindEarlySlot() {
    var slot = global.document.getElementById('early-private-slot');
    if (!slot) return;
    var link = slot.querySelector('a');
    if (!link) return;
    link.setAttribute('href', '#');
    link.setAttribute('role', 'button');
    link.addEventListener('click', function (e) {
      e.preventDefault();
      if (!shouldShowFeature()) return;
      openOverlay();
    });
  }

  function init() {
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
