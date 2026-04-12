/**
 * FounderReveal — rare floating acknowledgment (results + pricing only).
 */
(function (global) {
  var STORAGE_SEEN_DIAG = 'founderRevealSeenDiagnostic';
  var STORAGE_CLOSED_DIAG = 'founderRevealClosedDiagnostic';
  var STORAGE_SEEN_PRICE = 'founderRevealSeenPricing';
  var STORAGE_CLOSED_PRICE = 'founderRevealClosedPricing';

  var reduceMotion =
    global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function normPath(p) {
    if (!p || p === '') return '/';
    var x = String(p).replace(/\/$/, '') || '/';
    return x;
  }

  function lsGet(k) {
    try {
      return sessionStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }

  function lsSet(k, v) {
    try {
      sessionStorage.setItem(k, v);
    } catch (e) {}
  }

  function rectsOverlap(a, b) {
    if (!a || !b || a.width < 2 || b.width < 2) return false;
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }

  function getPanelEl() {
    return global.document.getElementById('sh-live-panel');
  }

  function panelVisible(panel) {
    if (!panel) return false;
    if (panel.getAttribute('hidden') !== null) return false;
    /* Live panel uses opacity + .sh-live-panel--visible, not [hidden] on the root. */
    if (!panel.classList.contains('sh-live-panel--visible')) return false;
    var r = panel.getBoundingClientRect();
    return r.width > 20 && r.height > 20;
  }

  function getHeroAvoidRects() {
    var sel = [
      '.pricing-hero',
      '.sys-compact',
      '.results-cta-pri',
      '#results-primary-cta',
      '.pricing-hero a.tier-cta',
      '.hero .btn--pri'
    ];
    var out = [];
    sel.forEach(function (s) {
      try {
        global.document.querySelectorAll(s).forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.width > 20 && r.height > 12) out.push(r);
        });
      } catch (e) {}
    });
    return out;
  }

  function overlapsAny(rect, list) {
    for (var i = 0; i < list.length; i++) {
      if (rectsOverlap(rect, list[i])) return true;
    }
    return false;
  }

  function isMobileViewport() {
    return global.innerWidth < 768;
  }

  function positionInstance(root) {
    if (!root) return;
    var panel = getPanelEl();
    var panelR = panelVisible(panel) ? panel.getBoundingClientRect() : null;
    var vw = global.innerWidth;
    var vh = global.innerHeight;
    var mobile = isMobileViewport();
    var side = mobile ? 16 : 24;
    var gap = 16;
    var baseBottom = mobile ? 16 : 24;

    root.style.left = '';
    root.style.right = '';
    root.style.bottom = '';
    root.style.top = '';
    root.style.width = '';
    root.removeAttribute('data-fr-anchor');

    var w = mobile
      ? Math.min(Math.max(110, Math.min(160, vw * 0.32)), vw - 32)
      : Math.min(Math.max(160, Math.min(220, vw * 0.16)), vw - 32);
    root.style.width = w + 'px';

    function place(anchorRight, bottomPx) {
      if (anchorRight) {
        root.style.right = side + 'px';
        root.style.left = 'auto';
        root.setAttribute('data-fr-anchor', 'right');
      } else {
        root.style.left = side + 'px';
        root.style.right = 'auto';
        root.removeAttribute('data-fr-anchor');
      }
      root.style.bottom = bottomPx + 'px';
      root.style.top = 'auto';
    }

    var anchorRight = false;
    var bottomPx = baseBottom;

    if (mobile && panelR) {
      bottomPx = Math.max(baseBottom, vh - panelR.top + gap);
    }

    place(anchorRight, bottomPx);

    var r = root.getBoundingClientRect();
    var avoid = getHeroAvoidRects();

    if (panelR && rectsOverlap(r, panelR)) {
      anchorRight = true;
      place(anchorRight, bottomPx);
      r = root.getBoundingClientRect();
      if (rectsOverlap(r, panelR)) {
        bottomPx = Math.max(baseBottom, vh - panelR.top + gap);
        place(anchorRight, bottomPx);
        r = root.getBoundingClientRect();
        if (rectsOverlap(r, panelR)) {
          bottomPx = Math.max(baseBottom, vh - panelR.top - r.height - gap);
          place(anchorRight, bottomPx);
        }
      }
    }

    r = root.getBoundingClientRect();
    if (overlapsAny(r, avoid)) {
      bottomPx = bottomPx + 56;
      place(anchorRight, bottomPx);
    }

    r = root.getBoundingClientRect();
    if (r.top < 8) {
      root.style.bottom = 'auto';
      root.style.top = side + 'px';
    }
    if (r.right > vw - 4) {
      root.style.width = Math.max(96, vw - side * 2) + 'px';
    }
    if (panelR && rectsOverlap(root.getBoundingClientRect(), panelR)) {
      var rNow = root.getBoundingClientRect();
      var nw = Math.max(96, rNow.width * 0.85);
      root.style.width = nw + 'px';
      place(anchorRight, Math.max(baseBottom, vh - panelR.top - root.getBoundingClientRect().height - gap));
    }
  }

  function createShell(options) {
    var root = global.document.createElement('div');
    root.id = 'sh-founder-reveal';
    root.className = 'sh-founder-reveal';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', 'Founder note');

    var inner = global.document.createElement('div');
    inner.className = 'sh-founder-reveal__inner';

    var closeBtn = global.document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'sh-founder-reveal__close';
    closeBtn.setAttribute('aria-label', 'Dismiss');
    closeBtn.innerHTML = '\u00d7';

    var imgWrap = global.document.createElement('div');
    imgWrap.className = 'sh-founder-reveal__img-wrap';
    var img = global.document.createElement('img');
    img.src = options.assetSrc || '/founder-reveal.png';
    img.alt = '';
    img.decoding = 'async';
    img.loading = 'lazy';
    imgWrap.appendChild(img);

    var msg = global.document.createElement('p');
    msg.className = 'sh-founder-reveal__msg';
    msg.textContent = options.message || '';

    inner.appendChild(closeBtn);
    inner.appendChild(imgWrap);
    inner.appendChild(msg);

    if (options.ctaLabel) {
      var cta = global.document.createElement('button');
      cta.type = 'button';
      cta.className = 'sh-founder-reveal__cta magnetic';
      cta.textContent = options.ctaLabel;
      inner.appendChild(cta);
    }

    root.appendChild(inner);
    global.document.body.appendChild(root);

    return { root: root, closeBtn: closeBtn, cta: inner.querySelector('.sh-founder-reveal__cta') };
  }

  function FounderRevealController(ctx, options) {
    this.ctx = ctx;
    this.options = options || {};
    this.shell = null;
    this.scheduled = null;
    this.dwellTimer = null;
    this.idleTimer = null;
    this.idleCheck = null;
    this.lastActivity = Date.now();
    this.memoryBlock = false;
    this._onResize = this._onResize.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onActivity = this._onActivity.bind(this);
  }

  FounderRevealController.prototype._storageKeys = function () {
    if (this.ctx === 'diagnostic') {
      return { seen: STORAGE_SEEN_DIAG, closed: STORAGE_CLOSED_DIAG };
    }
    return { seen: STORAGE_SEEN_PRICE, closed: STORAGE_CLOSED_PRICE };
  };

  FounderRevealController.prototype._canShow = function () {
    var k = this._storageKeys();
    if (lsGet(k.seen) === '1' || lsGet(k.closed) === '1') return false;
    if (this.memoryBlock) return false;
    return true;
  };

  FounderRevealController.prototype._markSeen = function () {
    var k = this._storageKeys();
    lsSet(k.seen, '1');
    if (lsGet(k.seen) !== '1') this.memoryBlock = true;
  };

  FounderRevealController.prototype._markClosed = function () {
    var k = this._storageKeys();
    lsSet(k.closed, '1');
    this.memoryBlock = true;
  };

  FounderRevealController.prototype._onResize = function () {
    if (this.shell) positionInstance(this.shell.root);
  };

  FounderRevealController.prototype._onScroll = function () {
    this._onResize();
  };

  FounderRevealController.prototype._onActivity = function () {
    this.lastActivity = Date.now();
  };

  FounderRevealController.prototype._clearTimers = function () {
    if (this.dwellTimer) {
      clearTimeout(this.dwellTimer);
      this.dwellTimer = null;
    }
    if (this.idleTimer) {
      clearInterval(this.idleTimer);
      this.idleTimer = null;
    }
  };

  FounderRevealController.prototype.tryShow = function () {
    var self = this;
    if (!self._canShow()) return;
    if (self.shell) return;

    self._clearTimers();

    if (self.ctx === 'pricing') {
      ['mousemove', 'keydown', 'scroll', 'touchstart', 'click', 'pointerdown'].forEach(function (ev) {
        global.document.removeEventListener(ev, self._onActivity, { passive: true });
      });
    }

    self.shell = createShell({
      message: self.options.message,
      assetSrc: self.options.assetSrc,
      ctaLabel: self.options.ctaLabel
    });

    var root = self.shell.root;

    self.shell.closeBtn.addEventListener('click', function () {
      self.dismiss();
    });

    if (self.shell.cta && self.options.onCta) {
      self.shell.cta.addEventListener('click', function (e) {
        e.preventDefault();
        self.options.onCta();
      });
    }

    self._markSeen();

    requestAnimationFrame(function () {
      positionInstance(root);
      if (!reduceMotion) {
        requestAnimationFrame(function () {
          root.classList.add('sh-founder-reveal--visible');
        });
      } else {
        root.classList.add('sh-founder-reveal--visible');
      }
    });

    global.addEventListener('resize', self._onResize, { passive: true });
    global.addEventListener('scroll', self._onScroll, { passive: true });

    if (global.ResizeObserver) {
      var panel = getPanelEl();
      if (panel) {
        self.resizeObs = new ResizeObserver(function () {
          self._onResize();
        });
        self.resizeObs.observe(panel);
      }
    }
  };

  FounderRevealController.prototype.dismiss = function () {
    var self = this;
    self._markClosed();
    if (!self.shell) return;
    var root = self.shell.root;
    root.classList.remove('sh-founder-reveal--visible');
    window.setTimeout(function () {
      if (root.parentNode) root.parentNode.removeChild(root);
      self.shell = null;
    }, 280);
    global.removeEventListener('resize', self._onResize, { passive: true });
    global.removeEventListener('scroll', self._onScroll, { passive: true });
    if (self.resizeObs) {
      try {
        self.resizeObs.disconnect();
      } catch (e) {}
      self.resizeObs = null;
    }
  };

  FounderRevealController.prototype.scheduleDiagnostic = function () {
    var self = this;
    if (!self._canShow()) return;
    var delay = reduceMotion ? 400 : 800 + Math.floor(Math.random() * 700);
    if (self.scheduled) clearTimeout(self.scheduled);
    self.scheduled = setTimeout(function () {
      self.tryShow();
    }, delay);
  };

  FounderRevealController.prototype.startPricingWatch = function () {
    var self = this;
    if (normPath(global.location.pathname) !== '/pricing') return;
    if (reduceMotion) return;
    if (!self._canShow()) return;

    var dwellMs = 18000 + Math.floor(Math.random() * 7000);

    self.dwellTimer = setTimeout(function () {
      self.tryShow();
    }, dwellMs);

    var idleMin = 12000;
    var idleMax = 18000;
    var idleThreshold = idleMin + Math.floor(Math.random() * (idleMax - idleMin));

    ['mousemove', 'keydown', 'scroll', 'touchstart', 'click', 'pointerdown'].forEach(function (ev) {
      global.document.addEventListener(ev, self._onActivity, { passive: true });
    });

    self.idleTimer = setInterval(function () {
      if (self.shell) return;
      if (!self._canShow()) {
        self._clearTimers();
        return;
      }
      if (Date.now() - self.lastActivity >= idleThreshold) {
        self.tryShow();
      }
    }, 400);
  };

  var diagnosticCtrl = null;
  var pricingCtrl = null;

  function scrollToRecommendedTier() {
    var el =
      global.document.querySelector('.inner-tier--recommended') ||
      global.document.querySelector('[data-tier-id].inner-tier--recommended');
    if (!el) el = global.document.getElementById('pricing-groups');
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  global.StephuaryFounderReveal = {
    scheduleDiagnostic: function () {
      if (normPath(global.location.pathname) !== '/results') return;
      if (!diagnosticCtrl) {
        diagnosticCtrl = new FounderRevealController('diagnostic', {
          message: 'You finished. Good. Now use it.',
          assetSrc: '/founder-reveal.png'
        });
      }
      diagnosticCtrl.scheduleDiagnostic();
    },

    initPricing: function () {
      if (normPath(global.location.pathname) !== '/pricing') return;
      if (!pricingCtrl) {
        pricingCtrl = new FounderRevealController('pricing', {
          message: 'Still here. Pick one and move.',
          assetSrc: '/founder-reveal.png',
          ctaLabel: 'See recommended next step',
          onCta: scrollToRecommendedTier
        });
      }
      pricingCtrl.startPricingWatch();
    }
  };

  function bootPricing() {
    if (normPath(global.location.pathname) === '/pricing') {
      global.StephuaryFounderReveal.initPricing();
    }
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', bootPricing);
  } else {
    bootPricing();
  }
})(typeof window !== 'undefined' ? window : this);
