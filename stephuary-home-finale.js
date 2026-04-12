/**
 * Homepage CEI constellation + origin finale (GSAP ScrollTrigger).
 */
(function (global) {
  var NODE_LABELS = ['Behavior', 'Environment', 'Time', 'Revenue', 'Friction', 'Attention', 'Decision'];
  var R = 132;
  var CX = 200;
  var CY = 200;

  function buildConstellation(root) {
    var host = root.querySelector && root.querySelector('.cei-constellation');
    if (!host || host.querySelector('svg')) return;
    var ns = 'http://www.w3.org/2000/svg';
    var svg = global.document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'cei-constellation__svg');
    svg.setAttribute('viewBox', '0 0 400 400');
    svg.setAttribute('aria-hidden', 'true');

    var defs = global.document.createElementNS(ns, 'defs');
    var filter = global.document.createElementNS(ns, 'filter');
    filter.setAttribute('id', 'cei-soft-glow');
    filter.setAttribute('x', '-40%');
    filter.setAttribute('y', '-40%');
    filter.setAttribute('width', '180%');
    filter.setAttribute('height', '180%');
    var blur = global.document.createElementNS(ns, 'feGaussianBlur');
    blur.setAttribute('stdDeviation', '3');
    blur.setAttribute('result', 'blur');
    filter.appendChild(blur);
    defs.appendChild(filter);
    svg.appendChild(defs);

    var spokesG = global.document.createElementNS(ns, 'g');
    spokesG.setAttribute('class', 'cei-spokes');

    var nodesG = global.document.createElementNS(ns, 'g');
    nodesG.setAttribute('class', 'cei-nodes-anim cei-breathe');

    var n = NODE_LABELS.length;
    for (var i = 0; i < n; i++) {
      var angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      var x = CX + R * Math.cos(angle);
      var y = CY + R * Math.sin(angle);

      var spoke = global.document.createElementNS(ns, 'line');
      spoke.setAttribute('class', 'cei-constellation__spoke');
      spoke.setAttribute('x1', String(CX));
      spoke.setAttribute('y1', String(CY));
      spoke.setAttribute('x2', String(x));
      spoke.setAttribute('y2', String(y));
      spokesG.appendChild(spoke);

      var g = global.document.createElementNS(ns, 'g');
      g.setAttribute('class', 'cei-node');
      g.setAttribute('data-cei-node', String(i));
      g.setAttribute('transform', 'translate(' + x + ',' + y + ')');

      var glow = global.document.createElementNS(ns, 'circle');
      glow.setAttribute('class', 'cei-node__glow');
      glow.setAttribute('r', '18');
      glow.setAttribute('cx', '0');
      glow.setAttribute('cy', '0');

      var dot = global.document.createElementNS(ns, 'circle');
      dot.setAttribute('class', 'cei-node__dot');
      dot.setAttribute('r', '6');
      dot.setAttribute('cx', '0');
      dot.setAttribute('cy', '0');

      var lx = (x - CX) / R;
      var ly = (y - CY) / R;
      var tx = 14 * lx;
      var ty = 14 * ly + (ly < -0.5 ? -4 : 16);

      var text = global.document.createElementNS(ns, 'text');
      text.setAttribute('class', 'cei-node__label');
      text.setAttribute('x', String(tx));
      text.setAttribute('y', String(ty));
      text.setAttribute('text-anchor', 'middle');
      text.textContent = NODE_LABELS[i];

      g.appendChild(glow);
      g.appendChild(dot);
      g.appendChild(text);
      nodesG.appendChild(g);
    }

    svg.appendChild(spokesG);
    svg.appendChild(nodesG);
    host.insertBefore(svg, host.firstChild);
  }

  function bindProximity(wrap) {
    if (!wrap) return;
    var nodes = wrap.querySelectorAll('.cei-node');
    var maxD = 120;

    function onMove(ev) {
      var rect = wrap.getBoundingClientRect();
      var mx = ((ev.clientX - rect.left) / rect.width) * 400;
      var my = ((ev.clientY - rect.top) / rect.height) * 400;
      nodes.forEach(function (g) {
        var t = g.getAttribute('transform') || '';
        var m = t.match(/translate\(\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
        if (!m) return;
        var nx = parseFloat(m[1]);
        var ny = parseFloat(m[2]);
        var d = Math.hypot(mx - nx, my - ny);
        var scale = Math.max(rect.width, rect.height) / 400;
        var thr = maxD * scale;
        if (d < thr) {
          g.classList.add('is-near');
        } else {
          g.classList.remove('is-near');
        }
      });
    }

    function onLeave() {
      nodes.forEach(function (g) {
        g.classList.remove('is-near');
      });
    }

    wrap.addEventListener('mousemove', onMove, { passive: true });
    wrap.addEventListener('mouseleave', onLeave, { passive: true });
  }

  function markResultsCtas() {
    ['hero-cta-primary', 'diag-cta-primary'].forEach(function (id) {
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

    var io = new IntersectionObserver(
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

  function init() {
    var cei = global.document.getElementById('home-cei');
    var viz = global.document.getElementById('home-cei-viz');
    var origin = global.document.getElementById('home-origin');
    if (!cei || !global.gsap) return;
    if (!global.ScrollTrigger) return;

    var reduced = initReduced();
    try {
      global.gsap.registerPlugin(global.ScrollTrigger);
    } catch (e) {}

    markResultsCtas();
    global.setTimeout(markResultsCtas, 400);
    global.setTimeout(markResultsCtas, 2000);

    if (viz) {
      buildConstellation(viz);
      bindProximity(viz);
    }

    var line1 = cei.querySelector('[data-cei-line="1"]');
    var line2 = cei.querySelector('[data-cei-line="2"]');
    var lead = cei.querySelector('.home-cei__lead');
    var ctaW = cei.querySelector('.home-cei__cta-wrap');
    var ex = cei.querySelector('.home-cei__example');
    var cta = cei.querySelector('.home-cei__cta');

    if (reduced) {
      [line1, line2, lead, ctaW, ex, viz].forEach(function (el) {
        if (!el) return;
        global.gsap.set(el, { autoAlpha: 1, y: 0 });
      });
      if (line1) line1.classList.add('is-visible');
      if (line2) line2.classList.add('is-visible');
      if (cta) cta.classList.add('is-revealed');
    } else {
      var tl = global.gsap.timeline({
        scrollTrigger: {
          trigger: cei,
          start: 'top 82%',
          once: true
        }
      });

      if (line1) {
        tl.to(line1, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power2.out', onStart: function () {
          line1.classList.add('is-visible');
        } });
      }
      if (line2) {
        tl.to(
          line2,
          { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power2.out', onStart: function () {
            line2.classList.add('is-visible');
          } },
          '-=0.35'
        );
      }
      if (viz) {
        tl.fromTo(
          viz,
          { autoAlpha: 0, scale: 0.96 },
          { autoAlpha: 1, scale: 1, duration: 1.05, ease: 'power2.out' },
          '-=0.2'
        );
      }
      if (lead) {
        tl.to(lead, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.45');
      }
      if (ctaW) {
        tl.to(
          ctaW,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            onComplete: function () {
              if (cta) cta.classList.add('is-revealed');
            }
          },
          '-=0.25'
        );
      }
      if (ex) {
        tl.to(ex, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.35');
      }
    }

    if (origin && !reduced) {
      var railFill = origin.querySelector('.home-origin__rail-fill');
      var lines = global.gsap.utils.toArray(origin.querySelectorAll('.home-origin__line'));

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

      lines.forEach(function (line, idx) {
        global.gsap.fromTo(
          line,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 88%',
              once: true,
              onEnter: function () {
                for (var j = 0; j < idx; j++) {
                  lines[j].classList.add('is-dimmed');
                }
              }
            }
          }
        );
      });
    } else if (origin && reduced) {
      global.gsap.utils.toArray(origin.querySelectorAll('.home-origin__line')).forEach(function (line) {
        global.gsap.set(line, { autoAlpha: 1, y: 0 });
      });
    }

    initPauseHint(origin);
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.StephuaryHomeFinale = { refreshCtas: markResultsCtas };
})(typeof window !== 'undefined' ? window : this);
