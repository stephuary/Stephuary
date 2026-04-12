/**
 * CEI node visuals for results + pricing — ties UI to StephuaryPersonalize stage / scores.
 * Does not change scoring; read-only display + copy.
 */
(function (global) {
  var NODE_ORDER = [
    { id: 'behavior', label: 'Behavior' },
    { id: 'environment', label: 'Environment' },
    { id: 'decision', label: 'Decision' },
    { id: 'time', label: 'Time' },
    { id: 'revenue', label: 'Revenue' },
    { id: 'friction', label: 'Friction' }
  ];

  var STAGE_HOT = {
    direction: ['decision', 'attention'],
    revenue: ['revenue', 'time'],
    lock: ['friction', 'decision'],
    concept: ['behavior', 'environment'],
    snapshot: []
  };

  var STAGE_BUCKET_TO_CEI = {
    direction: 'decision',
    revenue: 'revenue',
    lock: 'friction',
    concept: 'behavior',
    snapshot: 'attention'
  };

  function snapshotHotIds(scores) {
    if (!scores || typeof scores !== 'object') return ['decision', 'revenue'];
    var order = ['direction', 'revenue', 'lock', 'concept', 'snapshot'];
    var ranked = order
      .map(function (k) {
        return { k: k, v: typeof scores[k] === 'number' ? scores[k] : 0 };
      })
      .sort(function (a, b) {
        return b.v - a.v;
      });
    var a = STAGE_BUCKET_TO_CEI[ranked[0].k] || 'decision';
    var b = STAGE_BUCKET_TO_CEI[ranked[1].k] || 'time';
    if (a === b) b = ranked[2] ? STAGE_BUCKET_TO_CEI[ranked[2].k] : 'friction';
    return [a, b].filter(function (x, i, arr) {
      return arr.indexOf(x) === i;
    });
  }

  function getHotNodeIds(state) {
    if (!state) return ['decision', 'friction'];
    var st = state.stage || 'direction';
    if (st === 'snapshot') return snapshotHotIds(state.stageScores);
    var ids = STAGE_HOT[st] || ['decision'];
    return ids.slice(0, 2);
  }

  function dominantLiteralLine(state) {
    if (!state) return 'Your strongest pressure point is still clarifying.';
    var st = state.stage || 'direction';
    var strong = state.stageConfidence === 'high' || state.stageConfidence === 'medium';
    if (strong && state.stageReason) {
      var r = String(state.stageReason).trim();
      if (r) {
        if (/your strongest pressure point/i.test(r)) return r;
        if (r.length < 140) {
          var core = r.replace(/\.$/, '');
          return 'Your strongest pressure point is ' + core + '.';
        }
        return r;
      }
    }
    if (st === 'direction') return 'Your strongest pressure point is decision.';
    if (st === 'revenue') return 'Your strongest pressure point is time and revenue falling out of sync.';
    if (st === 'lock') return 'Your strongest pressure point is friction.';
    if (st === 'concept') return 'Your strongest pressure point is build and offer clarity.';
    if (st === 'snapshot') return 'Your strongest pressure point is multiple pressures at once.';
    return 'Your strongest pressure point is where you lose the most leverage.';
  }

  function tierHref(tierId) {
    var g = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : null;
    if (g && g.STEPHUARY_CONFIG && typeof g.STEPHUARY_CONFIG.getTierPurchaseHref === 'function') {
      var u = g.STEPHUARY_CONFIG.getTierPurchaseHref(tierId);
      if (u) return u;
    }
    var m = {
      diagnostic: '/capture',
      rooms: '/playbooks',
      'direction-system': '/direction-system',
      'revenue-system': '/revenue-system',
      'direction-lock': '/focused-review',
      'concept-build': '/private-access',
      snapshot: '/snapshot'
    };
    return m[tierId] || '/pricing';
  }

  function tierPrimaryLabel(tierId) {
    var m = {
      'direction-system': 'Get Direction System',
      'revenue-system': 'Open Revenue System',
      'direction-lock': 'Get Direction Lock',
      'concept-build': 'Start Concept Build',
      snapshot: 'Get Snapshot'
    };
    return m[tierId] || 'View pricing';
  }

  function renderNodeStrip(container, state) {
    if (!container) return;
    var hot = getHotNodeIds(state);
    container.innerHTML = '';
    container.className = (container.className + ' cei-node-strip').trim();
    var pulse = document.createElement('span');
    pulse.className = 'cei-node-strip__pulse';
    pulse.setAttribute('aria-hidden', 'true');
    container.appendChild(pulse);

    NODE_ORDER.forEach(function (n) {
      var el = document.createElement('span');
      el.className = 'cei-node';
      el.setAttribute('data-cei-node', n.id);
      el.textContent = n.label;
      if (hot.indexOf(n.id) >= 0) el.classList.add('cei-node--hot');
      container.appendChild(el);
    });

    var att = document.createElement('span');
    att.className = 'cei-node';
    att.setAttribute('data-cei-node', 'attention');
    att.textContent = 'Attention';
    if (hot.indexOf('attention') >= 0) att.classList.add('cei-node--hot');
    container.appendChild(att);
  }

  function applyResults(root, stateIn) {
    root = root || global.document;
    var SP = global.StephuaryPersonalize;
    var state = stateIn;
    if (!state && SP && typeof SP.refresh === 'function') state = SP.refresh();
    if (!state) return;

    var lineEl = root.getElementById('results-dom-line');
    if (lineEl) lineEl.textContent = dominantLiteralLine(state);

    var strip = root.getElementById('results-cei-strip');
    renderNodeStrip(strip, state);

    var pri = root.getElementById('results-primary-cta');
    var priSub = root.getElementById('results-primary-sub');
    if (pri) {
      pri.href = '/monetize';
      pri.textContent = 'Continue to Monetize →';
    }
    if (priSub) {
      priSub.textContent = '';
    }
    try {
      var strongPulse =
        state.stageConfidence === 'high' || state.stageConfidence === 'medium';
      if (strongPulse) document.dispatchEvent(new CustomEvent('sh-env-pulse', { bubbles: true }));
    } catch (e) {}
  }

  function applyPricing(root, stateIn) {
    root = root || global.document;
    var SP = global.StephuaryPersonalize;
    var state = stateIn;
    if (!state && SP && typeof SP.refresh === 'function') state = SP.refresh();
    if (!state) return;

    var strip = root.getElementById('pricing-cei-strip');
    renderNodeStrip(strip, state);

    var ctx = root.getElementById('pricing-rec-context');
    if (ctx) {
      var strong = state.stageConfidence === 'high' || state.stageConfidence === 'medium';
      ctx.textContent = strong ? 'This is the next step based on what the system picked up.' : '';
      ctx.hidden = !strong;
    }
    try {
      if (state.stageConfidence === 'high' || state.stageConfidence === 'medium') {
        document.dispatchEvent(new CustomEvent('sh-env-pulse', { bubbles: true }));
      }
    } catch (e) {}
  }

  global.StephuaryCeiBridge = {
    getHotNodeIds: getHotNodeIds,
    dominantLiteralLine: dominantLiteralLine,
    tierHref: tierHref,
    tierPrimaryLabel: tierPrimaryLabel,
    renderNodeStrip: renderNodeStrip,
    applyResults: applyResults,
    applyPricing: applyPricing
  };
})(typeof window !== 'undefined' ? window : this);
