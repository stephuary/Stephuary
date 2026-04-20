/**
 * Linear diagnostic Phases 01–05: completion flags, resume URL, gating.
 * Phase 01 = Capture … Phase 05 = Sovereignty. Results and Rooms follow Phase 05.
 */
(function (global) {
  /** Phase 01 Capture writes v3; v2 remains for legacy reads. */
  var P01_STORAGE_KEYS = ['stephuary_capture_p01_v3', 'stephuary_capture_p01_v2'];
  var PHASE_STORAGE = {
    1: 'stephuary_capture_p01_v3',
    2: 'stephuary_monetize_p02_v1',
    3: 'stephuary_structure_p03_v1',
    4: 'stephuary_validation_p04_v1',
    5: 'stephuary_sovereignty_p05_v1'
  };
  var PHASE_DONE = {
    2: 'monetize_complete',
    3: 'structure_complete',
    4: 'automation_complete',
    5: 'sovereignty_complete'
  };
  var PHASE_PATH = { 1: '/capture', 2: '/monetize', 3: '/structure', 4: '/automation', 5: '/sovereignty' };
  var SINGLE_FLOW_KEY = 'stephuary_capture_p01_v3';

  function lsGet(k) {
    try {
      return global.localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }

  function lsSet(k, v) {
    try {
      global.localStorage.setItem(k, v);
    } catch (e) {}
  }

  function lsRemove(k) {
    try {
      global.localStorage.removeItem(k);
    } catch (e) {}
  }

  function storageKeyForPhase(n) {
    return PHASE_STORAGE[n] || null;
  }

  function isSingleFlowComplete() {
    try {
      var raw = lsGet(SINGLE_FLOW_KEY);
      if (!raw) return false;
      var d = JSON.parse(raw);
      if (!d || !Array.isArray(d.bits) || d.bits.length < 15) return false;
      for (var i = 0; i < 15; i++) {
        if (d.bits[i] === null || d.bits[i] === undefined) return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function isStorageSummaryOrComplete(key) {
    if (!key) return false;
    try {
      var raw = lsGet(key);
      if (!raw) return false;
      var d = JSON.parse(raw);
      if (!d || !Array.isArray(d.bits)) return false;
      if (typeof d.currentStep === 'number' && d.currentStep >= 11) return true;
      for (var i = 0; i < d.bits.length; i++) {
        if (d.bits[i] === null || d.bits[i] === undefined) return false;
      }
      return d.bits.length > 0;
    } catch (e) {
      return false;
    }
  }

  function migrateCompletionFlags() {
    var p01StoredComplete = isStorageSummaryOrComplete(PHASE_STORAGE[1]);
    if (!p01StoredComplete) {
      var pi;
      for (pi = 0; pi < P01_STORAGE_KEYS.length; pi++) {
        if (isStorageSummaryOrComplete(P01_STORAGE_KEYS[pi])) {
          p01StoredComplete = true;
          break;
        }
      }
    }
    if (lsGet('capture_complete') === 'true' || p01StoredComplete) {
      if (lsGet('capture_complete') !== 'true') lsSet('capture_complete', 'true');
    }
    var n;
    for (n = 2; n <= 5; n++) {
      var flag = PHASE_DONE[n];
      var sk = PHASE_STORAGE[n];
      if (!flag || !sk) continue;
      if (lsGet(flag) === 'true') continue;
      if (isStorageSummaryOrComplete(sk)) lsSet(flag, 'true');
    }
  }

  function phaseDone(n) {
    migrateCompletionFlags();
    if (isSingleFlowComplete()) return true;
    if (n === 1) return lsGet('capture_complete') === 'true';
    var f = PHASE_DONE[n];
    return f && lsGet(f) === 'true';
  }

  function markPhaseComplete(n) {
    if (n === 1) {
      lsSet('capture_complete', 'true');
      return;
    }
    var f = PHASE_DONE[n];
    if (f) lsSet(f, 'true');
  }

  function clearCompletionFromPhase(n) {
    var k;
    for (k = n; k <= 5; k++) {
      if (k === 1) {
        lsRemove('capture_complete');
        continue;
      }
      if (PHASE_DONE[k]) lsRemove(PHASE_DONE[k]);
    }
    if (n >= 5) {
      lsRemove('diagnosticCompleted');
    }
  }

  function canEnterPhase(n) {
    migrateCompletionFlags();
    if (isSingleFlowComplete()) return n === 1;
    if (n <= 1) return true;
    return phaseDone(n - 1);
  }

  /**
   * Next URL in the diagnostic chain, or /results when Phases 01–05 are done.
   */
  function getResumeHref() {
    migrateCompletionFlags();
    if (isSingleFlowComplete()) return '/results';
    var p;
    for (p = 1; p <= 5; p++) {
      if (!phaseDone(p)) return PHASE_PATH[p];
    }
    try {
      if (lsGet('diagnosticCompleted') !== 'true') return '/results';
    } catch (e1) {}
    return '/results';
  }

  function isFullyComplete() {
    migrateCompletionFlags();
    if (isSingleFlowComplete()) return lsGet('diagnosticCompleted') === 'true';
    try {
      return phaseDone(5) && lsGet('diagnosticCompleted') === 'true';
    } catch (e2) {
      return false;
    }
  }

  /**
   * After Phases 01–04, the next page in the linear chain (not used for Phase 05; that goes to /results via result builder).
   */
  function getNextPhaseHrefAfterComplete(completedPhase) {
    if (typeof completedPhase !== 'number' || completedPhase < 1 || completedPhase >= 5) {
      return null;
    }
    return PHASE_PATH[completedPhase + 1] || null;
  }

  global.StephuaryDiagnosticFlow = {
    PHASE_PATH: PHASE_PATH,
    P01_STORAGE_KEYS: P01_STORAGE_KEYS,
    phaseDone: phaseDone,
    markPhaseComplete: markPhaseComplete,
    clearCompletionFromPhase: clearCompletionFromPhase,
    canEnterPhase: canEnterPhase,
    getResumeHref: getResumeHref,
    isFullyComplete: isFullyComplete,
    migrateCompletionFlags: migrateCompletionFlags,
    getNextPhaseHrefAfterComplete: getNextPhaseHrefAfterComplete
  };
})(typeof window !== 'undefined' ? window : this);
