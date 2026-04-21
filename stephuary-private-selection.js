/**
 * Homepage monthly drawing — email capture for one free 1:1 concept + niche session (FormSubmit / config).
 */
(function (global) {
  var STORAGE_KEY = 'stephuary_monthly_free_session_v1';
  var STORAGE_LEGACY_V2 = 'stephuary_private_selection_v2';
  var STORAGE_LEGACY_V1 = 'stephuary_private_selection_v1';

  function monthKey() {
    var d = new Date();
    var m = d.getMonth() + 1;
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m;
  }

  function shouldShowFeature() {
    return true;
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
    if (e.email && e.building != null && e.come_for != null && e.offer_first != null) {
      return [e.name, e.email, e.building, e.come_for, e.offer_first]
        .map(function (x) {
          return x != null ? String(x).trim() : '';
        })
        .filter(Boolean)
        .join(' \n ');
    }
    if (e.email && (e.q1 != null || e.q2 != null || e.q3 != null)) {
      return [e.name, e.email, e.q1, e.q2, e.q3]
        .map(function (x) {
          return x != null ? String(x).trim() : '';
        })
        .filter(Boolean)
        .join(' \n ');
    }
    if (e.email && (e.building != null || e.stuck != null) && !(e.q1 || e.q2 || e.q3) && e.come_for == null && e.offer_first == null) {
      return [e.email, e.building, e.stuck]
        .map(function (x) {
          return x != null ? String(x).trim() : '';
        })
        .filter(Boolean)
        .join(' \n ');
    }
    if (e.email && !(e.q1 || e.q2 || e.q3)) return String(e.email);
    if (e.q1 != null || e.q2 != null || e.q3 != null) {
      return [e.q1, e.q2, e.q3].filter(Boolean).join(' \n ');
    }
    return [e.build, e.year, e.stuck, e.tried, e.why, e.dynamic].filter(Boolean).join(' \n ');
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

  function updateHomeMfsState() {
    var wrap = global.document.getElementById('home-mfs-form-wrap');
    var done = global.document.getElementById('home-mfs-done');
    if (!wrap || !done) return;
    if (hasSubmittedThisMonth()) {
      wrap.hidden = true;
      done.hidden = false;
    } else {
      wrap.hidden = false;
      done.hidden = true;
    }
  }

  function syncHomeMfsStrip() {
    updateHomeMfsState();
  }

  function tryMount() {
    syncHomeMfsStrip();
  }

  function getMonthlyFormAction() {
    try {
      var c = global.STEPHUARY_CONFIG || {};
      return c.MONTHLY_FREE_SESSION_FORM_ACTION || null;
    } catch (e) {
      return null;
    }
  }

  function formsubmitAjaxUrl(base) {
    if (!base || typeof base !== 'string') return null;
    if (base.indexOf('formsubmit.co') === -1) return base;
    if (base.indexOf('/ajax/') !== -1) return base;
    return base.replace(/^https:\/\/formsubmit\.co\//i, 'https://formsubmit.co/ajax/');
  }

  function setFormError(msg) {
    var err = global.document.getElementById('home-mfs-form-error');
    if (!err) return;
    if (msg) {
      err.textContent = msg;
      err.hidden = false;
    } else {
      err.textContent = '';
      err.hidden = true;
    }
  }

  function postMonthlyEmail(email, name, building, comeFor, offerFirst) {
    var action = getMonthlyFormAction();
    if (!action) {
      return Promise.resolve({ ok: true, skipped: true });
    }
    var url = formsubmitAjaxUrl(action);
    var payload = {
      email: email,
      name: name,
      building: building,
      come_for: comeFor,
      offer_first: offerFirst,
      _subject: 'Monthly free 1:1 — homepage application',
      _captcha: false,
      month_pool: monthKey()
    };
    try {
      var r = loadResult();
      if (r && r.type_primary) payload.diagnostic_hint = String(r.type_primary).slice(0, 200);
    } catch (e2) {}

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) return { ok: false, status: res.status };
      return res
        .json()
        .then(function () {
          return { ok: true };
        })
        .catch(function () {
          return { ok: true };
        });
    });
  }

  function openOverlay() {
    var el = global.document.getElementById('home-mfs');
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) {
      el.scrollIntoView(true);
    }
    var input = global.document.getElementById('home-mfs-name') || global.document.getElementById('home-mfs-email');
    global.requestAnimationFrame(function () {
      if (input && !hasSubmittedThisMonth()) input.focus();
    });
  }

  function closeOverlay() {}

  function submitForm(ev) {
    ev.preventDefault();

    var form = ev.currentTarget;
    if (!form || form.id !== 'home-mfs-form') return;

    var nameEl = form.querySelector('[name="name"]');
    var emailEl = form.querySelector('[name="email"]');
    var buildingEl = form.querySelector('[name="building"]');
    var comeEl = form.querySelector('[name="come_for"]');
    var offerEl = form.querySelector('[name="offer_first"]');
    var name = nameEl ? String(nameEl.value || '').trim() : '';
    var email = emailEl ? String(emailEl.value || '').trim() : '';
    var building = buildingEl ? String(buildingEl.value || '').trim() : '';
    var comeFor = comeEl ? String(comeEl.value || '').trim() : '';
    var offerFirst = offerEl ? String(offerEl.value || '').trim() : '';
    setFormError('');

    if (!name) {
      setFormError('Add your name.');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Enter a valid email address.');
      return;
    }
    if (!building) {
      setFormError('Add what you are building.');
      return;
    }
    if (!comeFor) {
      setFormError('Add what people come to you for.');
      return;
    }
    if (!offerFirst) {
      setFormError('Add the offer you would shape first.');
      return;
    }

    var btn = global.document.getElementById('home-mfs-submit');
    var prevLabel = btn && btn.textContent ? btn.textContent : 'Apply';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Submitting…';
    }

    var mk = monthKey();
    var snap = gatherDiagnosticSnapshot();
    try {
      snap.dynamicKind = null;
    } catch (e) {}

    postMonthlyEmail(email, name, building, comeFor, offerFirst)
      .then(function (result) {
        if (!result || !result.ok) {
          setFormError('Could not submit. Check your connection and try again.');
          return;
        }

        var entry = {
          submittedAt: Date.now(),
          name: name,
          email: email,
          building: building,
          come_for: comeFor,
          offer_first: offerFirst,
          diagnosticSnapshot: snap
        };
        entry.internalSummary = buildInternalSummary(entry);

        saveStore({
          v: 1,
          month: mk,
          entry: entry
        });

        appendLedgerRecord(mk, entry);

        tryMount();
      })
      .catch(function () {
        setFormError('Could not submit. Try again in a moment.');
      })
      .then(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = prevLabel;
        }
      });
  }

  function bindHomeMfsForm() {
    var form = global.document.getElementById('home-mfs-form');
    if (!form) return;
    form.addEventListener('submit', submitForm);
  }

  function init() {
    bindHomeMfsForm();
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
    syncEarlySlot: syncHomeMfsStrip,
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
