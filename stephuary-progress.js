/**
 * Unified system progress + resume (localStorage).
 * KEY: stephuary_system_progress_v1
 * Syncs with stephuary_os_v1 via StephuaryOS.record.
 */
(function (global) {
  var KEY = 'stephuary_system_progress_v1';

  var ROOM_ORDER = ['01', '02', '03', '04', '05'];
  var ROOM_PHASE = { '01': 1, '02': 2, '03': 3, '04': 4, '05': 5 };
  var PHASE_PATH = {
    1: '/room-01',
    2: '/room-02',
    3: '/room-03',
    4: '/room-04',
    5: '/room-05'
  };
  var ROOM_PATH = {
    '01': '/room-01',
    '02': '/room-02',
    '03': '/room-03',
    '04': '/room-04',
    '05': '/room-05'
  };

  function defaultState() {
    return { v: 1, phase: 1, lastStep: 0, completed: [], rooms: {} };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      var o = JSON.parse(raw);
      if (!o || o.v !== 1) return defaultState();
      if (!Array.isArray(o.completed)) o.completed = [];
      if (!o.rooms || typeof o.rooms !== 'object') o.rooms = {};
      return o;
    } catch (e) {
      return defaultState();
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function syncFromOS() {
    if (!global.StephuaryOS || !global.StephuaryOS.load) return;
    var os = global.StephuaryOS.load();
    var data = load();
    ROOM_ORDER.forEach(function (id) {
      var r = os.rooms && os.rooms[id];
      if (r && typeof r.step === 'number') {
        if (!data.rooms[id]) data.rooms[id] = {};
        data.rooms[id].lastStep = r.step;
        data.rooms[id].ts = r.timestamp || null;
      }
    });
    if (os.lastRoomId && ROOM_PHASE[os.lastRoomId]) {
      data.phase = ROOM_PHASE[os.lastRoomId];
      var cur = os.rooms && os.rooms[os.lastRoomId];
      if (cur && typeof cur.step === 'number') data.lastStep = cur.step;
    }
    save(data);
  }

  /**
   * Called from StephuaryOS.record after each step.
   */
  function onRoomStep(roomId, step, totalSteps) {
    if (!ROOM_PHASE[roomId]) return;
    var data = load();
    data.phase = ROOM_PHASE[roomId];
    data.lastStep = step;
    if (!data.rooms[roomId]) data.rooms[roomId] = {};
    data.rooms[roomId].lastStep = step;
    save(data);
  }

  function markRoomComplete(roomId) {
    if (!ROOM_PHASE[roomId]) return;
    var data = load();
    if (data.completed.indexOf(roomId) === -1) data.completed.push(roomId);
    save(data);
    syncFromOS();
  }

  function nextPhasePathAfter(roomId) {
    var idx = ROOM_ORDER.indexOf(roomId);
    if (idx < 0 || idx >= ROOM_ORDER.length - 1) return '/systems';
    var nextId = ROOM_ORDER[idx + 1];
    return PHASE_PATH[ROOM_PHASE[nextId]];
  }

  function getResumeLabel() {
    syncFromOS();
    if (!global.StephuaryOS) return null;
    var os = global.StephuaryOS.load();
    var id = os.lastRoomId;
    if (!id || !ROOM_PATH[id]) return null;
    var r = os.rooms && os.rooms[id];
    var step = r && typeof r.step === 'number' ? r.step : 0;
    var ph = ROOM_PHASE[id];
    return {
      href: ROOM_PATH[id] + '?step=' + step,
      line: 'Continue where you left off → Phase ' + ph
    };
  }

  function clearProgress() {
    try {
      localStorage.removeItem(KEY);
      if (global.StephuaryOS && global.StephuaryOS.KEY) {
        localStorage.removeItem(global.StephuaryOS.KEY);
      }
    } catch (e) {}
  }

  function confirmRestart() {
    if (typeof global.confirm === 'function') {
      if (!global.confirm('Clear saved progress for this device?')) return;
    }
    clearProgress();
    global.location.href = '/';
  }

  global.StephuaryProgress = {
    KEY: KEY,
    load: load,
    save: save,
    syncFromOS: syncFromOS,
    onRoomStep: onRoomStep,
    markRoomComplete: markRoomComplete,
    nextPhasePathAfter: nextPhasePathAfter,
    getResumeLabel: getResumeLabel,
    clearProgress: clearProgress,
    confirmRestart: confirmRestart,
    PHASE_PATH: PHASE_PATH,
    ROOM_PATH: ROOM_PATH,
    ROOM_ORDER: ROOM_ORDER
  };
})(typeof window !== 'undefined' ? window : this);
