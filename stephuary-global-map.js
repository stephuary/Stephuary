/**
 * Global system map: orientation + navigation from saved state (interactive layer).
 */
(function (global) {
  var LINEAR = ['diagnostic', 'rooms', 'direction', 'revenue', 'lock', 'concept', 'snapshot'];

  var NODES = [
    {
      id: 'diagnostic',
      label: 'Diagnostic',
      path: '/capture',
      hash: '#flow-wrap',
      tip: 'Identify where time and money are being lost'
    },
    {
      id: 'rooms',
      label: 'Rooms',
      path: '/rooms',
      tip: 'Break down one problem clearly'
    },
    {
      id: 'direction',
      label: 'Direction System',
      path: '/direction-system',
      tip: 'Choose one path that makes sense'
    },
    {
      id: 'revenue',
      label: 'Revenue System',
      path: '/revenue-system',
      tip: 'Turn direction into something that pays'
    },
    {
      id: 'lock',
      label: 'Lock',
      path: '/phases/lock',
      tip: 'Fix order and remove unnecessary work'
    },
    {
      id: 'concept',
      label: 'Concept',
      path: '/phases/concept',
      tip: 'Build a clear, usable offer'
    },
    {
      id: 'snapshot',
      label: 'Snapshot',
      path: '/pricing',
      hash: '#tier-snapshot',
      tip: 'Full review of what is working and what is not'
    },
    {
      id: 'custom',
      label: 'Custom',
      path: 'https://onlysometimesclub.com',
      external: true,
      tip: 'Custom system built around your business'
    }
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
    '/rooms': 'rooms',
    '/playbooks': 'rooms',
    '/room-01-extraction': 'rooms',
    '/room-02-direction': 'direction',
    '/room-03-transaction': 'rooms',
    '/room-04-infrastructure': 'rooms',
    '/room-05-cognition': 'rooms',
    '/phases/direction': 'direction',
    '/direction-system': 'direction',
    '/monetize': 'revenue',
    '/phases/revenue': 'revenue',
    '/revenue-system': 'revenue',
    '/structure': 'revenue',
    '/automation': 'revenue',
    '/sovereignty': 'revenue',
    '/focused-review': 'lock',
    '/phases/lock': 'lock',
    '/access': 'concept',
    '/phases/concept': 'concept',
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

  function anyProgress(done) {
    for (var k in done) {
      if (done[k]) return true;
    }
    return false;
  }

  function minNotDoneIndex(done) {
    var i;
    for (i = 0; i < LINEAR.length; i++) {
      if (!done[LINEAR[i]]) return i;
    }
    return LINEAR.length;
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

    if (!currentId && !anyProgress(done) && path === '/') {
      currentId = 'diagnostic';
    }

    var gapIdx = minNotDoneIndex(done);

    return {
      done: done,
      currentId: currentId,
      recNode: recNode,
      reason: reason,
      nodes: NODES,
      gapIdx: gapIdx,
      linear: LINEAR
    };
  }

  function nodeHref(n) {
    if (n.external) return n.path;
    return n.path + (n.hash || '');
  }

  function isFutureSoft(nid, idx, m) {
    if (nid === 'custom') return false;
    var isCurrent = m.currentId === nid;
    var isDone = !!m.done[nid];
    if (isDone || isCurrent) return false;
    return idx > m.gapIdx;
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pathGradientVars(m) {
    var n = LINEAR.length;
    var goldEnd = 0;
    var i;
    for (i = 0; i < LINEAR.length; i++) {
      if (m.done[LINEAR[i]]) goldEnd = ((i + 1) / n) * 100;
    }
    var curI = m.currentId ? LINEAR.indexOf(m.currentId) : -1;
    var recI = m.recNode ? LINEAR.indexOf(m.recNode) : -1;
    var focus = curI >= 0 ? curI : recI >= 0 ? recI : m.gapIdx < LINEAR.length ? m.gapIdx : 0;
    var blueMid = ((focus + 0.5) / n) * 100;
    return { '--sh-gold-end': goldEnd + '%', '--sh-blue-mid': blueMid + '%' };
  }

  function renderInto(el) {
    if (!el) return;
    el.removeAttribute('data-sh-map-bound');
    var variant = el.getAttribute('data-global-system-map') || 'compact';
    var m = computeModel(global.location.pathname);
    var nodes = m.nodes;
    var vars = pathGradientVars(m);
    var html =
      '<div class="sh-global-map sh-global-map--' +
      variant +
      '" role="navigation" aria-label="System path" style="--sh-gold-end:' +
      vars['--sh-gold-end'] +
      ';--sh-blue-mid:' +
      vars['--sh-blue-mid'] +
      '">' +
      '<p class="sh-global-map__you">You are here</p>' +
      '<div class="sh-global-map__path" aria-hidden="true"><span class="sh-global-map__path-fill"></span></div>' +
      '<div class="sh-global-map__track">';
    var i;
    for (i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var cls = 'sh-global-map__node';
      if (m.done[n.id]) cls += ' is-done';
      if (m.currentId === n.id) cls += ' is-current';
      if (m.recNode === n.id) cls += ' is-rec';
      var idx = LINEAR.indexOf(n.id);
      var future = idx >= 0 && isFutureSoft(n.id, idx, m);
      if (future) cls += ' is-future';
      var fullHref = nodeHref(n);
      var isExternal = !!n.external;
      var ob = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      var tipMain = escapeHtml(n.tip);
      var futureHint =
        'Complete earlier step for best results';
      var tipFutureHtml = future
        ? '<span class="sh-global-map__tip-line sh-global-map__tip-line--future">' +
          escapeHtml(futureHint) +
          '</span>'
        : '';
      var aria =
        tipMain + (future ? '. ' + futureHint : '');
      var labelBits =
        '<span class="sh-global-map__dot"></span><span class="sh-global-map__label">' +
        escapeHtml(n.label) +
        '</span>';
      if (m.recNode === n.id && m.recNode) {
        labelBits += '<span class="sh-global-map__rec-inline">Next</span>';
      }
      var tipBlock =
        '<span class="sh-global-map__tip" role="tooltip">' +
        '<span class="sh-global-map__tip-line">' +
        tipMain +
        '</span>' +
        tipFutureHtml +
        '</span>';
      html +=
        '<a class="' +
        cls +
        '" href="' +
        escapeHtml(fullHref) +
        '"' +
        ob +
        ' data-sh-node="' +
        escapeHtml(n.id) +
        '"' +
        ' aria-label="' +
        escapeHtml(aria) +
        '">' +
        labelBits +
        tipBlock +
        '</a>';
      if (i < nodes.length - 1) {
        html += '<span class="sh-global-map__arrow" aria-hidden="true">→</span>';
      }
    }
    html += '</div>';
    html +=
      '<p class="sh-global-map__soft" hidden>You may want to complete earlier steps first.</p>';
    if (m.reason) {
      html += '<p class="sh-global-map__reason">' + escapeHtml(m.reason) + '</p>';
    }
    html += '</div>';
    el.innerHTML = html;
  }

  function showSoftNavNote() {
    try {
      if (global.sessionStorage.getItem('sh_map_soft_nav') !== '1') return;
      global.sessionStorage.removeItem('sh_map_soft_nav');
      global.document.querySelectorAll('.sh-global-map__soft').forEach(function (p) {
        p.hidden = false;
      });
    } catch (e) {}
  }

  function bindNodeClicks(root) {
    var noHover =
      global.window.matchMedia && global.window.matchMedia('(hover: none)').matches;
    root.addEventListener(
      'click',
      function (e) {
        var a = e.target.closest('.sh-global-map__node');
        if (!a || !root.contains(a)) return;
        if (noHover && !a.classList.contains('is-tip-open')) {
          global.document.querySelectorAll('.sh-global-map__node.is-tip-open').forEach(function (n) {
            if (n !== a) n.classList.remove('is-tip-open');
          });
          e.preventDefault();
          e.stopPropagation();
          a.classList.add('is-tip-open');
          return;
        }
        if (a.classList.contains('is-future')) {
          try {
            global.sessionStorage.setItem('sh_map_soft_nav', '1');
          } catch (err) {}
        }
        var href = a.getAttribute('href');
        if (!href || href.indexOf('http') === 0) return;
        var u;
        try {
          u = new global.URL(a.href, global.location.href);
        } catch (err) {
          return;
        }
        if (u.origin !== global.location.origin) return;
        if (u.pathname === global.location.pathname) {
          if (u.hash) {
            var target = global.document.querySelector(u.hash);
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          } else {
            e.preventDefault();
            global.window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      },
      true
    );
  }

  function bindScrollSync() {
    var sections = global.document.querySelectorAll('[data-sh-map-node]');
    if (sections.length < 2) return;

    function setScrollCurrent(nodeId) {
      global.document.querySelectorAll('.sh-global-map__node').forEach(function (node) {
        var id = node.getAttribute('data-sh-node');
        node.classList.toggle('is-scroll-current', id === nodeId);
      });
    }

    function pickFromScroll() {
      var best = null;
      var bestScore = -1;
      var mid = global.window.innerHeight * 0.38;
      sections.forEach(function (sec) {
        var r = sec.getBoundingClientRect();
        if (r.height < 8) return;
        var center = r.top + r.height / 2;
        var dist = Math.abs(center - mid);
        var score = r.height * r.width - dist;
        if (r.bottom > 0 && r.top < global.window.innerHeight && score > bestScore) {
          bestScore = score;
          best = sec.getAttribute('data-sh-map-node');
        }
      });
      if (best) setScrollCurrent(best);
    }

    if ('IntersectionObserver' in global) {
      var obs = new global.IntersectionObserver(
        function (entries) {
          var top = null;
          var max = 0;
          entries.forEach(function (en) {
            if (en.isIntersecting && en.intersectionRatio > max) {
              max = en.intersectionRatio;
              top = en.target.getAttribute('data-sh-map-node');
            }
          });
          if (top) setScrollCurrent(top);
        },
        { root: null, rootMargin: '-22% 0px -38% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
      );
      sections.forEach(function (s) {
        obs.observe(s);
      });
    }

    global.window.addEventListener(
      'scroll',
      function () {
        if (normPath(global.location.pathname) !== '/pricing') return;
        pickFromScroll();
      },
      { passive: true }
    );
    global.window.addEventListener('resize', function () {
      if (normPath(global.location.pathname) === '/pricing') pickFromScroll();
    });

    global.setTimeout(function () {
      if (normPath(global.location.pathname) === '/pricing') pickFromScroll();
    }, 120);
  }

  var enhanced = false;

  function bindEnhanced(root) {
    if (!root || root.getAttribute('data-sh-map-bound') === '1') return;
    root.setAttribute('data-sh-map-bound', '1');
    bindNodeClicks(root);
    if (!enhanced) {
      enhanced = true;
      global.document.addEventListener('click', function (e) {
        if (!e.target.closest('.sh-global-map')) {
          global.document.querySelectorAll('.sh-global-map__node.is-tip-open').forEach(function (n) {
            n.classList.remove('is-tip-open');
          });
        }
      });
      bindScrollSync();
    }
  }

  function init() {
    global.document.querySelectorAll('[data-global-system-map]').forEach(function (el) {
      renderInto(el);
      bindEnhanced(el);
    });
    showSoftNavNote();
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', function () {
      global.setTimeout(init, 0);
    });
  } else {
    global.setTimeout(init, 0);
  }

  global.StephuaryGlobalMap = {
    init: init,
    renderInto: renderInto,
    computeModel: computeModel
  };
})(typeof window !== 'undefined' ? window : this);
