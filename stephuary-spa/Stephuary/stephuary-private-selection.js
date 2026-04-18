/**
 * One Free Spot — time-based free submission (3–7 AM local); modal overlay; monthly local storage.
 */
(function (global) {
  var STORAGE_KEY = 'stephuary_one_free_spot_v1';
  var STORAGE_LEGACY_V2 = 'stephuary_private_selection_v2';
  var STORAGE_LEGACY_V1 = 'stephuary_private_selection_v1';

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
        if (o && o.v === 1) return o;
      }
      var leg2 = global.localStorage.getItem(STORAGE_LEGACY_V2);
      if (leg2) {
        var o2 = JSON.parse(leg2);
        if (o2 && o2.v === 2) return o2;
      }
      var leg1 = global.localStorage.getItem(STORAGE_LEGACY_V1);
      if (leg1) {
        var o1 = JSON.parse(leg1);
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

  var LEDGER_KEY = 'stephuary_ps_ledger_v1';
  var TAG_PRIORITY = {
    TOP: 'TOP CANDIDATE',
    STRONG: 'STRONG FIT',
    REVIEW: 'REVIEW',
    LOW: 'LOW PRIORITY'
  };

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function lc(s) {
    return String(s || '').toLowerCase();
  }

  function joinFields(e) {
    if (!e) return '';
    if (e.q1 != null || e.q2 != null || e.q3 != null) {
      return [e.q1, e.q2, e.q3].filter(Boolean).join(' \n ');
    }
    return [e.build, e.year, e.stuck, e.tried, e.why, e.dynamic].filter(Boolean).join(' \n ');
  }

  function entryToQFields(entry) {
    if (!entry) return { q1: '', q2: '', q3: '' };
    if (entry.q1 != null || entry.q2 != null || entry.q3 != null) {
      return {
        q1: String(entry.q1 != null ? entry.q1 : '').trim(),
        q2: String(entry.q2 != null ? entry.q2 : '').trim(),
        q3: String(entry.q3 != null ? entry.q3 : '').trim()
      };
    }
    return {
      q1: String(entry.build || '').trim(),
      q2: String(entry.stuck || '').trim(),
      q3: String(entry.why || entry.tried || '').trim()
    };
  }

  function wordCount(s) {
    return String(s || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }

  function matches(re, s) {
    return (String(s).match(re) || []).length;
  }

  /** Base dimension 0–10: specificity and structure. */
  function scoreClarity(combined) {
    var t = lc(combined);
    var wc = wordCount(combined);
    var s = 5;
    if (wc >= 45) s += 2;
    else if (wc >= 25) s += 1;
    if (/\b(because|specifically|means|for example|namely|i mean)\b/i.test(combined)) s += 2;
    if (/\d/.test(combined)) s += 1;
    s -= Math.min(3, matches(/\b(something|anything|stuff|thing|maybe|idk|not sure|vague|whatever)\b/gi, combined));
    if (wc < 12) s -= 2;
    return clamp(s, 0, 10);
  }

  /** Base: concrete next moves, verbs, experiments. */
  function scoreAction(combined) {
    var s = 5;
    if (/\b(this week|next step|ship|launch|pilot|test|offer|prototype|build|write|send|schedule|book|hire)\b/i.test(combined)) s += 3;
    if (/\b(will|going to|plan to|need to)\b/i.test(combined)) s += 1;
    s -= Math.min(3, matches(/\b(someday|eventually|one day|when i|if i ever)\b/gi, combined));
    return clamp(s, 0, 10);
  }

  /** Base: time pressure and stakes. */
  function scoreUrgency(combined) {
    var s = 5;
    if (/\b(now|today|this month|deadline|asap|can't wait|need to decide|running out|losing)\b/i.test(combined)) s += 3;
    if (/\b(important|matters|stakes|risk|cost)\b/i.test(combined)) s += 1;
    s -= Math.min(2, matches(/\b(no rush|whenever|someday)\b/gi, combined));
    return clamp(s, 0, 10);
  }

  /** Base: realistic paths vs fantasy. */
  function scoreFeasibility(combined) {
    var s = 5;
    if (/\b(service|clients|revenue|hours|offer|consulting|event|venue|booking|contract|invoice|pilot)\b/i.test(combined)) s += 3;
    if (/\b(passive income|get rich|millions|billion|world|everyone)\b/i.test(combined)) s -= 3;
    if (/\b(realistic|small|first|one|pilot|mvp)\b/i.test(combined)) s += 1;
    return clamp(s, 0, 10);
  }

  /** Base: overlap with CEI / systems / culture-adjacent themes. */
  function scoreAlignment(combined) {
    var s = 5;
    if (/\b(experience|audience|positioning|system|operations|workflow|culture|hospitality|service|brand narrative)\b/i.test(combined)) s += 2;
    if (/\b(cei|cultural experience|intelligence)\b/i.test(lc(combined))) s += 2;
    return clamp(s, 0, 10);
  }

  var FOUNDER_THEME =
    /\b(culture|hospitality|operations|systems?|media|writing|food|design|events?|advisory|experience|strategy|venue|guest|service|offer|concept|narrative|editorial|program|workshop|retreat|tasting|room|table|kitchen|story|editor|producer|curator)\b/gi;

  var CONCEPT_SIGNALS =
    /\b(own|distinct|niche|for\s+\w+|audience|position|name|specific|different|only|first|only one)\b/gi;

  var HIGH_LEVERAGE =
    /\b(already|sitting on|close|one move|positioning|direction|unlock|leverage|undervalued|underpriced|clearer)\b/gi;

  /** Founder preference 0–10 (heuristic). */
  function scoreFounderPreference(combined) {
    var s = 4;
    var th = matches(FOUNDER_THEME, combined);
    s += Math.min(4, Math.floor(th * 0.8));
    if (matches(CONCEPT_SIGNALS, combined) >= 2) s += 2;
    if (matches(HIGH_LEVERAGE, combined) >= 1) s += 2;
    var wc = wordCount(combined);
    if (wc >= 90 && /\b(because|however|although|learned|realized)\b/i.test(combined)) s += 1;
    if (wc < 25) s -= 2;
    return clamp(s, 0, 10);
  }

  /** Reduce scores for low-effort / low-fit language (heuristic). */
  function applyLowFitAdjustments(combined, scores, fpIn) {
    var t = lc(combined);
    var wc = wordCount(combined);
    var penTotal = 0;
    var penFp = 0;
    if (wc < 35) penTotal += 2;
    if (/\b(i want to build a big brand|change the world|everyone will|passive income forever)\b/i.test(t)) {
      penTotal += 3;
      penFp += 2;
    }
    if (matches(/\b(idk|dunno|whatever|not sure|anything)\b/gi, combined) >= 3) {
      penFp += 3;
      penTotal += 1;
    }
    if (/\b(fantasy|lottery|viral overnight|get famous)\b/i.test(t)) penTotal += 2;
    scores.clarity = clamp(scores.clarity - (wc < 20 ? 2 : 0), 0, 10);
    return {
      clarity: scores.clarity,
      action: clamp(scores.action - penTotal * 0.3, 0, 10),
      urgency: scores.urgency,
      feasibility: clamp(scores.feasibility - penTotal * 0.2, 0, 10),
      alignment: scores.alignment,
      founderPreferenceScore: clamp(fpIn - penFp, 0, 10),
      penaltyTotal: penTotal,
      penaltyFp: penFp
    };
  }

  function priorityTagFromFinal(finalScore) {
    if (finalScore >= 52) return TAG_PRIORITY.TOP;
    if (finalScore >= 44) return TAG_PRIORITY.STRONG;
    if (finalScore >= 32) return TAG_PRIORITY.REVIEW;
    return TAG_PRIORITY.LOW;
  }

  function buildSummaryReason(base, adj, fp, tag) {
    var parts = [];
    if (base.clarity >= 8) parts.push('High clarity');
    else if (base.clarity <= 4) parts.push('Weak clarity');
    if (fp >= 7) parts.push('strong founder fit');
    else if (fp <= 3) parts.push('weak founder fit');
    if (base.urgency >= 8) parts.push('strong urgency');
    if (base.feasibility <= 4) parts.push('feasibility concerns');
    if (tag === TAG_PRIORITY.TOP) parts.unshift('Top-tier priority');
    if (tag === TAG_PRIORITY.LOW) parts.push('needs more specificity');
    var out = parts.filter(Boolean).slice(0, 4).join(', ');
    if (!out) {
      if (tag === TAG_PRIORITY.REVIEW) return 'Acceptable depth; standard review';
      return 'Mixed signals; manual review';
    }
    return out;
  }

  /**
   * Full internal summary for storage / ledger (not shown in UI).
   */
  function buildInternalSummary(entry) {
    var combined = joinFields(entry);
    var c0 = scoreClarity(combined);
    var a0 = scoreAction(combined);
    var u0 = scoreUrgency(combined);
    var f0 = scoreFeasibility(combined);
    var al0 = scoreAlignment(combined);
    var fp0 = scoreFounderPreference(combined);
    var adj = applyLowFitAdjustments(
      combined,
      { clarity: c0, action: a0, urgency: u0, feasibility: f0, alignment: al0 },
      fp0
    );
    var totalScore =
      adj.clarity + adj.action + adj.urgency + adj.feasibility + adj.alignment;
    totalScore = clamp(totalScore, 0, 50);
    var finalPriorityScore = clamp(totalScore + adj.founderPreferenceScore, 0, 60);
    var tag = priorityTagFromFinal(finalPriorityScore);
    var summaryReason = buildSummaryReason(
      { clarity: adj.clarity, action: adj.action, urgency: adj.urgency, feasibility: adj.feasibility, alignment: adj.alignment },
      adj,
      adj.founderPreferenceScore,
      tag
    );
    return {
      clarity: Math.round(adj.clarity * 10) / 10,
      action: Math.round(adj.action * 10) / 10,
      urgency: Math.round(adj.urgency * 10) / 10,
      feasibility: Math.round(adj.feasibility * 10) / 10,
      alignment: Math.round(adj.alignment * 10) / 10,
      totalScore: Math.round(totalScore * 10) / 10,
      founderPreferenceScore: Math.round(adj.founderPreferenceScore * 10) / 10,
      finalPriorityScore: Math.round(finalPriorityScore * 10) / 10,
      tag: tag,
      summaryReason: summaryReason
    };
  }

  function loadLedger() {
    try {
      var raw = global.localStorage.getItem(LEDGER_KEY);
      if (!raw) return { v: 1, entries: [] };
      var o = JSON.parse(raw);
      if (!o || o.v !== 1 || !Array.isArray(o.entries)) return { v: 1, entries: [] };
      return o;
    } catch (e) {
      return { v: 1, entries: [] };
    }
  }

  function saveLedger(ledger) {
    try {
      global.localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger));
    } catch (e) {}
  }

  function appendLedgerRecord(monthKeyStr, entry) {
    var ledger = loadLedger();
    var id = 'ps_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
    ledger.entries.push({
      id: id,
      month: monthKeyStr,
      submittedAt: entry.submittedAt,
      entry: entry
    });
    saveLedger(ledger);
  }

  function ensureInternalSummary(entry) {
    if (entry && entry.internalSummary && entry.internalSummary.finalPriorityScore != null) return entry.internalSummary;
    return buildInternalSummary(entry);
  }

  /**
   * Internal review: sort by finalPriorityScore; surface top 1–3 as topCandidates.
   * @param {string} [filterTag] — optional: TOP CANDIDATE | STRONG FIT | REVIEW | LOW PRIORITY
   */
  function getRankedSubmissions(filterTag) {
    var ledger = loadLedger();
    var rows = (ledger.entries || []).map(function (row) {
      var copy = JSON.parse(JSON.stringify(row));
      copy.entry.internalSummary = ensureInternalSummary(copy.entry);
      return copy;
    });
    if (filterTag) {
      rows = rows.filter(function (r) {
        return r.entry.internalSummary && r.entry.internalSummary.tag === filterTag;
      });
    }
    rows.sort(function (a, b) {
      var fa = (a.entry.internalSummary && a.entry.internalSummary.finalPriorityScore) || 0;
      var fb = (b.entry.internalSummary && b.entry.internalSummary.finalPriorityScore) || 0;
      return fb - fa;
    });
    return {
      topCandidates: rows.slice(0, 3),
      remaining: rows.slice(3),
      allSorted: rows
    };
  }

  /**
   * Returns { topCandidates, remaining, allSorted } after refreshing scores for all ledger rows.
   */
  function refreshLedgerScores() {
    var ledger = loadLedger();
    var i;
    for (i = 0; i < ledger.entries.length; i++) {
      var e = ledger.entries[i].entry;
      e.internalSummary = buildInternalSummary(e);
    }
    saveLedger(ledger);
    return getRankedSubmissions();
  }

  /**
   * Returns { topCandidates, remaining, allSorted } — alias with optional filter.
   */
  function getInternalReviewQueue(filterTag) {
    return getRankedSubmissions(filterTag);
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
    var out = { q1: '', q2: '', q3: '' };
    var r = loadResult();
    var st = loadPersonalizationState();
    try {
      if (r && r.diagnostic) {
        if (r.diagnostic.main_problem) out.q1 = String(r.diagnostic.main_problem).trim();
        if (r.diagnostic.fix_first) out.q2 = String(r.diagnostic.fix_first).trim();
      }
      if (!out.q1 && r && r.type_primary) out.q1 = String(r.type_primary).trim();
    } catch (e) {}
    try {
      if (st && st.outputs) {
        if (!out.q1 && st.outputs.mainIssue) out.q1 = String(st.outputs.mainIssue).trim();
        if (!out.q2 && st.outputs.nextMove) out.q2 = String(st.outputs.nextMove).trim();
      }
      if (st && st.stageReason && !out.q3) out.q3 = String(st.stageReason).trim();
    } catch (e) {}
    return out;
  }

  function syncEarlySlot() {
    var slot = global.document.getElementById('early-private-slot');
    if (!slot) return;
    slot.classList.add('early-private-slot--visible');
    slot.removeAttribute('hidden');
  }

  function tryMount() {
    syncEarlySlot();
  }

  function populateFormFields(form) {
    if (!form) return;
    form.reset();
    var entry = currentMonthEntry();
    var pre = prefillFromSnapshot();
    function setn(name, val) {
      var el = form.querySelector('[name="' + name + '"]');
      if (!el) return;
      el.value = val != null && val !== undefined ? String(val) : '';
    }
    if (entry && entry.submittedAt) {
      var q = entryToQFields(entry);
      setn('q1', q.q1);
      setn('q2', q.q2);
      setn('q3', q.q3);
    } else {
      setn('q1', pre.q1);
      setn('q2', pre.q2);
      setn('q3', pre.q3);
    }
  }

  function openOverlay(opts) {
    opts = opts || {};

    var overlay = global.document.getElementById('ps-overlay');
    if (!overlay) return;

    var locked = global.document.getElementById('ps-view-locked');
    var intro = global.document.getElementById('ps-view-intro');
    var formView = global.document.getElementById('ps-view-form');
    var doneView = global.document.getElementById('ps-view-done');
    var form = global.document.getElementById('ps-form');

    function hideAll() {
      if (locked) locked.hidden = true;
      if (intro) intro.hidden = true;
      if (formView) formView.hidden = true;
      if (doneView) doneView.hidden = true;
    }

    if (!isEarlyMode()) {
      hideAll();
      if (locked) locked.hidden = false;
    } else if (hasSubmittedThisMonth() && opts.update !== true) {
      hideAll();
      if (doneView) doneView.hidden = false;
    } else if (opts.showForm === true) {
      hideAll();
      if (formView) formView.hidden = false;
      if (form) populateFormFields(form);
    } else {
      hideAll();
      if (intro) intro.hidden = false;
      if (formView) formView.hidden = true;
      if (form) populateFormFields(form);
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
    if (!isEarlyMode()) return;

    var form = global.document.getElementById('ps-form');
    if (!form) return;

    var mk = monthKey();
    var fd = new FormData(form);
    var q1 = (fd.get('q1') || '').toString().trim();
    var q2 = (fd.get('q2') || '').toString().trim();
    var q3 = (fd.get('q3') || '').toString().trim();

    if (!q1 || !q2 || !q3) return;

    var snap = gatherDiagnosticSnapshot();
    snap.dynamicKind = null;

    var entry = {
      submittedAt: Date.now(),
      q1: q1,
      q2: q2,
      q3: q3,
      build: q1,
      year: '',
      stuck: q2,
      tried: '',
      why: q3,
      dynamic: '',
      dynamicKind: null,
      diagnosticSnapshot: snap
    };

    entry.internalSummary = buildInternalSummary(entry);

    saveStore({
      v: 1,
      month: mk,
      entry: entry
    });

    appendLedgerRecord(mk, entry);

    var intro = global.document.getElementById('ps-view-intro');
    var formView = global.document.getElementById('ps-view-form');
    var doneView = global.document.getElementById('ps-view-done');
    if (intro) intro.hidden = true;
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
      openOverlay();
    });
  }

  function bindGotoForm() {
    var btn = global.document.getElementById('ps-goto-form');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (!isEarlyMode()) return;
      openOverlay({ showForm: true });
      var q1 = global.document.getElementById('ps-field-q1');
      global.requestAnimationFrame(function () {
        if (q1) q1.focus();
      });
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

  var api = {
    shouldShowFeature: shouldShowFeature,
    tryMount: tryMount,
    syncEarlySlot: syncEarlySlot,
    openOverlay: openOverlay,
    closeOverlay: closeOverlay,
    hasSubmittedThisMonth: hasSubmittedThisMonth,
    internal: {
      TAGS: TAG_PRIORITY,
      buildInternalSummary: buildInternalSummary,
      getRankedSubmissions: getRankedSubmissions,
      getInternalReviewQueue: getInternalReviewQueue,
      refreshLedgerScores: refreshLedgerScores,
      loadLedger: loadLedger
    }
  };
  global.StephuaryPrivateSelection = api;
  global.StephuaryOneFreeSpot = api;
})(typeof window !== 'undefined' ? window : this);
