/**
 * Binds .sh-site-form[data-form-type] to POST /api/form-submit (no secrets in browser).
 */
(function (global) {
  var ENDPOINT = '/api/form-submit';
  var MSG_OK = 'Submitted.';
  var MSG_ERR = "Something didn't submit. Please try again.";

  function postForm(formType, data) {
    var payload = Object.assign({}, data, {
      formType: formType,
      sourcePage: global.location && global.location.href,
      referrer: global.document && global.document.referrer,
      timestamp: new Date().toISOString()
    });
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.json().then(
        function (json) {
          return { res: res, json: json };
        },
        function () {
          return { res: res, json: null };
        }
      );
    });
  }

  function setStatus(el, ok) {
    if (!el) return;
    el.hidden = false;
    el.textContent = ok ? MSG_OK : MSG_ERR;
    el.classList.add(ok ? 'sh-site-form__status--success' : 'sh-site-form__status--error');
    el.classList.remove(ok ? 'sh-site-form__status--error' : 'sh-site-form__status--success');
  }

  function clearStatus(el) {
    if (!el) return;
    el.hidden = true;
    el.textContent = '';
    el.classList.remove('sh-site-form__status--success', 'sh-site-form__status--error');
  }

  function gatherFormData(form) {
    var fd = new FormData(form);
    var o = {};
    fd.forEach(function (v, k) {
      o[k] = typeof v === 'string' ? v.trim() : String(v).trim();
    });
    return o;
  }

  function bindForms() {
    if (!global.document || !global.document.querySelectorAll) return;
    var forms = global.document.querySelectorAll('form.sh-site-form[data-form-type]');
    for (var i = 0; i < forms.length; i++) {
      (function (form) {
        if (form.__shFormBound) return;
        form.__shFormBound = true;
        var type = form.getAttribute('data-form-type');
        var statusEl = form.querySelector('[data-sh-form-status]');
        var submitBtn = form.querySelector('[type="submit"]');
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          clearStatus(statusEl);
          var data = gatherFormData(form);
          if (submitBtn) submitBtn.disabled = true;
          postForm(type, data)
            .then(function (out) {
              var ok = !!(out.res && out.res.ok && out.json && out.json.ok);
              setStatus(statusEl, ok);
              if (ok) form.reset();
            })
            .catch(function () {
              setStatus(statusEl, false);
            })
            .then(function () {
              if (submitBtn) submitBtn.disabled = false;
            });
        });
      })(forms[i]);
    }
  }

  function onReady(fn) {
    if (!global.document) return;
    if (global.document.readyState === 'loading') global.document.addEventListener('DOMContentLoaded', fn);
    else global.setTimeout(fn, 0);
  }

  onReady(bindForms);

  global.STEPHUARY_FORM_SUBMIT = {
    ENDPOINT: ENDPOINT,
    MSG_OK: MSG_OK,
    MSG_ERR: MSG_ERR,
    postForm: postForm,
    bindForms: bindForms
  };
})(typeof window !== 'undefined' ? window : this);
