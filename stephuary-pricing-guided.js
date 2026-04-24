/**
 * Fixed action for visitors who have not completed the free diagnostic.
 * Post-diagnostic: bar is not injected (CTA left to page content).
 */
(function () {
  if (!/\/pricing\/?$/.test(String(global.location && global.location.pathname || ''))) return;

  function hasDiagnosticResult() {
    try {
      return !!global.localStorage.getItem('diagnosticResults');
    } catch (e) {
      return false;
    }
  }

  function mount() {
    if (hasDiagnosticResult()) return;
    if (global.document.getElementById('pricing-guided-sticky')) return;

    var bar = global.document.createElement('div');
    bar.id = 'pricing-guided-sticky';
    bar.className = 'pricing-guided-sticky';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Next step');
    var a = global.document.createElement('a');
    a.className = 'btn btn--primary';
    a.href = '/capture';
    a.textContent = 'Run the Diagnostic';
    bar.appendChild(a);
    global.document.body.appendChild(bar);
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})(typeof window !== 'undefined' ? window : this);
