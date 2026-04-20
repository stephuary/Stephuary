/**
 * Constellation hover/focus: linked nodes + curved connection lines (System page).
 */
(function () {
  if (!document.body || !document.body.classList.contains('page-systems')) return;

  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse =
    window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches;

  var STORAGE_DIASPORA = 'stephuary_diaspora_index';

  var REL = {
    capture: ['monetize', 'results'],
    monetize: ['structure', 'capture'],
    structure: ['automation', 'monetize'],
    automation: ['sovereignty', 'structure'],
    sovereignty: ['results', 'automation'],
    results: ['capture', 'sovereignty']
  };

  var svgNS = 'http://www.w3.org/2000/svg';
  var leaveTimer = null;
  var dwellTimer = null;
  var activeId = null;
  var svgEl = null;
  var wrapEl = null;

  function nodeById(id) {
    if (!wrapEl) return null;
    return wrapEl.querySelector('.sh-map-node[data-constellation-id="' + id + '"]');
  }

  function diasporaUnlocked() {
    try {
      return window.localStorage.getItem(STORAGE_DIASPORA) === '1';
    } catch (e) {
      return false;
    }
  }

  function pointOffscreen(fromX, fromY, w, h, variant) {
    if (variant === 'direction') {
      return { x: w - 4, y: Math.max(14, fromY - h * 0.1) };
    }
    return { x: w - 4, y: fromY - 10 };
  }

  function pointDiaspora(w, h) {
    return { x: w * 0.06, y: h * 0.88 };
  }

  function quadPath(x1, y1, x2, y2, bendX) {
    var mx = (x1 + x2) / 2 + (bendX || 0);
    var my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.06;
    return 'M ' + x1 + ' ' + y1 + ' Q ' + mx + ' ' + my + ' ' + x2 + ' ' + y2;
  }

  function clearVisual() {
    if (!svgEl) return;
    svgEl.querySelectorAll('path, line').forEach(function (el) {
      el.parentNode.removeChild(el);
    });
  }

  function clearState() {
    if (!wrapEl) return;
    window.clearTimeout(dwellTimer);
    dwellTimer = null;
    activeId = null;
    wrapEl.removeAttribute('data-constellation-active');
    wrapEl.classList.remove('constellation-dwell');
    wrapEl.querySelectorAll('.sh-map-node').forEach(function (n) {
      n.classList.remove('constellation-active', 'constellation-linked');
    });
    clearVisual();
  }

  function scheduleClear() {
    window.clearTimeout(leaveTimer);
    window.clearTimeout(dwellTimer);
    leaveTimer = window.setTimeout(function () {
      clearState();
    }, coarse ? 220 : 160);
  }

  function cancelClear() {
    window.clearTimeout(leaveTimer);
  }

  function drawConnections(sourceId) {
    if (!svgEl || !wrapEl) return;
    clearVisual();
    var targets = REL[sourceId];
    if (!targets || !targets.length) return;

    var wr = wrapEl.getBoundingClientRect();
    var w = wr.width;
    var h = wr.height;
    if (w < 8 || h < 8) return;

    svgEl.setAttribute('viewBox', '0 0 ' + w + ' ' + h);

    var srcEl = nodeById(sourceId);
    if (!srcEl) return;
    var sr = srcEl.getBoundingClientRect();
    var x1 = sr.left + sr.width / 2 - wr.left;
    var y1 = sr.top + sr.height / 2 - wr.top;

    var ti;
    for (ti = 0; ti < targets.length; ti++) {
      var tid = targets[ti];
      var x2;
      var y2;
      var bend = 0;
      if (tid === '_off') {
        var off = pointOffscreen(x1, y1, w, h, sourceId);
        x2 = off.x;
        y2 = off.y;
        bend =
          sourceId === 'direction'
            ? 22
            : sourceId === 'sovereignty' || sourceId === 'concept'
              ? 18
              : 12;
      } else if (tid === '_diaspora') {
        if (!diasporaUnlocked()) continue;
        var dia = pointDiaspora(w, h);
        x2 = dia.x;
        y2 = dia.y;
        bend = -18;
      } else {
        var te = nodeById(tid);
        if (!te) continue;
        var tr = te.getBoundingClientRect();
        x2 = tr.left + tr.width / 2 - wr.left;
        y2 = tr.top + tr.height / 2 - wr.top;
      }

      var d = quadPath(x1, y1, x2, y2, bend);
      var base = document.createElementNS(svgNS, 'path');
      base.setAttribute('d', d);
      base.setAttribute('class', 'systems-constellation-edge');
      svgEl.appendChild(base);

      if (!reduceMotion) {
        var glow = document.createElementNS(svgNS, 'path');
        glow.setAttribute('d', d);
        glow.setAttribute('class', 'systems-constellation-edge-glow');
        svgEl.appendChild(glow);
      }

      if (!reduceMotion && !coarse) {
        var rip = document.createElementNS(svgNS, 'path');
        rip.setAttribute('d', d);
        rip.setAttribute('class', 'systems-constellation-ripple');
        svgEl.appendChild(rip);
        try {
          var len = rip.getTotalLength();
          if (len > 4) {
            rip.style.strokeDasharray = len + ' ' + len;
            rip.style.strokeDashoffset = String(len);
            rip.style.setProperty('--c-len', String(len));
            window.requestAnimationFrame(function () {
              rip.classList.add('systems-constellation-ripple--run');
            });
            window.setTimeout(function () {
              if (rip.parentNode) rip.parentNode.removeChild(rip);
            }, 1400);
          } else if (rip.parentNode) {
            rip.parentNode.removeChild(rip);
          }
        } catch (e) {
          if (rip.parentNode) rip.parentNode.removeChild(rip);
        }
      }
    }
  }

  function applyNodeClasses(sourceId) {
    if (!wrapEl) return;
    wrapEl.querySelectorAll('.sh-map-node').forEach(function (n) {
      n.classList.remove('constellation-active', 'constellation-linked');
    });
    var src = nodeById(sourceId);
    if (src) src.classList.add('constellation-active');

    var targets = REL[sourceId];
    if (!targets) return;
    var i;
    for (i = 0; i < targets.length; i++) {
      var tid = targets[i];
      if (tid === '_off' || tid === '_diaspora') continue;
      var el = nodeById(tid);
      if (el) el.classList.add('constellation-linked');
    }
  }

  function activate(id) {
    if (!REL[id]) return;
    cancelClear();
    window.clearTimeout(dwellTimer);
    activeId = id;
    wrapEl.setAttribute('data-constellation-active', id);
    wrapEl.classList.remove('constellation-dwell');
    applyNodeClasses(id);
    drawConnections(id);

    dwellTimer = window.setTimeout(function () {
      if (activeId === id && wrapEl) {
        wrapEl.classList.add('constellation-dwell');
      }
    }, coarse ? 650 : 1280);
  }

  function onEnter(e) {
    var t = e.currentTarget;
    var id = t.getAttribute('data-constellation-id');
    if (!id || !REL[id]) return;
    activate(id);
  }

  function onLeave() {
    scheduleClear();
  }

  function onFocusIn(e) {
    var t = e.target.closest && e.target.closest('.sh-map-node[data-constellation-id]');
    if (!t || !wrapEl.contains(t)) return;
    var id = t.getAttribute('data-constellation-id');
    if (!id || !REL[id]) return;
    activate(id);
  }

  function onFocusOut(e) {
    if (!wrapEl) return;
    window.setTimeout(function () {
      try {
        var rel = e.relatedTarget;
        if (rel && wrapEl.contains(rel)) return;
        var ae = document.activeElement;
        if (ae && wrapEl.contains(ae) && ae.classList.contains('sh-map-node')) return;
      } catch (err) {}
      scheduleClear();
    }, 48);
  }

  function onResize() {
    if (activeId) drawConnections(activeId);
  }

  function init() {
    wrapEl = document.querySelector('.systems-flow-wrap');
    if (!wrapEl || wrapEl.getAttribute('data-constellation-bound') === '1') return;
    wrapEl.setAttribute('data-constellation-bound', '1');

    svgEl = document.createElementNS(svgNS, 'svg');
    svgEl.setAttribute('class', 'systems-constellation-svg');
    svgEl.setAttribute('aria-hidden', 'true');
    var en = wrapEl.querySelector('.systems-energy-svg');
    if (en && en.nextSibling) {
      wrapEl.insertBefore(svgEl, en.nextSibling);
    } else {
      wrapEl.appendChild(svgEl);
    }

    wrapEl.querySelectorAll('.sh-map-node[data-constellation-id]').forEach(function (node) {
      node.addEventListener('mouseenter', onEnter);
      node.addEventListener('mouseleave', onLeave);
    });
    wrapEl.addEventListener('focusin', onFocusIn, true);
    wrapEl.addEventListener('focusout', onFocusOut, true);

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onResize, { passive: true });
  }

  window.SystemsConstellation = { init: init };
})();
