/**
 * Stephuary · guided deep-link from Playbooks → first room action (hash / ?start=)
 */
(function (global) {
  var PATH_TO_KEY = {
    '/room-01-extraction': 'r01',
    '/room-02-direction': 'r02',
    '/room-03-transaction': 'r03',
    '/room-04-infrastructure': 'r04',
    '/room-05-cognition': 'r05'
  };

  var DEEP = {
    r01: {
      map: {
        'time-leak': 1,
        'money-leak': 1,
        'drift-audit': 1,
        'underuse-cut': 5
      },
      labels: {
        'time-leak': 'Time leak',
        'money-leak': 'Money leak',
        'drift-audit': 'Drift audit',
        'underuse-cut': 'Underuse cut'
      }
    },
    r02: {
      map: {
        'weekly-reset': 8,
        'restart-loop': 7,
        'overload-cleanup': 4,
        'priority-compression': 3
      },
      labels: {
        'weekly-reset': 'Weekly reset',
        'restart-loop': 'Restart loop',
        'overload-cleanup': 'Overload cleanup',
        'priority-compression': 'Priority compression'
      }
    },
    r03: {
      map: {
        'buyer-problem': 5,
        'offer-line': 2,
        'price-posture': 4,
        'outcome-clarity': 9
      },
      labels: {
        'buyer-problem': 'Buyer problem',
        'offer-line': 'Offer line',
        'price-posture': 'Price posture',
        'outcome-clarity': 'Outcome clarity'
      }
    },
    r04: {
      map: {
        'delivery-fix': 3,
        'handoff': 6,
        'consistency': 4,
        'client-flow': 5
      },
      labels: {
        'delivery-fix': 'Delivery fix',
        'handoff': 'Handoff',
        'consistency': 'Consistency',
        'client-flow': 'Client flow'
      }
    },
    r05: {
      map: {
        'bounded-ai-use': 1,
        'prompt-system': 9,
        'quality-control': 4,
        'leverage-stack': 8
      },
      labels: {
        'bounded-ai-use': 'Bounded AI use',
        'prompt-system': 'Prompt system',
        'quality-control': 'Quality control',
        'leverage-stack': 'Leverage stack'
      }
    }
  };

  function normalizePath(path) {
    if (!path) return '';
    var p = String(path).split('?')[0].split('#')[0];
    if (p.length > 1 && p.charAt(p.length - 1) === '/') p = p.slice(0, -1);
    return p;
  }

  function pathKey(path) {
    var n = normalizePath(path);
    if (PATH_TO_KEY[n]) return PATH_TO_KEY[n];
    var keys = Object.keys(PATH_TO_KEY);
    for (var i = 0; i < keys.length; i++) {
      if (n.slice(-keys[i].length) === keys[i]) return PATH_TO_KEY[keys[i]];
    }
    return null;
  }

  function hashLabel(roomKey, slug) {
    var room = DEEP[roomKey];
    if (!room || !room.labels[slug]) return null;
    return { hash: '#' + slug, label: room.labels[slug], slug: slug, step: room.map[slug] };
  }

  function pickR01(store, archetype, version) {
    var p1 = store && store.phase01;
    var isDelay = p1 && String(p1.time_leak || '').indexOf('hesitation') >= 0;
    var isUnder = p1 && String(p1.money_leak || '').indexOf('Return left on the table') >= 0;
    var isScat = archetype === 'Unconverted Thinker' || version === 'connector_overthinking_scattered';
    var moneyEmph = p1 && String(p1.money_leak || '').indexOf('Revenue risk') >= 0;

    if (isScat) return hashLabel('r01', 'drift-audit');
    if (isUnder) return hashLabel('r01', 'underuse-cut');
    if (isDelay) return hashLabel('r01', 'time-leak');
    if (moneyEmph) return hashLabel('r01', 'money-leak');
    return hashLabel('r01', 'time-leak');
  }

  function pickR02(store, archetype) {
    var p2 = store && store.phase02;
    var p4 = store && store.phase04;
    if (p4 && String(p4.feedback_loop || '').indexOf('stalls') >= 0) {
      return hashLabel('r02', 'restart-loop');
    }
    if (archetype === 'Reactive Stabilizer') {
      return hashLabel('r02', 'overload-cleanup');
    }
    if (p2 && String(p2.buyer_type || '').indexOf('broad') >= 0) {
      return hashLabel('r02', 'priority-compression');
    }
    return hashLabel('r02', 'weekly-reset');
  }

  function pickR03(store) {
    var p2 = store && store.phase02;
    var p3 = store && store.phase03;
    if (p2 && String(p2.buyer_type || '').indexOf('broad') >= 0) {
      return hashLabel('r03', 'buyer-problem');
    }
    if (p3 && String(p3.outcome || '').indexOf('fuzzy') >= 0) {
      return hashLabel('r03', 'outcome-clarity');
    }
    if (p3 && String(p3.pricing_position || '').indexOf('uncomfortable') >= 0) {
      return hashLabel('r03', 'price-posture');
    }
    return hashLabel('r03', 'offer-line');
  }

  function pickR04(store) {
    var p3 = store && store.phase03;
    var p4 = store && store.phase04;
    if (p4 && String(p4.response_type || '').indexOf('Silence') >= 0) {
      return hashLabel('r04', 'client-flow');
    }
    if (p4 && String(p4.validation_status || '') === 'partial') {
      return hashLabel('r04', 'consistency');
    }
    if (p3 && String(p3.entry_point || '').indexOf('No obvious') >= 0) {
      return hashLabel('r04', 'delivery-fix');
    }
    return hashLabel('r04', 'delivery-fix');
  }

  function pickR05(store, archetype) {
    var p4 = store && store.phase04;
    var p5 = store && store.phase05;
    if (archetype === 'Hidden Operator' || archetype === 'Unconverted Thinker') {
      return hashLabel('r05', 'bounded-ai-use');
    }
    if (p4 && String(p4.validation_status || '') === 'partial') {
      return hashLabel('r05', 'quality-control');
    }
    if (p5 && String(p5.leverage_type || '').indexOf('improving') >= 0) {
      return hashLabel('r05', 'prompt-system');
    }
    return hashLabel('r05', 'leverage-stack');
  }

  /**
   * @param {string} path — e.g. /room-01-extraction
   * @param {{ store: object, archetype: string, version: string, diagnostic: object }} ctx
   * @returns {{ hash: string, label: string, slug: string, step: number } | null}
   */
  function resolveFirstAction(path, ctx) {
    if (!ctx || !ctx.hasStoredResult) return null;
    var roomKey = pathKey(path);
    if (!roomKey) return null;

    var store = ctx.store;
    var arch = ctx.archetype || '';
    var ver = ctx.version || 'mixed_general';

    switch (roomKey) {
      case 'r01':
        return pickR01(store, arch, ver);
      case 'r02':
        return pickR02(store, arch);
      case 'r03':
        return pickR03(store);
      case 'r04':
        return pickR04(store);
      case 'r05':
        return pickR05(store, arch);
      default:
        return null;
    }
  }

  function getStepAndSlugForUrl(pathname, hash, startParam) {
    var roomKey = pathKey(pathname);
    if (!roomKey) return null;
    var slug = (hash || '').replace(/^#/, '') || (startParam || '');
    if (!slug) return null;
    var room = DEEP[roomKey];
    if (!room || !room.map.hasOwnProperty(slug)) return null;
    return { step: room.map[slug], slug: slug, roomKey: roomKey };
  }

  global.StephuaryGuidedRoomEntry = {
    resolveFirstAction: resolveFirstAction,
    getStepAndSlugForUrl: getStepAndSlugForUrl,
    normalizePath: normalizePath,
    pathKey: pathKey,
    DEEP: DEEP
  };
})(typeof window !== 'undefined' ? window : this);
