/**
 * Lightweight personalization: merges behavior + stored answers into userState,
 * assigns stage/tier, applies subtle copy and highlights. No UI redesign.
 */
(function (global) {
  var KEY = 'stephuary_user_state_v1';
  var CAPTURE_KEY = 'stephuary_capture_p01_v2';
  var RESULT_KEY = 'stephuary_result_v1';
  var PROGRESS_KEY = 'stephuary_system_progress_v1';
  var PHASE_PATH = ['/capture', '/monetize', '/structure', '/automation', '/sovereignty'];

  var HERO_LINE = {
    direction: 'Start by choosing one direction that actually makes sense.',
    revenue: 'Your next step is turning this into something that pays.',
    lock: 'You do not need more options. You need the right order.',
    concept: 'You already have enough to build something real.',
    snapshot: 'This needs a full review, not another pass on your own.'
  };

  var TIER_META = {
    'direction-system': { stage: 'direction', name: 'Direction System' },
    'revenue-system': { stage: 'revenue', name: 'Revenue System' },
    'direction-lock': { stage: 'lock', name: 'Direction Lock' },
    'concept-build': { stage: 'concept', name: 'Concept Build' },
    snapshot: { stage: 'snapshot', name: 'Snapshot' }
  };

  function normPath(p) {
    if (!p || p === '') return '/';
    var x = String(p).replace(/\/$/, '') || '/';
    return x;
  }

  function defaultState() {
    return {
      v: 1,
      diagnosticStarted: false,
      diagnosticCompleted: false,
      currentPhase: '',
      completedRooms: [],
      stage: 'direction',
      recommendedTier: 'direction-system',
      recommendedTierName: 'Direction System',
      answers: {
        goal: '',
        bottleneck: '',
        directionClarity: '',
        revenueReadiness: '',
        audienceState: '',
        executionIssue: ''
      },
      outputs: {
        timeLoss: '',
        moneyLoss: '',
        mainIssue: '',
        nextMove: ''
      },
      behavior: {
        viewedPricing: false,
        pricingVisits: 0,
        clickedPhases: [],
        clickedCTAs: [],
        timeOnSite: 0,
        scrollDepth: 0,
        onlySometimesClicks: 0,
        sessionStart: Date.now(),
        lastPath: '',
        fastScroll: false,
        lingerPulse: false,
        outputPanelClosed: false
      }
    };
  }

  function lsGet(k) {
    try {
      var r = global.localStorage.getItem(k);
      return r ? JSON.parse(r) : null;
    } catch (e) {
      return null;
    }
  }

  function lsSet(k, o) {
    try {
      global.localStorage.setItem(k, JSON.stringify(o));
    } catch (e) {}
  }

  function load() {
    var base = defaultState();
    var raw = lsGet(KEY);
    if (raw && raw.v === 1) {
      base = Object.assign(defaultState(), raw, {
        answers: Object.assign(defaultState().answers, raw.answers || {}),
        outputs: Object.assign(defaultState().outputs, raw.outputs || {}),
        behavior: Object.assign(defaultState().behavior, raw.behavior || {})
      });
    }
    return base;
  }

  function save(state) {
    lsSet(KEY, state);
  }

  function mergeFromStorage(base) {
    var state = base || load();
    try {
      state.diagnosticStarted = global.localStorage.getItem('diagnosticStarted') === 'true';
      state.diagnosticCompleted = global.localStorage.getItem('diagnosticCompleted') === 'true';

      var pr = lsGet(PROGRESS_KEY);
      if (pr) {
        if (typeof pr.phase === 'number' && pr.phase >= 1 && pr.phase <= 5) {
          state.currentPhase = PHASE_PATH[pr.phase - 1] || '';
        }
        if (Array.isArray(pr.completed)) state.completedRooms = pr.completed.slice();
      }

      var res = lsGet(RESULT_KEY);
      if (res) {
        var d = res.diagnostic || {};
        state.outputs.mainIssue = d.main_problem || res.type_primary || state.outputs.mainIssue;
        state.outputs.nextMove = d.fix_first || state.outputs.nextMove;
        state.outputs.timeLoss = d.what_it_costs || state.outputs.timeLoss;
        if (res.type_primary) state.answers.bottleneck = String(res.type_primary);
      }

      try {
        state.behavior.outputPanelClosed = global.localStorage.getItem('outputPanelClosed') === '1';
      } catch (e2) {}

      var cap = lsGet(CAPTURE_KEY);
      if (cap && cap.bits) {
        var filled = cap.bits.filter(function (b) {
          return b !== null && b !== undefined;
        }).length;
        if (filled > 0 && !state.answers.goal) state.answers.goal = 'in_progress_capture';
      }
    } catch (e) {}
    return state;
  }

  var state = mergeFromStorage(load());

  function hasStrongSignal(s) {
    if (!s) return false;
    return (
      s.diagnosticStarted ||
      s.diagnosticCompleted ||
      (s.behavior && s.behavior.pricingVisits > 0) ||
      ((s.behavior && s.behavior.clickedPhases && s.behavior.clickedPhases.length) || 0) > 0
    );
  }

  function uniqPush(arr, item, max) {
    if (!item || arr.indexOf(item) >= 0) return;
    arr.push(item);
    while (arr.length > (max || 12)) arr.shift();
  }

  function computeStage(state) {
    var b = state.behavior;
    var stage = 'direction';
    var tier = 'direction-system';
    var tierName = 'Direction System';

    var phaseClicks = (b.clickedPhases || []).length;
    var pricingHits = b.pricingVisits || 0;
    var completed = state.diagnosticCompleted;
    var cur = state.currentPhase || '';

    if (pricingHits >= 2 || (pricingHits >= 1 && b.timeOnSite > 120000 && b.viewedPricing)) {
      stage = 'snapshot';
      tier = 'snapshot';
      tierName = 'Snapshot';
    } else if (
      phaseClicks >= 4 &&
      (!completed || ['/capture', '/monetize', '/systems'].indexOf(cur) >= 0)
    ) {
      stage = 'lock';
      tier = 'direction-lock';
      tierName = 'Direction Lock';
    } else if (completed && (cur === '/capture' || cur === '/monetize' || cur === '')) {
      stage = 'revenue';
      tier = 'revenue-system';
      tierName = 'Revenue System';
    } else if (
      cur === '/structure' ||
      cur === '/automation' ||
      (state.completedRooms && state.completedRooms.length >= 2) ||
      (state.answers.bottleneck && /structure|offer|concept/i.test(state.answers.bottleneck + ''))
    ) {
      stage = 'concept';
      tier = 'concept-build';
      tierName = 'Concept Build';
    }

    state.stage = stage;
    state.recommendedTier = tier;
    state.recommendedTierName = tierName;
  }

  var pathVisitCounted = false;

  function trackPath(state) {
    var p = normPath(global.location.pathname);
    state.behavior.lastPath = p;
    if (p === '/pricing' && !pathVisitCounted) {
      pathVisitCounted = true;
      state.behavior.viewedPricing = true;
      state.behavior.pricingVisits = (state.behavior.pricingVisits || 0) + 1;
    }
  }

  function tickTime() {
    reloadState();
    state.behavior.timeOnSite = (state.behavior.timeOnSite || 0) + 10;
    computeStage(state);
    save(state);
  }

  function updateScrollDepth() {
    reloadState();
    var el = global.document.documentElement;
    var sh = el.scrollHeight - global.innerHeight;
    if (sh <= 0) return;
    var d = (global.scrollY || 0) / sh;
    if (d > (state.behavior.scrollDepth || 0)) {
      state.behavior.scrollDepth = Math.min(1, d);
    }
  }

  function refresh() {
    state = mergeFromStorage(load());
    trackPath(state);
    computeStage(state);
    save(state);
    return state;
  }

  function reloadState() {
    state = mergeFromStorage(load());
    return state;
  }

  function applyHomeHero() {
    if (normPath(global.location.pathname) !== '/') return;
    refresh();
    var line = global.document.getElementById('hero-personal-line');
    var hint = global.document.getElementById('hero-tier-hint');
    var sec = global.document.getElementById('hero-cta-secondary');
    var micro = global.document.getElementById('hero-cta-micro');
    if (line) {
      line.textContent = HERO_LINE[state.stage] || '';
      line.hidden = !line.textContent;
    }
    if (hint) {
      if (state.recommendedTierName && hasStrongSignal(state)) {
        hint.textContent = 'Best next step: ' + state.recommendedTierName;
        hint.hidden = false;
      } else {
        hint.textContent = '';
        hint.hidden = true;
      }
    }
    var osc = state.behavior.onlySometimesClicks || 0;
    if (osc > 2) {
      var disc = global.document.querySelector('.home-os-discover');
      if (disc) disc.classList.add('home-os-discover--emphasize');
    }

    if (state.behavior.lingerPulse) {
      var pl = global.document.getElementById('hero-personal-line');
      if (pl) pl.classList.add('hero-personal-line--linger');
    }
  }

  function applyPricingPage() {
    if (normPath(global.location.pathname) !== '/pricing') return;
    refresh();
    var rec = state.recommendedTier;
    var groups = global.document.querySelectorAll('.price-group');
    var foundDetails = null;

    global.document.querySelectorAll('[data-tier-id].inner-tier--recommended').forEach(function (el) {
      el.classList.remove('inner-tier--recommended');
    });
    global.document.querySelectorAll('.pricing-rec-badge').forEach(function (el) {
      el.remove();
    });
    global.document.querySelectorAll('.price-group--osc-emphasis').forEach(function (el) {
      el.classList.remove('price-group--osc-emphasis');
    });

    var sub = global.document.getElementById('pricing-hero-personal');
    if (sub) {
      sub.textContent = '';
      sub.hidden = true;
    }

    if (!hasStrongSignal(state)) {
      return;
    }

    groups.forEach(function (details) {
      var pad = details.querySelector('.price-group__pad');
      if (!pad) return;
      var tierEl = pad.querySelector('.inner-tier[data-tier-id="' + rec + '"]');
      if (tierEl) {
        tierEl.classList.add('inner-tier--recommended');
        var badge = global.document.createElement('span');
        badge.className = 'pricing-rec-badge';
        badge.textContent =
          state.behavior.pricingVisits > 1 ? 'Recommended for you — still the best fit' : 'Recommended for you';
        tierEl.insertBefore(badge, tierEl.firstChild);
        pad.insertBefore(tierEl, pad.firstChild);
        foundDetails = details;
      }
    });

    if (foundDetails && state.behavior.pricingVisits >= 1) {
      try {
        foundDetails.open = true;
      } catch (e) {}
    }

    if (sub) {
      sub.textContent =
        'Based on where you are: consider ' + state.recommendedTierName + ' when you are ready to pay for clarity.';
      sub.hidden = false;
    }

    var osc = state.behavior.onlySometimesClicks || 0;
    if (osc > 2 && groups.length) {
      groups[groups.length - 1].classList.add('price-group--osc-emphasis');
    }
  }

  function applySystemMap() {
    if (normPath(global.location.pathname) !== '/systems') return;
    refresh();
    var curPath = state.currentPhase || '';
    var pr = lsGet(PROGRESS_KEY);
    if (PHASE_PATH.indexOf(curPath) < 0) {
      curPath =
        pr && typeof pr.phase === 'number' && pr.phase >= 1 && pr.phase <= 5
          ? PHASE_PATH[pr.phase - 1] || ''
          : '';
    }
    var curIdx = PHASE_PATH.indexOf(curPath);
    if (curIdx < 0) return;

    global.document.querySelectorAll('.sh-system-map a.sh-map-node[href]').forEach(function (a) {
      var h = normPath(a.getAttribute('href') || '');
      var idx = PHASE_PATH.indexOf(h);
      a.classList.remove('sh-map-node--visited', 'sh-map-node--current');
      if (idx < 0) return;
      if (idx === curIdx) a.classList.add('sh-map-node--current');
      else if (idx < curIdx) a.classList.add('sh-map-node--visited');
    });
  }

  function applyLivePanel(root) {
    if (!root) return;
    refresh();
    var recEl = root.querySelector('#sh-live-rec');
    if (!recEl) {
      recEl = global.document.createElement('p');
      recEl.id = 'sh-live-rec';
      recEl.className = 'sh-live-panel__rec';
      recEl.setAttribute('hidden', '');
      var top = root.querySelector('.sh-live-panel__top');
      if (top) top.appendChild(recEl);
    }
    var line =
      state.recommendedTierName && hasStrongSignal(state)
        ? 'Recommended next step: ' + state.recommendedTierName
        : '';
    if (line) {
      recEl.textContent = line;
      recEl.hidden = false;
    } else {
      recEl.textContent = '';
      recEl.hidden = true;
    }
  }

  function trimStr(s, n) {
    if (!s) return '';
    s = String(s).replace(/\s+/g, ' ').trim();
    if (s.length <= n) return s;
    return s.slice(0, n - 1).trim() + '…';
  }

  function afterLivePanelTick(els) {
    refresh();
    var o = state.outputs;
    var hasDiag = state.diagnosticCompleted;
    var hasText = !!(o.mainIssue || o.nextMove || o.timeLoss);
    if (!hasDiag && !hasText) return;

    if (o.mainIssue) {
      els.elCat.textContent = trimStr(o.mainIssue, 130);
      var dt = els.elCat.previousElementSibling;
      if (dt && dt.tagName === 'DT') dt.textContent = 'Main issue';
    }
    if (o.nextMove) els.elAction.textContent = trimStr(o.nextMove, 180);
    if (o.timeLoss) els.elTime.textContent = trimStr(o.timeLoss, 85);

    applyLivePanel(global.document.getElementById('sh-live-panel'));
  }

  function tryLivePanel() {
    var root = global.document.getElementById('sh-live-panel');
    if (root) applyLivePanel(root);
    else global.setTimeout(tryLivePanel, 120);
  }

  function initTracking() {
    var lastY = global.scrollY || 0;
    var lastT = Date.now();
    global.window.addEventListener(
      'scroll',
      function () {
        updateScrollDepth();
        var now = Date.now();
        var dy = Math.abs(global.scrollY - lastY);
        var dt = Math.max(1, now - lastT);
        var v = dy / dt;
        if (v > 2.2 && dy > 80) {
          reloadState();
          state.behavior.fastScroll = true;
          global.document.body.classList.add('sh-behavior--fast');
          global.window.setTimeout(function () {
            global.document.body.classList.remove('sh-behavior--fast');
          }, 2200);
          save(state);
        }
        lastY = global.scrollY;
        lastT = now;
      },
      { passive: true }
    );

    global.document.addEventListener(
      'click',
      function (e) {
        var a = e.target.closest && e.target.closest('a[href]');
        if (!a) return;
        reloadState();
        var href = a.getAttribute('href') || '';
        if (
          href.indexOf('/capture') === 0 ||
          href.indexOf('/monetize') === 0 ||
          href.indexOf('/structure') === 0 ||
          href.indexOf('/automation') === 0 ||
          href.indexOf('/sovereignty') === 0 ||
          href.indexOf('/systems') === 0
        ) {
          uniqPush(state.behavior.clickedPhases, href.split('?')[0]);
        }
        if (href.indexOf('/pricing') === 0 || href === '/pricing') {
          state.behavior.viewedPricing = true;
        }
        if (href.indexOf('onlysometimesclub.com') >= 0) {
          state.behavior.onlySometimesClicks = (state.behavior.onlySometimesClicks || 0) + 1;
        }
        if (a.classList.contains('btn') || a.classList.contains('tier-cta') || a.classList.contains('nav-link')) {
          uniqPush(state.behavior.clickedCTAs, href.slice(0, 48), 20);
        }
        computeStage(state);
        save(state);
      },
      true
    );

    global.setInterval(function () {
      tickTime();
    }, 10000);

    global.window.addEventListener('beforeunload', function () {
      save(state);
    });

    global.window.setTimeout(function () {
      reloadState();
      if (state.behavior.timeOnSite > 45 && !state.behavior.lingerPulse) {
        state.behavior.lingerPulse = true;
        var p = global.document.getElementById('hero-cta-primary');
        if (p) p.classList.add('hero-cta--soft-emphasis');
        save(state);
      }
    }, 14000);
  }

  function clearDiagnosticSlice() {
    state = mergeFromStorage(load());
    state.answers = defaultState().answers;
    state.outputs = defaultState().outputs;
    computeStage(state);
    save(state);
  }

  function boot() {
    state = refresh();
    initTracking();
    applyHomeHero();
    applyPricingPage();
    applySystemMap();
    tryLivePanel();
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', function () {
      global.setTimeout(boot, 0);
    });
  } else {
    global.setTimeout(boot, 0);
  }

  global.StephuaryPersonalize = {
    load: load,
    save: save,
    refresh: refresh,
    getState: function () {
      return state;
    },
    applyLivePanel: applyLivePanel,
    applyHomeHero: applyHomeHero,
    afterLivePanelTick: afterLivePanelTick,
    clearDiagnosticSlice: clearDiagnosticSlice,
    reloadState: reloadState
  };
})(typeof window !== 'undefined' ? window : this);
