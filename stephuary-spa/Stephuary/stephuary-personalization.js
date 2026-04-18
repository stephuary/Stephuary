/**
 * Lightweight personalization: merges behavior + stored answers into userState,
 * assigns stage/tier via scored rules + normalization. No UI redesign.
 */
(function (global) {
  var KEY = 'stephuary_user_state_v1';
  var RESULT_KEY = 'stephuary_result_v1';
  var PROGRESS_KEY = 'stephuary_system_progress_v1';
  var DIAGNOSTIC_ANSWERS_KEY = 'stephuary_diagnostic_answers_v1';
  var ROOM01_HANDOFF_KEY = 'stephuary_room01_handoff';
  var ROOM02_HANDOFF_KEY = 'stephuary_room02_handoff';
  var PHASE_PATH = ['/capture', '/monetize', '/structure', '/automation', '/sovereignty'];

  /** Min score gap to call confidence "high" (tuned for typical weight ranges). */
  var CONF_HIGH_GAP = 4.5;
  var CONF_MED_GAP = 1.8;

  /** Behavior: looping without completion (phase clicks vs diagnostic). */
  var LOCK_PHASE_CLICKS_MIN = 3;
  var LOOP_PRICING_VISITS = 2;
  var LONG_SESSION_MS = 120000;

  /** Snapshot: multiple rooms + repeat pricing. */
  var SNAPSHOT_ROOMS_DONE = 2;
  var SNAPSHOT_PRICING_VISITS = 2;

  var HERO_LINE = {
    direction: 'Start by choosing one direction that makes sense.',
    revenue: 'The next step is turning this into something that pays.',
    lock: 'The issue is not more options. It is order.',
    concept: 'You already have enough to build something real.',
    snapshot: 'This needs a full review.'
  };

  var PANEL_REC_LINE = {
    direction: 'Recommended next step: Direction System',
    revenue: 'Recommended next step: Revenue System',
    lock: 'Recommended next step: Direction Lock',
    concept: 'Recommended next step: Concept Build',
    snapshot: 'Recommended next step: Snapshot'
  };

  var TIER_BY_STAGE = {
    direction: { id: 'direction-system', name: 'Direction System' },
    revenue: { id: 'revenue-system', name: 'Revenue System' },
    lock: { id: 'direction-lock', name: 'Direction Lock' },
    concept: { id: 'concept-build', name: 'Concept Build' },
    snapshot: { id: 'snapshot', name: 'Snapshot' }
  };

  var STAGE_ORDER_TIEBREAK = ['snapshot', 'concept', 'lock', 'revenue', 'direction'];

  var LITERAL_STAGE_REASON = {
    direction: 'No clear direction yet',
    revenue: 'Direction exists but no revenue path',
    lock: 'Too many moving parts without order',
    concept: 'Enough inputs to build something real',
    snapshot: 'Multiple issues require full review'
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
      stageReason: '',
      stageConfidence: 'low',
      stageScores: { direction: 0, revenue: 0, lock: 0, concept: 0, snapshot: 0 },
      answers: {
        goal: '',
        bottleneck: '',
        directionClarity: '',
        revenueReadiness: '',
        audienceState: '',
        executionIssue: ''
      },
      tags: {
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
        nextMove: '',
        mainIssueTag: '',
        nextMoveTag: '',
        timeLossTier: '',
        moneyLossTier: ''
      },
      behavior: {
        viewedPricing: false,
        pricingVisits: 0,
        clickedPhases: [],
        clickedCTAs: [],
        advisoryClicks: 0,
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

  function lsGetCaptureState() {
    var v = lsGet('stephuary_capture_p01_v3');
    if (v) return v;
    return lsGet('stephuary_capture_p01_v2');
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
        tags: Object.assign(defaultState().tags, raw.tags || {}),
        outputs: Object.assign(defaultState().outputs, raw.outputs || {}),
        behavior: Object.assign(defaultState().behavior, raw.behavior || {}),
        stageScores: Object.assign(defaultState().stageScores, raw.stageScores || {})
      });
    }
    return base;
  }

  function save(state) {
    lsSet(KEY, state);
  }

  function pickMaxVote(votes) {
    var best = '';
    var max = -1;
    var k;
    for (k in votes) {
      if (votes[k] > max) {
        max = votes[k];
        best = k;
      }
    }
    return max > 0 ? best : '';
  }

  /**
   * Maps capture diagnostic bit vector (6 binary choices) to canonical answer tags.
   * Indices match capture.html QUESTIONS: signal, action, expression, environment, failure, true block.
   */
  function mapBitsToAnswers(bits) {
    if (!bits || bits.length < 6) return null;
    var b = bits;
    var i;
    for (i = 0; i < 6; i++) {
      if (b[i] !== 0 && b[i] !== 1) return null;
    }

    var g = { make_money: 0, get_clear: 0, build_offer: 0, get_clients: 0, build_system: 0, fix_execution: 0 };
    if (b[0] === 1) g.build_offer += 2;
    if (b[0] === 1) g.build_system += 2;
    if (b[2] === 1) g.build_system += 1;
    if (b[4] === 1) g.build_offer += 2;
    if (b[5] === 1) g.get_clear += 4;
    if (b[5] === 0) g.fix_execution += 2;
    if (b[1] === 0) g.fix_execution += 3;
    if (b[2] === 1) g.get_clients += 2;
    if (b[1] === 1) g.make_money += 2;

    var bn = {
      too_many_ideas: 0,
      no_offer: 0,
      no_money_path: 0,
      scattered_focus: 0,
      wrong_order: 0,
      weak_positioning: 0,
      execution_breakdown: 0,
      needs_full_review: 0
    };
    if (b[5] === 1) {
      bn.too_many_ideas += 3;
      bn.scattered_focus += 2;
    }
    if (b[5] === 0) {
      bn.execution_breakdown += 2;
      bn.no_offer += 2;
    }
    if (b[0] === 1) bn.scattered_focus += 2;
    if (b[3] === 0) bn.weak_positioning += 4;
    if (b[4] === 0) bn.wrong_order += 2;
    if (b[1] === 0) bn.execution_breakdown += 3;
    if (b[4] === 1 && b[1] === 1) bn.no_money_path += 2;

    var directionClarity = 'medium';
    if (b[5] === 1) directionClarity = 'low';
    if (b[5] === 1 && b[0] === 1) directionClarity = 'low';

    var revenueReadiness = 'low';
    if (b[4] === 0 && b[5] === 0) revenueReadiness = 'none';
    if (b[4] === 1 && b[1] === 1) revenueReadiness = 'medium';

    var audienceState = 'unclear';
    if (b[0] === 1) audienceState = 'some';
    if (b[3] === 1) audienceState = 'defined';

    var executionIssue = 'none';
    if (b[1] === 0) executionIssue = 'starting';
    else if (b[1] === 1) executionIssue = 'shipping';

    return {
      goal: pickMaxVote(g) || 'get_clear',
      bottleneck: pickMaxVote(bn) || 'scattered_focus',
      directionClarity: directionClarity,
      revenueReadiness: revenueReadiness,
      audienceState: audienceState,
      executionIssue: executionIssue,
      source: 'capture_bits'
    };
  }

  function tagStageFromMainIssue(text) {
    var t = lc(text);
    if (!t) return '';
    if (/too many|unclear|don't know|do not know|not know|awareness is ahead|committed line|options stay|searching/.test(t)) {
      return 'direction';
    }
    if (/not making money|no clients|no money|monetiz|revenue|paid work|buyer/.test(t)) return 'revenue';
    if (/doing everything|scattered|jumping|fragment|everything at once/.test(t)) return 'lock';
    if (/ideas but not structured|not formed|one page|packaging|offer description/.test(t)) return 'concept';
    if (/multiple problems|not working overall|full rebuild|several/.test(t)) return 'snapshot';
    return '';
  }

  function tagStageFromNextMove(text) {
    var t = lc(text);
    if (!t) return '';
    if (/choose one direction|one direction|one thread|one decision|lane|refuse new inputs/.test(t)) return 'direction';
    if (/monetiz|offer|price|revenue|buyer|money path|charge/.test(t)) return 'revenue';
    if (/cut|remove|stop|narrow|order|before you add|measurable drain/.test(t)) return 'lock';
    if (/build|ship|package|page|send|outline|brief/.test(t)) return 'concept';
    if (/review|full|snapshot|everything|diagnostic/.test(t)) return 'snapshot';
    return '';
  }

  function tierFromMoneyMonthly(n) {
    if (!(typeof n === 'number') || isNaN(n)) return '';
    if (n > 800) return 'high';
    if (n > 150) return 'medium';
    return 'low';
  }

  function tierFromWeeklyHours(h) {
    if (!(typeof h === 'number') || isNaN(h)) return '';
    if (h > 25) return 'high';
    if (h > 10) return 'medium';
    return 'low';
  }

  function mergeRoomOutputs(state) {
    var h1 = lsGet(ROOM01_HANDOFF_KEY);
    if (h1 && h1.version === 1) {
      if (typeof h1.monthlyLeak === 'number') {
        state.outputs.moneyLossTier = tierFromMoneyMonthly(h1.monthlyLeak);
      }
      if (typeof h1.weeklyScreenHours === 'number') {
        state.outputs.timeLossTier = tierFromWeeklyHours(h1.weeklyScreenHours);
      }
    }
    var h2 = lsGet(ROOM02_HANDOFF_KEY);
    if (h2 && h2.version === 1) {
      if (!state.outputs.nextMove && h2.weeklyAction) state.outputs.nextMove = String(h2.weeklyAction);
    }
  }

  function persistDiagnosticFromBits(bits) {
    var ans = mapBitsToAnswers(bits);
    if (!ans) return;
    try {
      lsSet(DIAGNOSTIC_ANSWERS_KEY, { v: 1, answers: ans, ts: Date.now() });
      var st = load();
      st.answers = Object.assign(defaultState().answers, ans);
      save(st);
    } catch (e) {}
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

      var da = lsGet(DIAGNOSTIC_ANSWERS_KEY);
      if (da && da.v === 1 && da.answers) {
        state.answers = Object.assign(defaultState().answers, da.answers);
      }

      var cap = lsGetCaptureState();
      if ((!state.answers || !state.answers.source) && cap && cap.bits) {
        var capBits = cap.bits;
        if (Array.isArray(capBits) && capBits.length === 10) {
          capBits = [capBits[0], capBits[1], capBits[6], capBits[8], capBits[5], capBits[9]];
        }
        var filled = 0;
        var bi;
        for (bi = 0; bi < capBits.length; bi++) {
          if (capBits[bi] === 0 || capBits[bi] === 1) filled++;
        }
        if (filled >= 6) {
          var derived = mapBitsToAnswers(capBits);
          if (derived) state.answers = Object.assign(defaultState().answers, derived);
        } else if (filled > 0 && !state.answers.goal) {
          state.answers.goal = 'in_progress_capture';
        }
      }

      var res = lsGet(RESULT_KEY);
      if (res) {
        var d = res.diagnostic || {};
        state.outputs.mainIssue = d.main_problem || state.outputs.mainIssue;
        state.outputs.nextMove = d.fix_first || state.outputs.nextMove;
        state.outputs.timeLoss = d.what_it_costs || state.outputs.timeLoss;
        if (res.type_primary && !state.answers.source) {
          state.answers.bottleneck = String(res.type_primary);
        }
      }

      mergeRoomOutputs(state);

      state.outputs.mainIssueTag = tagStageFromMainIssue(state.outputs.mainIssue);
      state.outputs.nextMoveTag = tagStageFromNextMove(state.outputs.nextMove);

      try {
        state.behavior.outputPanelClosed = global.localStorage.getItem('outputPanelClosed') === '1';
      } catch (e2) {}
    } catch (e) {}
    return state;
  }

  function lc(s) {
    return (s || '').toString().toLowerCase();
  }

  function firstTag(s, table) {
    var t = lc(s);
    for (var i = 0; i < table.length; i++) {
      if (t.indexOf(table[i].k) >= 0) return table[i].tag;
    }
    return '';
  }

  /** Map free-text / legacy values to internal goal tag. */
  function normalizeGoalTag(raw) {
    var t = firstTag(raw, [
      { k: 'make money', tag: 'make_money' },
      { k: 'revenue', tag: 'make_money' },
      { k: 'income', tag: 'make_money' },
      { k: 'paid', tag: 'make_money' },
      { k: 'client', tag: 'get_clients' },
      { k: 'customer', tag: 'get_clients' },
      { k: 'offer', tag: 'build_offer' },
      { k: 'position', tag: 'build_offer' },
      { k: 'system', tag: 'build_system' },
      { k: 'clear', tag: 'get_clear' },
      { k: 'clarity', tag: 'get_clear' },
      { k: 'execute', tag: 'fix_execution' },
      { k: 'ship', tag: 'fix_execution' },
      { k: 'finish', tag: 'fix_execution' }
    ]);
    if (t) return t;
    if (lc(raw) === 'in_progress_capture') return '';
    return '';
  }

  /** Map archetype name or prose to bottleneck tag. */
  function normalizeBottleneckFromArchetype(name) {
    var n = lc(name);
    if (!n) return '';
    if (n.indexOf('unconverted thinker') >= 0 || n.indexOf('systems first') >= 0 || n.indexOf('system rebuilder') >= 0 || n.indexOf('rebuilder') >= 0 || n.indexOf('connector') >= 0) {
      return 'too_many_ideas';
    }
    if (n.indexOf('delayed builder') >= 0 || n.indexOf('read ahead') >= 0 || n.indexOf('aware but idle') >= 0) return 'no_offer';
    if (n.indexOf('miscast strategist') >= 0 || n.indexOf('context misfit') >= 0 || n.indexOf('wrong environment') >= 0) {
      return 'weak_positioning';
    }
    if (n.indexOf('signal stabilizer') >= 0 || n.indexOf('pattern suppressor') >= 0) return 'scattered_focus';
    if (n.indexOf('hidden operator') >= 0 || n.indexOf('intent reader') >= 0 || n.indexOf('unspoken') >= 0) return 'execution_breakdown';
    if (n.indexOf('reactive stabilizer') >= 0 || n.indexOf('urgent fixer') >= 0 || n.indexOf('live stabilizer') >= 0) {
      return 'scattered_focus';
    }
    if (n.indexOf('structural refiner') >= 0 || n.indexOf('gap spotter') >= 0 || n.indexOf('precision refiner') >= 0) {
      return 'weak_positioning';
    }
    return '';
  }

  function normalizeBottleneckTag(raw, archetypeHint) {
    var t = firstTag(raw, [
      { k: 'too many', tag: 'too_many_ideas' },
      { k: 'options', tag: 'too_many_ideas' },
      { k: 'scatter', tag: 'scattered_focus' },
      { k: 'no offer', tag: 'no_offer' },
      { k: 'money path', tag: 'no_money_path' },
      { k: 'monetiz', tag: 'no_money_path' },
      { k: 'wrong order', tag: 'wrong_order' },
      { k: 'order', tag: 'wrong_order' },
      { k: 'review', tag: 'needs_full_review' },
      { k: 'full', tag: 'needs_full_review' },
      { k: 'position', tag: 'weak_positioning' },
      { k: 'execution', tag: 'execution_breakdown' }
    ]);
    if (t) return t;
    return normalizeBottleneckFromArchetype(archetypeHint || raw);
  }

  function normalizeClarityTag(raw) {
    var t = lc(raw);
    if (t === 'none' || t === 'low' || t === 'medium' || t === 'high') return t;
    return firstTag(raw, [
      { k: 'none', tag: 'none' },
      { k: 'low', tag: 'low' },
      { k: 'medium', tag: 'medium' },
      { k: 'high', tag: 'high' },
      { k: 'unclear', tag: 'low' },
      { k: 'clear', tag: 'medium' }
    ]);
  }

  function normalizeRevenueReadyTag(raw) {
    var t = lc(raw);
    if (t === 'none' || t === 'low' || t === 'medium' || t === 'high') return t;
    return firstTag(raw, [
      { k: 'none', tag: 'none' },
      { k: 'low', tag: 'low' },
      { k: 'medium', tag: 'medium' },
      { k: 'high', tag: 'high' }
    ]);
  }

  function normalizeAudienceTag(raw) {
    var t = lc(raw);
    if (t === 'none' || t === 'unclear' || t === 'some' || t === 'defined') return t;
    return firstTag(raw, [
      { k: 'none', tag: 'none' },
      { k: 'unclear', tag: 'unclear' },
      { k: 'some', tag: 'some' },
      { k: 'defined', tag: 'defined' },
      { k: 'audience', tag: 'some' }
    ]);
  }

  function normalizeExecutionTag(raw) {
    var t = lc(raw);
    if (
      t === 'starting' ||
      t === 'finishing' ||
      t === 'shipping' ||
      t === 'consistency' ||
      t === 'follow_through' ||
      t === 'none'
    ) {
      return t;
    }
    return firstTag(raw, [
      { k: 'start', tag: 'starting' },
      { k: 'finish', tag: 'finishing' },
      { k: 'ship', tag: 'shipping' },
      { k: 'consistent', tag: 'consistency' },
      { k: 'follow', tag: 'follow_through' }
    ]);
  }

  /**
   * Infer tags from capture bits (binary choices) when structured answers are absent.
   * Indices match capture.html QUESTIONS (6 questions).
   */
  function inferTagsFromBits(bits) {
    var out = {
      directionClarity: '',
      revenueReadiness: '',
      audienceState: '',
      executionIssue: '',
      bottleneck: '',
      goal: ''
    };
    if (!bits || bits.length < 6) return out;

    if (bits[5] === 1) out.directionClarity = 'low';
    else if (bits[5] === 0) out.directionClarity = 'medium';

    if (bits[1] === 0) out.executionIssue = 'starting';
    else if (bits[1] === 1) out.executionIssue = 'shipping';

    if (bits[1] === 0 && bits[5] === 0) out.bottleneck = 'wrong_order';

    if (bits[2] === 1 && bits[3] === 1) out.directionClarity = out.directionClarity || 'medium';

    return out;
  }

  function inferTagsFromPlaybook(pb) {
    var p = lc(pb);
    var out = {
      goal: '',
      revenueReadiness: '',
      bottleneck: '',
      executionIssue: ''
    };
    if (p.indexOf('income architecture') >= 0 || (p.indexOf('income') >= 0 && p.indexOf('architecture') >= 0)) {
      out.goal = 'make_money';
      out.revenueReadiness = 'low';
      out.bottleneck = 'no_money_path';
    }
    if (p === 'execution') {
      out.executionIssue = 'consistency';
      out.bottleneck = out.bottleneck || 'wrong_order';
    }
    if (p === 'reset') out.bottleneck = 'scattered_focus';
    if (p.indexOf('ownership') >= 0) {
      out.goal = 'build_system';
      out.executionIssue = out.executionIssue || 'follow_through';
    }
    if (p.indexOf('ai control') >= 0) out.goal = 'build_system';
    return out;
  }

  function mainIssueTextSuggestsDirection(mainIssue) {
    var t = lc(mainIssue);
    if (!t) return false;
    return (
      t.indexOf('too many') >= 0 ||
      t.indexOf('option') >= 0 ||
      t.indexOf('overthink') >= 0 ||
      t.indexOf('awareness') >= 0 ||
      t.indexOf('committed') >= 0 ||
      t.indexOf('search') >= 0 ||
      t.indexOf('mixed') >= 0
    );
  }

  /** Merge raw answers, bits, result into state.tags. */
  function isCanonicalAnswerKey(k, v) {
    var sets = {
      goal: ['make_money', 'get_clear', 'build_offer', 'get_clients', 'build_system', 'fix_execution'],
      bottleneck: [
        'too_many_ideas',
        'no_offer',
        'no_money_path',
        'scattered_focus',
        'wrong_order',
        'weak_positioning',
        'execution_breakdown',
        'needs_full_review'
      ],
      directionClarity: ['none', 'low', 'medium', 'high'],
      revenueReadiness: ['none', 'low', 'medium', 'high'],
      audienceState: ['none', 'unclear', 'some', 'defined'],
      executionIssue: ['starting', 'finishing', 'shipping', 'consistency', 'follow_through', 'none']
    };
    return sets[k] && sets[k].indexOf(v) >= 0;
  }

  function normalizeTags(state) {
    var tags = {
      goal: '',
      bottleneck: '',
      directionClarity: '',
      revenueReadiness: '',
      audienceState: '',
      executionIssue: ''
    };
    var a = state.answers || {};
    var cap = lsGetCaptureState();
    var bits = cap && cap.bits ? cap.bits : null;
    if (bits && bits.length === 10) {
      bits = [bits[0], bits[1], bits[6], bits[8], bits[5], bits[9]];
    }
    var res = lsGet(RESULT_KEY);
    var archetype = res && res.type_primary ? String(res.type_primary) : '';

    if (a.source === 'capture_bits') {
      tags.goal = a.goal || '';
      tags.bottleneck = a.bottleneck || '';
      tags.directionClarity = a.directionClarity || '';
      tags.revenueReadiness = a.revenueReadiness || '';
      tags.audienceState = a.audienceState || '';
      tags.executionIssue = a.executionIssue || '';
    } else {
      var fromBits = inferTagsFromBits(bits);
      var playbook = res && res.playbooks && res.playbooks[0] ? res.playbooks[0] : '';
      var fromPb = inferTagsFromPlaybook(playbook);

      tags.goal =
        (isCanonicalAnswerKey('goal', a.goal) ? a.goal : '') ||
        normalizeGoalTag(a.goal) ||
        fromPb.goal ||
        fromBits.goal;
      tags.bottleneck =
        (isCanonicalAnswerKey('bottleneck', a.bottleneck) ? a.bottleneck : '') ||
        normalizeBottleneckTag(a.bottleneck, archetype) ||
        normalizeBottleneckFromArchetype(archetype) ||
        fromBits.bottleneck ||
        fromPb.bottleneck;

      tags.directionClarity =
        (isCanonicalAnswerKey('directionClarity', a.directionClarity) ? a.directionClarity : '') ||
        normalizeClarityTag(a.directionClarity) ||
        fromBits.directionClarity ||
        '';
      tags.revenueReadiness =
        (isCanonicalAnswerKey('revenueReadiness', a.revenueReadiness) ? a.revenueReadiness : '') ||
        normalizeRevenueReadyTag(a.revenueReadiness) ||
        fromPb.revenueReadiness ||
        '';
      tags.audienceState =
        (isCanonicalAnswerKey('audienceState', a.audienceState) ? a.audienceState : '') ||
        normalizeAudienceTag(a.audienceState) ||
        '';
      tags.executionIssue =
        (isCanonicalAnswerKey('executionIssue', a.executionIssue) ? a.executionIssue : '') ||
        normalizeExecutionTag(a.executionIssue) ||
        fromBits.executionIssue ||
        fromPb.executionIssue ||
        '';

      if (res && res.result_version === 'mixed_general') {
        if (!tags.directionClarity) tags.directionClarity = 'low';
      }

      if (res && res.result_version === 'connector_overthinking_scattered') {
        if (!tags.bottleneck) tags.bottleneck = 'too_many_ideas';
      }
      if (res && res.result_version === 'interpreter_avoidance_wrongpeople') {
        if (!tags.audienceState) tags.audienceState = 'unclear';
      }

      if (typeof state.outputs === 'object' && state.outputs.mainIssue && mainIssueTextSuggestsDirection(state.outputs.mainIssue)) {
        if (!tags.bottleneck) tags.bottleneck = 'too_many_ideas';
      }

      if (state.diagnosticCompleted && !tags.revenueReadiness) {
        if (state.currentPhase === '/monetize') tags.revenueReadiness = 'low';
        else if (state.currentPhase === '/structure' || state.currentPhase === '/automation') {
          tags.revenueReadiness = tags.revenueReadiness || 'medium';
        }
      }
    }

    state.tags = Object.assign(defaultState().tags, tags);
    return state.tags;
  }

  function scoreStages(state) {
    var tags = state.tags || {};
    var b = state.behavior || {};
    var out = { direction: 0, revenue: 0, lock: 0, concept: 0, snapshot: 0 };
    var reasons = { direction: [], revenue: [], lock: [], concept: [], snapshot: [] };

    var dc = tags.directionClarity;
    var rr = tags.revenueReadiness;
    var aud = tags.audienceState;
    var bott = tags.bottleneck;
    var goal = tags.goal;
    var ex = tags.executionIssue;

    var phaseClicks = (b.clickedPhases || []).length;
    var pricingHits = b.pricingVisits || 0;
    var completedDiag = !!state.diagnosticCompleted;
    var roomsDone = (state.completedRooms || []).length;
    var timeOn = b.timeOnSite || 0;
    var o = state.outputs || {};
    var mit = o.mainIssueTag;
    var nmt = o.nextMoveTag;
    var tlt = o.timeLossTier;
    var mlt = o.moneyLossTier;

    function add(stage, w, reason) {
      out[stage] += w;
      if (reason) reasons[stage].push(reason);
    }

    if (dc === 'none') add('direction', 3, 'direction clarity none');

    if (bott === 'too_many_ideas' || bott === 'scattered_focus') {
      add('direction', 3, 'bottleneck ideas or scatter');
      add('lock', 2, 'bottleneck ideas or scatter');
    }
    if (bott === 'no_offer') add('direction', 3, 'no offer');
    if (bott === 'no_money_path') add('revenue', 3, 'no money path');
    if (bott === 'wrong_order') add('lock', 3, 'wrong order');
    if (bott === 'weak_positioning') add('concept', 2, 'weak positioning');
    if (bott === 'needs_full_review') add('snapshot', 4, 'needs full review');

    if ((rr === 'none' || rr === 'low') && (dc === 'medium' || dc === 'high')) {
      add('revenue', 3, 'direction ahead of revenue');
    }
    if (goal === 'make_money' || goal === 'get_clients') add('revenue', 2, 'goal revenue');

    if (aud === 'none') add('direction', 2, 'no audience');
    if (aud === 'some' || aud === 'defined') add('concept', 2, 'audience present');

    if (ex === 'starting' || ex === 'consistency') add('lock', 2, 'execution stall');
    if (ex === 'shipping' || ex === 'finishing') add('concept', 2, 'execution toward ship');

    if (tlt === 'high') {
      add('lock', 2, 'time loss high');
      add('snapshot', 2, 'time loss high');
    }
    if (mlt === 'high') {
      add('revenue', 2, 'money loss high');
      add('snapshot', 2, 'money loss high');
    }
    if (mit) add(mit, 3, 'main issue text');
    if (nmt) add(nmt, 2, 'next move text');

    if (pricingHits > 1) {
      add('snapshot', 2, 'repeat pricing');
      add('revenue', 1, 'repeat pricing');
    }
    if (phaseClicks > 2 && roomsDone === 0 && !completedDiag) {
      add('lock', 3, 'phases without completion');
    }
    if (roomsDone > 1) {
      add('concept', 2, 'multiple rooms done');
      add('snapshot', 2, 'multiple rooms done');
    }
    if (timeOn > LONG_SESSION_MS && !completedDiag && roomsDone === 0) {
      add('lock', 2, 'long session no decision');
    }

    return { scores: out, reasons: reasons };
  }

  function pickWinnerByOrder(scores) {
    var maxScore = -Infinity;
    var k;
    for (k in scores) {
      if (scores[k] > maxScore) maxScore = scores[k];
    }
    if (maxScore <= 0) return { stage: 'direction', margin: 0 };

    var second = -Infinity;
    var i;
    var stage = 'direction';
    for (i = 0; i < STAGE_ORDER_TIEBREAK.length; i++) {
      var s = STAGE_ORDER_TIEBREAK[i];
      if (scores[s] === maxScore) {
        stage = s;
        break;
      }
    }
    for (i = 0; i < STAGE_ORDER_TIEBREAK.length; i++) {
      var t = STAGE_ORDER_TIEBREAK[i];
      if (t === stage) continue;
      if (scores[t] > second) second = scores[t];
    }
    if (second < 0) second = 0;
    return { stage: stage, margin: maxScore - second };
  }

  function computeStage(state) {
    normalizeTags(state);

    var tags = state.tags;
    var b = state.behavior || {};
    var phaseClicks = (b.clickedPhases || []).length;
    var pricingHits = b.pricingVisits || 0;
    var completedDiag = !!state.diagnosticCompleted;
    var roomsDone = (state.completedRooms || []).length;
    var dc = tags.directionClarity;

    var sr = scoreStages(state);
    var scores = sr.scores;
    var reasons = sr.reasons;

    // --- Overrides (deterministic, applied after base scores) ---
    var loop =
      phaseClicks >= LOCK_PHASE_CLICKS_MIN &&
      !completedDiag &&
      pricingHits >= LOOP_PRICING_VISITS;

    if (tags.directionClarity === 'none') {
      scores.direction += 8;
      reasons.direction.push('override: clarity explicitly none');
    }

    if ((dc === 'medium' || dc === 'high') && tags.bottleneck === 'no_money_path') {
      scores.revenue += 5;
      reasons.revenue.push('override: clear enough but no money path');
    }

    if (loop) {
      scores.lock += 8;
      reasons.lock.push('override: looping without progress');
    }

    if (tags.directionClarity === 'high' && (tags.audienceState === 'some' || tags.audienceState === 'defined') && tags.revenueReadiness === 'medium') {
      scores.concept += 4;
      reasons.concept.push('override: ready to build');
    }

    if (roomsDone >= 2 && pricingHits >= 2 && (b.advisoryClicks || 0) + (b.onlySometimesClicks || 0) >= 2) {
      scores.snapshot += 6;
      reasons.snapshot.push('override: high-intent repeat visits');
    }

    var picked = pickWinnerByOrder(scores);
    var stage = picked.stage;
    var margin = picked.margin;

    var tier = TIER_BY_STAGE[stage] || TIER_BY_STAGE.direction;
    var stageReason = LITERAL_STAGE_REASON[stage] || LITERAL_STAGE_REASON.direction;

    var conf = 'low';
    if (margin >= CONF_HIGH_GAP) conf = 'high';
    else if (margin >= CONF_MED_GAP) conf = 'medium';

    state.stageScores = scores;
    state.stage = stage;
    state.recommendedTier = tier.id;
    state.recommendedTierName = tier.name;
    state.stageReason = stageReason;
    state.stageConfidence = conf;
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

  /** Use for tier highlight and panel recommendations only (not generic “visited site”). */
  function hasStrongRecommendation(s) {
    if (!s) return false;
    return s.stageConfidence === 'high' || s.stageConfidence === 'medium';
  }

  function uniqPush(arr, item, max) {
    if (!item || arr.indexOf(item) >= 0) return;
    arr.push(item);
    while (arr.length > (max || 12)) arr.shift();
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
    if (line) {
      var pl = '';
      if (state.diagnosticCompleted && state.outputs && state.outputs.nextMove) {
        pl = trimStr(state.outputs.nextMove, 140);
      } else if (HERO_LINE[state.stage]) {
        pl = HERO_LINE[state.stage];
      } else if (state.stageReason && hasStrongRecommendation(state)) {
        pl = String(state.stageReason);
      }
      line.textContent = pl;
      line.hidden = !pl;
    }
    if (hint) {
      hint.textContent = '';
      hint.hidden = true;
    }
    var osc = state.behavior.onlySometimesClicks || 0;
    if (osc > 2) {
      var disc = global.document.querySelector('.home-os-discover');
      if (disc) disc.classList.add('home-os-discover--emphasize');
    }

    if (state.behavior.lingerPulse) {
      var plEl = global.document.getElementById('hero-personal-line');
      if (plEl) plEl.classList.add('hero-personal-line--linger');
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

    if (!hasStrongRecommendation(state)) {
      if (global.StephuaryCeiBridge && typeof global.StephuaryCeiBridge.applyPricing === 'function') {
        global.StephuaryCeiBridge.applyPricing(global.document, state);
      }
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
        badge.textContent = 'Recommended for you';
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
      var whyP = String(state.stageReason || '').trim();
      sub.textContent = whyP || state.recommendedTierName + ' matches what showed up in your path.';
      sub.hidden = false;
    }

    var osc = state.behavior.onlySometimesClicks || 0;
    if (osc > 2 && groups.length) {
      groups[groups.length - 1].classList.add('price-group--osc-emphasis');
    }

    if (global.StephuaryCeiBridge && typeof global.StephuaryCeiBridge.applyPricing === 'function') {
      global.StephuaryCeiBridge.applyPricing(global.document, state);
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
      state.stage && hasStrongRecommendation(state) ? PANEL_REC_LINE[state.stage] || '' : '';
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

    var lo = null;
    try {
      lo = JSON.parse(global.localStorage.getItem('stephuary_live_output_v1') || 'null');
    } catch (e1) {
      lo = null;
    }
    if (hasDiag && lo && typeof lo.smoothMoney === 'number') {
      els.elMoney.textContent = els.formatMoney(Math.round(lo.smoothMoney)) + '/yr est.';
      var dtm = els.elMoney.previousElementSibling;
      if (dtm && dtm.tagName === 'DT') dtm.textContent = 'Est. money loss';
    }
    if (hasDiag && lo && typeof lo.smoothHours === 'number' && !o.timeLoss) {
      els.elTime.textContent = els.formatHours(lo.smoothHours) + ' est.';
      var dtt = els.elTime.previousElementSibling;
      if (dtt && dtt.tagName === 'DT') dtt.textContent = 'Est. time loss';
    }

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
          href.indexOf('/execution') === 0 ||
          href.indexOf('/systems') === 0 ||
          href.indexOf('/phases/') === 0 ||
          href.indexOf('/direction-system') === 0 ||
          href.indexOf('/revenue-system') === 0
        ) {
          uniqPush(state.behavior.clickedPhases, href.split('?')[0]);
        }
        if (href.indexOf('/pricing') === 0 || href === '/pricing') {
          state.behavior.viewedPricing = true;
        }
        if (href.indexOf('onlysometimesclub.com') >= 0) {
          state.behavior.onlySometimesClicks = (state.behavior.onlySometimesClicks || 0) + 1;
        }
        if (
          href.indexOf('/snapshot') === 0 ||
          href.indexOf('/access') === 0 ||
          href.indexOf('/private-access') === 0 ||
          href.indexOf('/focused-review') === 0
        ) {
          state.behavior.advisoryClicks = (state.behavior.advisoryClicks || 0) + 1;
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
    try {
      global.localStorage.removeItem(DIAGNOSTIC_ANSWERS_KEY);
    } catch (e) {}
    state = mergeFromStorage(load());
    state.answers = defaultState().answers;
    state.outputs = defaultState().outputs;
    state.tags = defaultState().tags;
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
    mapBitsToAnswers: mapBitsToAnswers,
    persistDiagnosticFromBits: persistDiagnosticFromBits,
    applyLivePanel: applyLivePanel,
    applyHomeHero: applyHomeHero,
    afterLivePanelTick: afterLivePanelTick,
    clearDiagnosticSlice: clearDiagnosticSlice,
    reloadState: reloadState
  };
})(typeof window !== 'undefined' ? window : this);
