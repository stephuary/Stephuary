/**
 * Homepage CEI canvas system + origin finale (GSAP ScrollTrigger).
 */
(function (global) {
  var NODE_LABELS = ['Behavior', 'Environment', 'Time', 'Revenue', 'Friction', 'Attention', 'Decision'];
  var N = NODE_LABELS.length;
  var INFLUENCE_R = 155;
  var PULL_MAX = 14;
  var LERP = 0.12;
  var CENTER_LERP = 0.06;
  var CONVERGE_LERP = 0.085;
  var HOVER_R = 52;

  function distToSeg(px, py, x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var len2 = dx * dx + dy * dy || 1;
    var t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len2));
    var qx = x1 + t * dx;
    var qy = y1 + t * dy;
    return Math.hypot(px - qx, py - qy);
  }

  function initCeiCanvas(wrap, opts) {
    var canvas = wrap.querySelector('.cei-system-canvas');
    if (!canvas || !canvas.getContext) return { destroy: function () {} };

    var ctx = canvas.getContext('2d', { alpha: true });
    var mobile = !!(opts && opts.mobile);
    var reduced = !!(opts && opts.reduced);
    var w = 400;
    var h = 400;
    var cx = w * 0.5;
    var cy = h * 0.5;
    var orbitR = 128;
    var centerR = 9.5;
    var satR = 5.2;
    var HUB_CLIP_R = 40;
    var CENTER_LABEL_R = 24;

    var nodes = [];
    var i;
    for (i = 0; i < N; i++) {
      var ang = -Math.PI / 2 + (i * 2 * Math.PI) / N;
      nodes.push({
        bx: cx + orbitR * Math.cos(ang),
        by: cy + orbitR * Math.sin(ang),
        x: cx + orbitR * Math.cos(ang),
        y: cy + orbitR * Math.sin(ang),
        tx: cx + orbitR * Math.cos(ang),
        ty: cy + orbitR * Math.sin(ang),
        phase: i * 0.9,
        label: NODE_LABELS[i]
      });
    }

    var center = { x: cx, y: cy, tx: cx, ty: cy, phase: 0 };
    var mx = cx;
    var my = cy;
    var hasPointer = false;
    var converge = 0;
    var convergeTarget = 0;
    var scrollParallax = 0;
    var scrollTarget = 0;
    var running = true;
    var raf = 0;
    var dpr = 1;

    function resize() {
      var rect = wrap.getBoundingClientRect();
      if (rect.width < 8) return;
      dpr = Math.min(global.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function localCoords(ev) {
      var rect = canvas.getBoundingClientRect();
      var sx = w / rect.width;
      var sy = h / rect.height;
      return {
        x: (ev.clientX - rect.left) * sx,
        y: (ev.clientY - rect.top) * sy
      };
    }

    function onPointerMove(ev) {
      if (mobile) return;
      var p = localCoords(ev);
      mx = p.x;
      my = p.y;
      hasPointer = true;
    }

    function onPointerLeave() {
      hasPointer = false;
    }

    function onScrollParallax() {
      if (!mobile || !wrap.closest('#home-cei')) return;
      var sec = global.document.getElementById('home-cei');
      if (!sec) return;
      var r = sec.getBoundingClientRect();
      var vh = global.innerHeight || 600;
      var t = 1 - Math.min(1, Math.max(0, (r.top + r.height * 0.35) / vh));
      scrollTarget = (t - 0.5) * 10;
    }

    if (!mobile && !reduced) {
      wrap.addEventListener('pointermove', onPointerMove, { passive: true });
      wrap.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }
    if (mobile && !reduced) {
      global.addEventListener('scroll', onScrollParallax, { passive: true });
      onScrollParallax();
    }

    resize();
    try {
      if (global.ResizeObserver) {
        var ro = new global.ResizeObserver(function () {
          resize();
        });
        ro.observe(wrap);
      }
    } catch (e) {}

    function frame(now) {
      if (!running) return;
      var t = now * 0.001;

      if (mobile && !reduced) {
        scrollParallax += (scrollTarget - scrollParallax) * 0.06;
      }

      var mxi = hasPointer ? mx : cx;
      var myi = hasPointer ? my : cy;

      var dCenter = Math.hypot(mxi - cx, myi - cy);
      convergeTarget = !mobile && hasPointer && dCenter < HOVER_R ? 1 : 0;
      converge += (convergeTarget - converge) * CONVERGE_LERP;

      var floatAmp = reduced ? 0 : mobile ? 2.2 : 2.8;
      var cFloat = reduced ? 0 : Math.sin(t * 0.55) * 1.2;
      center.tx = cx + cFloat * 0.35;
      center.ty = cy + Math.cos(t * 0.48) * 0.45;
      center.x += (center.tx - center.x) * CENTER_LERP;
      center.y += (center.ty - center.y) * CENTER_LERP;

      for (i = 0; i < N; i++) {
        var nd = nodes[i];
        var fx = Math.sin(t * 0.31 + nd.phase) * floatAmp;
        var fy = Math.cos(t * 0.27 + nd.phase * 1.1) * floatAmp;
        var bx = nd.bx + fx;
        var by = nd.by + fy;

        var pullX = 0;
        var pullY = 0;
        if (!mobile && hasPointer) {
          var dx = mx - bx;
          var dy = my - by;
          var d = Math.hypot(dx, dy) + 1e-6;
          var inf = Math.max(0, 1 - d / INFLUENCE_R);
          inf = inf * inf * (3 - 2 * inf);
          pullX = (dx / d) * PULL_MAX * inf * (1 - converge * 0.85);
          pullY = (dy / d) * PULL_MAX * inf * (1 - converge * 0.85);
        }

        var cvx = (cx - bx) * 0.09 * converge;
        var cvy = (cy - by) * 0.09 * converge;
        nd.tx = bx + pullX + cvx;
        nd.ty = by + pullY + cvy;
        nd.x += (nd.tx - nd.x) * LERP;
        nd.y += (nd.ty - nd.y) * LERP;
      }

      var rect = wrap.getBoundingClientRect();
      var scale = rect.width / w;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.save();
      ctx.translate(rect.width * 0.5, rect.height * 0.5);
      if (mobile && !reduced) ctx.translate(0, scrollParallax * scale);
      ctx.scale(scale, scale);
      ctx.translate(-w * 0.5, -h * 0.5);

      ctx.fillStyle = 'rgba(59, 13, 13, 0.14)';
      ctx.beginPath();
      ctx.arc(cx, cy, orbitR + 40, 0, Math.PI * 2);
      ctx.fill();

      function lineBright(x1, y1, x2, y2, baseA) {
        var ld = distToSeg(mxi, myi, x1, y1, x2, y2);
        var boost = Math.max(0, 1 - ld / 95) * 0.55;
        if (hasPointer) baseA += boost;
        return Math.min(0.92, baseA);
      }

      for (i = 0; i < N; i++) {
        var a = nodes[i];
        var b = nodes[(i + 1) % N];
        var chordBase = 0.05 + Math.sin(t * 0.22 + i * 0.4) * 0.02;
        var chord = chordBase * (1 - converge * 0.92) + (hasPointer ? Math.max(0, 1 - distToSeg(mxi, myi, a.x, a.y, b.x, b.y) / 70) * 0.18 : 0);
        ctx.strokeStyle = 'rgba(198, 161, 91, ' + chord + ')';
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      var rew = (Math.sin(t * 0.18) * 0.5 + 0.5) * (1 - converge);
      for (i = 0; i < N; i += 2) {
        var j = (i + 2) % N;
        var ai = nodes[i];
        var aj = nodes[j];
        var dCross = distToSeg(cx, cy, ai.x, ai.y, aj.x, aj.y);
        var nearCenter = Math.max(0, 1 - dCross / 52);
        var o = 0.03 * rew * (1 - converge * 0.5);
        o *= 0.28 + 0.72 * (1 - nearCenter * 0.92);
        ctx.strokeStyle = 'rgba(58, 107, 255, ' + o + ')';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(ai.x, ai.y);
        ctx.lineTo(aj.x, aj.y);
        ctx.stroke();
      }

      for (i = 0; i < N; i++) {
        var nd = nodes[i];
        var hub = 0.1 + converge * 0.22;
        if (hasPointer) hub += Math.max(0, 1 - Math.hypot(mxi - nd.x, myi - nd.y) / 100) * 0.25;
        hub = lineBright(center.x, center.y, nd.x, nd.y, hub);
        var shift = hasPointer ? Math.sin(t * 0.4 + i) * 0.4 * (1 - converge) : 0;
        var cxs = center.x + shift * 0.2;
        var cys = center.y + shift * 0.15;
        var dx = nd.x - cxs;
        var dy = nd.y - cys;
        var hdist = Math.hypot(dx, dy) || 1;
        var ux = dx / hdist;
        var uy = dy / hdist;
        var sx = cxs + ux * HUB_CLIP_R;
        var sy = cys + uy * HUB_CLIP_R;
        ctx.strokeStyle = 'rgba(198, 161, 91, ' + hub + ')';
        ctx.lineWidth = 0.9 + shift;
        ctx.shadowColor = 'rgba(198, 161, 91, ' + (0.12 + hub * 0.2) + ')';
        ctx.shadowBlur = 6 + hub * 8;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(nd.x, nd.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      for (i = 0; i < N; i++) {
        var nd2 = nodes[i];
        var dim = 0.35 + 0.55 * (1 - Math.min(1, Math.hypot(mxi - nd2.x, myi - nd2.y) / 140));
        if (!hasPointer) dim = 0.72 + 0.2 * Math.sin(t * 0.4 + nd2.phase);
        dim *= 1 - converge * 0.12;
        dim *= 0.88;
        var grd = ctx.createRadialGradient(nd2.x, nd2.y, 0, nd2.x, nd2.y, 18);
        grd.addColorStop(0, 'rgba(58, 107, 255, ' + (0.12 * dim) + ')');
        grd.addColorStop(0.55, 'rgba(58, 107, 255, ' + (0.05 * dim) + ')');
        grd.addColorStop(1, 'rgba(58, 107, 255, 0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(nd2.x, nd2.y, 18, 0, Math.PI * 2);
        ctx.fill();

        var sc = 1 + Math.max(0, 1 - Math.hypot(mxi - nd2.x, myi - nd2.y) / INFLUENCE_R) * 0.07;
        if (!hasPointer) sc = 1 + Math.sin(t * 0.5 + nd2.phase) * 0.02;
        sc = Math.min(1.08, sc);
        ctx.shadowColor = 'rgba(58, 107, 255, ' + (0.14 * dim) + ')';
        ctx.shadowBlur = 5 + dim * 4;
        ctx.fillStyle = 'rgba(244, 237, 224, ' + (0.1 + 0.48 * dim * sc) + ')';
        ctx.strokeStyle = 'rgba(198, 161, 91, ' + (0.12 + 0.3 * dim) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(nd2.x, nd2.y, satR * sc, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      var cg = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, CENTER_LABEL_R);
      cg.addColorStop(0, 'rgba(198, 161, 91, ' + (0.35 + converge * 0.15) + ')');
      cg.addColorStop(0.45, 'rgba(59, 13, 13, ' + (0.12 + converge * 0.08) + ')');
      cg.addColorStop(1, 'rgba(59, 13, 13, 0)');
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(center.x, center.y, CENTER_LABEL_R, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = 'rgba(198, 161, 91, 0.22)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = 'rgba(244, 237, 224, ' + (0.5 + converge * 0.18) + ')';
      ctx.strokeStyle = 'rgba(198, 161, 91, 0.4)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(center.x, center.y, centerR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      for (i = 0; i < N; i++) {
        var nd3 = nodes[i];
        var dimL = 0.35 + 0.55 * (1 - Math.min(1, Math.hypot(mxi - nd3.x, myi - nd3.y) / 140));
        if (!hasPointer) dimL = 0.72 + 0.2 * Math.sin(t * 0.4 + nd3.phase);
        dimL *= 1 - converge * 0.12;
        dimL *= 0.88;
        var lx2 = (nd3.x - cx) / orbitR;
        var ly2 = (nd3.y - cy) / orbitR;
        var tx2 = nd3.x + 22 * lx2;
        var ty2 = nd3.y + 22 * ly2 + (ly2 < -0.35 ? -2 : 14);
        ctx.font = '7px "DM Mono", monospace';
        ctx.shadowColor = 'rgba(3, 3, 3, 0.65)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = 'rgba(181, 170, 156, ' + (0.22 + 0.7 * dimL * (hasPointer ? 1 : 0.65)) + ')';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(nd3.label, tx2, ty2);
        ctx.shadowBlur = 0;
      }

      ctx.restore();

      if (running) {
        raf = global.requestAnimationFrame(frame);
      }
    }

    raf = global.requestAnimationFrame(frame);

    return {
      destroy: function () {
        running = false;
        if (raf) global.cancelAnimationFrame(raf);
        if (!mobile && !reduced) {
          wrap.removeEventListener('pointermove', onPointerMove);
          wrap.removeEventListener('pointerleave', onPointerLeave);
        }
        if (mobile && !reduced) {
          global.removeEventListener('scroll', onScrollParallax);
        }
      }
    };
  }

  function markResultsCtas() {
    var els = global.document.querySelectorAll('.home-diag-cta');
    if (els && els.length) {
      els.forEach(function (el) {
        try {
          var href = el.getAttribute('href') || '';
          if (href.indexOf('/results') !== -1) el.classList.add('sh-home-results-cta');
          else el.classList.remove('sh-home-results-cta');
        } catch (e) {}
      });
      return;
    }
    ['hero-cta-primary', 'diag-cta-primary', 'hero-rotate-cta'].forEach(function (id) {
      var el = global.document.getElementById(id);
      if (!el) return;
      try {
        var href = el.getAttribute('href') || '';
        if (href.indexOf('/results') !== -1) el.classList.add('sh-home-results-cta');
        else el.classList.remove('sh-home-results-cta');
      } catch (e) {}
    });
  }

  function initPauseHint(section) {
    var hint = global.document.getElementById('home-origin-pause');
    if (!hint || !section) return;
    var fired = false;
    var timer = null;

    function clear() {
      if (timer) {
        global.clearTimeout(timer);
        timer = null;
      }
    }

    function arm() {
      clear();
      timer = global.setTimeout(function () {
        if (fired) return;
        fired = true;
        hint.hidden = false;
        hint.classList.add('is-visible');
        global.setTimeout(function () {
          hint.classList.remove('is-visible');
          hint.hidden = true;
        }, 4200);
      }, 3000);
    }

    if (!('IntersectionObserver' in global)) return;

    var io = new global.IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && en.intersectionRatio > 0.35) arm();
          else clear();
        });
      },
      { threshold: [0, 0.35, 0.55] }
    );
    io.observe(section);
  }

  function initReduced() {
    try {
      return global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function isMobileCei() {
    try {
      return (
        global.matchMedia('(max-width: 768px)').matches || global.matchMedia('(pointer: coarse)').matches
      );
    } catch (e) {
      return global.innerWidth < 768;
    }
  }

  function init() {
    markResultsCtas();
    global.setTimeout(markResultsCtas, 400);
    global.setTimeout(markResultsCtas, 2000);

    var cei = global.document.getElementById('home-cei');
    var viz = global.document.getElementById('home-cei-viz');
    var origin = global.document.getElementById('home-origin');
    if (!global.gsap) return;
    if (!global.ScrollTrigger) return;
    if (!cei && !origin) return;

    var reduced = initReduced();
    var mobile = isMobileCei();
    try {
      global.gsap.registerPlugin(global.ScrollTrigger);
    } catch (e) {}

    var ceiEngine = null;

    if (cei) {
      if (viz) {
        ceiEngine = initCeiCanvas(viz, { mobile: mobile, reduced: reduced });
      }

      var line1 = cei.querySelector('[data-cei-line="1"]');
      var line2 = cei.querySelector('[data-cei-line="2"]');
      var lead = cei.querySelector('.home-cei__lead');
      var ctaW = cei.querySelector('.home-cei__cta-wrap');
      var ex = cei.querySelector('.home-cei__example');
      var cta = cei.querySelector('.home-cei__cta');

      var ceiIntroComplete = false;
      var ceiTl = null;

      function finishCeiIntro() {
        if (ceiIntroComplete) return;
        ceiIntroComplete = true;
        if (ceiTl) ceiTl.kill();
        global.gsap.set([line1, line2, viz].filter(Boolean), { autoAlpha: 1, y: 0, scale: 1 });
        if (line1) line1.classList.add('is-visible');
        if (line2) line2.classList.add('is-visible');
        global.gsap.to([lead, ctaW, ex].filter(Boolean), {
          autoAlpha: 1,
          y: 0,
          duration: 0.68,
          stagger: 0.06,
          ease: 'power2.out',
          onComplete: function () {
            if (cta) cta.classList.add('is-revealed');
          }
        });
      }

      if (viz && !mobile && !reduced) {
        viz.addEventListener(
          'pointerdown',
          function onceE() {
            finishCeiIntro();
          },
          { once: true }
        );
        viz.addEventListener(
          'pointermove',
          function onceM() {
            finishCeiIntro();
          },
          { once: true }
        );
      }

      if (reduced) {
        global.gsap.set([line1, line2, lead, ctaW, ex, viz].filter(Boolean), { autoAlpha: 1, y: 0 });
        if (line1) line1.classList.add('is-visible');
        if (line2) line2.classList.add('is-visible');
        if (cta) cta.classList.add('is-revealed');
        ceiIntroComplete = true;
      } else {
        ceiTl = global.gsap.timeline({
          scrollTrigger: {
            trigger: cei,
            start: 'top 82%',
            once: true
          },
          onComplete: function () {
            ceiIntroComplete = true;
            if (cta) cta.classList.add('is-revealed');
          }
        });

        if (line1) {
          ceiTl.to(line1, {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: 'power2.out',
            onStart: function () {
              line1.classList.add('is-visible');
            }
          });
        }
        if (line2) {
          ceiTl.to(
            line2,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              ease: 'power2.out',
              onStart: function () {
                line2.classList.add('is-visible');
              }
            },
            '-=0.35'
          );
        }
        if (viz) {
          ceiTl.fromTo(
            viz,
            { autoAlpha: 0, scale: 0.96 },
            { autoAlpha: 1, scale: 1, duration: 1.05, ease: 'power2.out' },
            '-=0.2'
          );
        }
        if (lead) {
          ceiTl.to(lead, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.45');
        }
        if (ctaW) {
          ceiTl.to(
            ctaW,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out'
            },
            '-=0.25'
          );
        }
        if (ex) {
          ceiTl.to(ex, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.35');
        }
      }
    }

    if (origin && !reduced) {
      var railFill = origin.querySelector('.home-origin__rail-fill');
      var rail = origin.querySelector('.home-origin__rail');
      var groups = global.gsap.utils.toArray(origin.querySelectorAll('.home-origin__group'));

      if (railFill) {
        global.gsap.fromTo(
          railFill,
          { height: '0%' },
          {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: origin.querySelector('.home-origin__shell') || origin,
              start: 'top 78%',
              end: 'bottom 42%',
              scrub: 0.45
            }
          }
        );
      }

      if (rail) {
        global.gsap.fromTo(
          rail,
          { autoAlpha: 0.42 },
          {
            autoAlpha: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: origin,
              start: 'top 84%',
              once: true
            }
          }
        );
      }

      if (groups.length) {
        global.gsap.set(groups, { autoAlpha: 0, y: 12 });
        global.gsap
          .timeline({
            scrollTrigger: {
              trigger: origin.querySelector('.home-origin__inner') || origin,
              start: 'top 78%',
              once: true
            }
          })
          .to(groups, {
            autoAlpha: 1,
            y: 0,
            duration: 0.78,
            stagger: 0.22,
            ease: 'power2.out'
          })
          .call(function () {
            origin.classList.add('is-origin-quiet');
          });
      }
    } else if (origin && reduced) {
      global.gsap.utils.toArray(origin.querySelectorAll('.home-origin__group')).forEach(function (g) {
        global.gsap.set(g, { autoAlpha: 1, y: 0 });
      });
      global.gsap.utils.toArray(origin.querySelectorAll('.home-origin__line')).forEach(function (line) {
        global.gsap.set(line, { autoAlpha: 1, y: 0 });
      });
    }

    initPauseHint(origin);

    global.StephuaryHomeFinale.destroyCei = function () {
      if (ceiEngine && ceiEngine.destroy) ceiEngine.destroy();
    };
  }

  global.StephuaryHomeFinale = {
    refreshCtas: markResultsCtas,
    destroyCei: function () {}
  };

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : this);
