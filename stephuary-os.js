/**
 * Stephuary OS — persistent room status (localStorage) for dashboard.
 * KEY: stephuary_os_v1
 */
(function (global) {
  var KEY = 'stephuary_os_v1';

  var META = {
    '01': { path: '/room-01', title: 'Extraction', statuses: ['exposed', 'reducing', 'controlled'] },
    '02': { path: '/room-02', title: 'Direction', statuses: ['scattered', 'shifting', 'locked'] },
    '03': { path: '/room-03', title: 'Transaction', statuses: ['unsent', 'active', 'closed'] },
    '04': { path: '/room-04', title: 'Infrastructure', statuses: ['fragile', 'stabilizing', 'durable'] },
    '05': { path: '/room-05', title: 'Cognition', statuses: ['reactive', 'uneven', 'controlled'] }
  };

  var ORDER = ['01', '02', '03', '04', '05'];

  function nowIso() {
    return new Date().toISOString();
  }

  function defaultState() {
    return { v: 1, lastRoomId: null, lastVisit: null, rooms: {} };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      var o = JSON.parse(raw);
      if (!o || o.v !== 1) return defaultState();
      return o;
    } catch (e) {
      return defaultState();
    }
  }

  function save(data) {
    data.lastVisit = nowIso();
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function completionFromStep(step, totalSteps) {
    var last = Math.max(1, totalSteps - 1);
    return Math.min(100, Math.round((step / last) * 100));
  }

  function statusFor03(step, messageSent) {
    var s = META['03'].statuses;
    if (step >= 15) return s[2];
    if (step === 6 && !messageSent) return s[0];
    return s[1];
  }

  function statusDefault(roomId, completion) {
    var s = META[roomId].statuses;
    if (completion >= 80) return s[2];
    if (completion >= 33) return s[1];
    return s[0];
  }

  function lastActionLine(roomId, step, totalSteps) {
    var t = META[roomId].title;
    return 'Room ' + roomId + ' — ' + t + ' · panel ' + (step + 1) + '/' + totalSteps;
  }

  /**
   * @param {string} roomId '01'..'05'
   * @param {{ step: number, totalSteps: number, messageSent?: boolean, messageCommitted?: boolean }} opts
   */
  function record(roomId, opts) {
    if (!META[roomId] || !opts) return;
    var step = typeof opts.step === 'number' ? opts.step : 0;
    var totalSteps = opts.totalSteps || 16;
    var comp = completionFromStep(step, totalSteps);
    var sent = opts.messageSent === true || opts.messageCommitted === true;
    var status;
    if (roomId === '03') {
      status = statusFor03(step, sent);
      if (step >= 15) comp = 100;
    } else {
      status = statusDefault(roomId, comp);
      if (comp >= 100) comp = 100;
    }

    var data = load();
    var prev = data.rooms[roomId] || {};
    var room = {
      status: status,
      completion: comp,
      lastAction: opts.lastAction || lastActionLine(roomId, step, totalSteps),
      timestamp: nowIso(),
      step: step
    };
    if (roomId === '03') room.messageSent = sent;
    data.rooms[roomId] = room;
    data.lastRoomId = roomId;
    save(data);
  }

  function getCompletion(data, id) {
    var r = data.rooms[id];
    return r && typeof r.completion === 'number' ? r.completion : 0;
  }

  function pickNextAction(data) {
    var r3 = data.rooms['03'];
    if (r3 && r3.status === 'unsent') return 'Send the message';
    var c1 = getCompletion(data, '01');
    if (c1 < 45) return 'Remove one drain';
    var c2 = getCompletion(data, '02');
    if (c2 < 45) return 'Shift time to priority';
    if (r3 && getCompletion(data, '03') < 100) return 'Send the message';
    var c4 = getCompletion(data, '04');
    if (c4 < 100) return 'Stabilize one continuity layer';
    var c5 = getCompletion(data, '05');
    if (c5 < 100) return 'Name one AI rule you will enforce on paid work';
    return 'Open the next room that still shows less than 100%';
  }

  function recommendedNextRoom(data) {
    for (var i = 0; i < ORDER.length; i++) {
      var id = ORDER[i];
      if (getCompletion(data, id) < 100) {
        return { id: id, path: META[id].path, title: META[id].title };
      }
    }
    return null;
  }

  function getDashboardData() {
    var data = load();
    var rooms = ORDER.map(function (id) {
      var m = META[id];
      var r = data.rooms[id];
      return {
        id: id,
        label: 'Room ' + id + ' — ' + m.title,
        path: m.path,
        status: r && r.status ? r.status : '—',
        completion: r && typeof r.completion === 'number' ? r.completion : 0,
        lastAction: r && r.lastAction ? r.lastAction : 'Not started',
        timestamp: r && r.timestamp ? r.timestamp : null
      };
    });

    var resume = null;
    if (data.lastRoomId && META[data.lastRoomId]) {
      var rr = data.rooms[data.lastRoomId];
      resume = {
        id: data.lastRoomId,
        path: META[data.lastRoomId].path,
        title: META[data.lastRoomId].title,
        lastAction: rr && rr.lastAction ? rr.lastAction : 'Continue',
        completion: rr && typeof rr.completion === 'number' ? rr.completion : 0
      };
    }

    var nextRoom = recommendedNextRoom(data);
    var nextAction = pickNextAction(data);

    return {
      lastVisit: data.lastVisit,
      rooms: rooms,
      resume: resume,
      nextRoom: nextRoom,
      nextAction: nextAction
    };
  }

  global.StephuaryOS = {
    KEY: KEY,
    META: META,
    load: load,
    save: save,
    record: record,
    getDashboardData: getDashboardData
  };
})(typeof window !== 'undefined' ? window : this);
