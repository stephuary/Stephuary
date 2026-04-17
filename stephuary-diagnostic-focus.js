/**
 * During active diagnostic questions: html.sh-diagnostic-questions
 * Hides global nav / map / bottom flow bar (see stephuary-diagnostic-chrome.css).
 */
(function () {
  function syncDiagnosticChrome() {
    var flow = document.getElementById('flow');
    var summary = document.getElementById('summary');
    if (!flow) {
      document.documentElement.classList.remove('sh-diagnostic-questions');
      return;
    }
    var flowVisible = window.getComputedStyle(flow).display !== 'none';
    var sumVisible = summary && window.getComputedStyle(summary).display !== 'none';
    var inQuestions = flowVisible && !sumVisible;
    document.documentElement.classList.toggle('sh-diagnostic-questions', inQuestions);
  }

  function observe() {
    syncDiagnosticChrome();
    var flow = document.getElementById('flow');
    var summary = document.getElementById('summary');
    var opts = { attributes: true, attributeFilter: ['style', 'class'] };
    if (flow) new MutationObserver(syncDiagnosticChrome).observe(flow, opts);
    if (summary) new MutationObserver(syncDiagnosticChrome).observe(summary, opts);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observe);
  } else {
    observe();
  }
  window.addEventListener('pageshow', syncDiagnosticChrome);
})();
