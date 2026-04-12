/**
 * Global system map: orientation strip (Diagnostic → … → Custom) from saved state.
 */
(function (global) {
  var NODES = [
    { id: 'diagnostic', label: 'Diagnostic', href: '/capture' },
    { id: 'rooms', label: 'Rooms', href: '/playbooks' },
    { id: 'direction', label: 'Direction', href: '/room-02-direction' },
    { id: 'revenue', label: 'Revenue', href: '/monetize' },
    { id: 'lock', label: 'Lock', href: '/focused-review' },
    { id: 'concept', label: 'Concept', href: '/access' },
    { id: 'snapshot', label: 'Snapshot', href: '/snapshot' },
    { id: 'custom', label: 'Custom', href: 'https://onlysometimesclub.com' }
  ];

  var TIER_TO_NODE = {
    'direction-system': 'direction',
    'revenue-system': 'revenue',
    'direction-lock': 'lock',
    'concept-build': 'concept',
    snapshot: 'snapshot'
  };

  var PATH_NODE = {
    '/': '',
    '/capture': 'diagnostic',
    '/results': 'diagnostic',
    '/playbooks': 'rooms',
    '/room-01-extraction': 'rooms',
    '/room-02-direction': 'direction',
    '/room-03-transaction': 'rooms',
    '/room-04-infrastructure': 'rooms',
    '/room-05-cognition': 'rooms',
    '/monetize': 'revenue',
    '/structure': 'revenue',
    '/automation': 'revenue',
    '/sovereignty': 'revenue',
    '/focused-review': 'lock',
    '/access': 'concept',
    '/snapshot': 'snapshot',
    '/pricing': '',
    '/systems': ''
  };

  function normPath(p) {
    if (!p) return '/';
    var x = String(p).replace(/\/$/, '') || '/';
    return x;
  }

  function lsGet(k) {
    try {
      var r = global.localStorage.getItem(k);
      return r ? JSON.parse(r) : null;
    } catch (e) {
      return null;
    }
  }

  function getVisitedPhases() {
    try {
      var raw = global.localStorage.getItem('stephuary_phases_visited');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function computeModel(pathname) {
    var path = normPath(pathname);
    var diagDone = global.localStorage.getItem('diagnosticCompleted') === 'true';
    var pr = lsGet('stephuary_system_progress_v1');
    var completed = pr && Array.isArray(pr.completed) ? pr.completed : [];
    var phaseN = pr && typeof pr.phase === 'number' ? pr.phase : 0;
    var visited = getVisitedPhases();

    var currentId = PATH_NODE[path] || '';
    if (path.indexOf('/room-') === 0) {
      if (path.indexOf('room-02') >= 0) currentId = 'direction';
      else currentId = 'rooms';
    }

    var done = {};
    if (diagDone) done.diagnostic = true;
    if (completed.length > 0) done.rooms = true;
    if (visited.indexOf('/capture') >= 0 || diagDone) done.diagnostic = true;
    if (visited.indexOf('/monetize') >= 0 || phaseN >= 2) {
      done.revenue = true;
      done.direction = true;
    }
    if (visited.indexOf('/room-02-direction') >= 0 || completed.indexOf('02') >= 0) done.direction = true;
    if (visited.indexOf('/focused-review') >= 0) done.lock = true;
    if (visited.indexOf('/access') >= 0) done.concept = true;
    if (visited.indexOf('/snapshot') >= 0) done.snapshot = true;

    var recNode = '';
    var reason = '';
    if (global.StephuaryPersonalize && typeof global.StephuaryPersonalize.refresh === 'function') {
      try {
        global.StephuaryPersonalize.refresh();
        var st = global.StephuaryPersonalize.getState();
        if (st && st.recommendedTier) {
          recNode = TIER_TO_NODE[st.recommendedTier] || '';
        }
        reason = (st && st.stageReason) || '';
      } catch (e) {}
    }
    return { done: done, currentId: currentId, recNode: recNode, reason: reason, nodes: NODES };
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderInto(el) {
    if (!el) return;
    var variant = el.getAttribute('data-global-system-map') || 'compact';
    var m = computeModel(global.location.pathname);
    var nodes = m.nodes;
    var html =
      '<div class="sh-global-map sh-global-map--' +
      variant +
      '" role="navigation" aria-label="System path">' +
      '<p class="sh-global-map__you">You are here</p>' +
      '<div class="sh-global-map__track">';
    var i;
    for (i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var cls = 'sh-global-map__node';
      if (m.done[n.id]) cls += ' is-done';
      if (m.currentId === n.id) cls += ' is-current';
      if (m.recNode === n.id) cls += ' is-rec';
      var isExternal = n.href.indexOf('http') === 0;
      var ob = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      var labelBits =
        '<span class="sh-global-map__dot"></span><span class="sh-global-map__label">' + n.label + '</span>';
      if (m.recNode === n.id && m.recNode) {
        labelBits += '<span class="sh-global-map__rec-inline">Recommended next</span>';
      }
      html += '<a class="' + cls + '" href="' + n.href + '"' + ob + '>' + labelBits + '</a>';
      if (i < nodes.length - 1) {
        html += '<span class="sh-global-map__arrow" aria-hidden="true">→</span>';
      }
    }
    html += '</div>';
    if (m.reason) {
      html += '<p class="sh-global-map__reason">' + escapeHtml(m.reason) + '</p>';
    }
    html += '</div>';
    el.innerHTML = html;
  }

  function init() {
    global.document.querySelectorAll('[data-global-system-map]').forEach(function (el) {
      renderInto(el);
    });
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', function () {
      global.setTimeout(init, 0);
    });
  } else {
    global.setTimeout(init, 0);
  }

  global.StephuaryGlobalMap = { init: init, renderInto: renderInto, computeModel: computeModel };
})(typeof window !== 'undefined' ? window : this);
