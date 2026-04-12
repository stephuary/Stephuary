/**
 * Unified output screen for Direction System (room-02) and Revenue System (monetize).
 */
(function (global) {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function truncate(t, n) {
    var x = String(t || '').trim();
    if (x.length <= n) return x;
    return x.slice(0, n - 1).trim() + '…';
  }

  function ceiStrip(hotId) {
    var ids = ['decision', 'behavior', 'environment', 'time', 'revenue', 'friction'];
    var html =
      '<div class="sys-output__cei" role="presentation"><span class="sys-output__cei-pulse" aria-hidden="true"></span>';
    ids.forEach(function (id) {
      var label = id.charAt(0).toUpperCase() + id.slice(1);
      var hot = id === hotId;
      html +=
        '<span class="sys-output__cei-node' +
        (hot ? ' sys-output__cei-node--hot' : '') +
        '">' +
        esc(label) +
        '</span>';
    });
    html += '</div>';
    return html;
  }

  function section(label, inner) {
    return (
      '<section class="sys-output__block"><p class="sys-output__block-label">' +
      esc(label) +
      '</p>' +
      inner +
      '</section>'
    );
  }

  function chainRow(k, v) {
    return (
      '<div class="sys-output__chain-row"><span class="sys-output__chain-k">' +
      esc(k) +
      '</span><span class="sys-output__chain-arr" aria-hidden="true">→</span><span class="sys-output__chain-v">' +
      esc(v) +
      '</span></div>'
    );
  }

  function mountDirection(container, data, ctaHtml) {
    if (!container) return;
    var d = data || {};
    var inner =
      '<article class="sys-output sys-output--direction">' +
      ceiStrip('decision') +
      '<header class="sys-output__head">' +
      '<p class="sys-output__eyebrow">Your result</p>' +
      '<h1 class="sys-output__title sys-output__title--pulse">This is your direction</h1>' +
      '<p class="sys-output__sub">Based on what you entered</p>' +
      '</header>' +
      '<div class="sys-output__blocks">' +
      section(
        'Direction',
        '<div class="sys-output__chain">' +
          chainRow('Identity', d.identity || '—') +
          chainRow('Focus', d.focus || '—') +
          chainRow('Ignore', d.ignore || '—') +
          '</div>'
      ) +
      section('Why this works', '<p class="sys-output__p">' + esc(d.why || '—') + '</p>') +
      section('Fit', '<p class="sys-output__p">' + esc(d.fit || '—') + '</p>') +
      section(
        'Start here',
        '<p class="sys-output__p sys-output__p--key">' + esc(d.start || '—') + '</p>'
      ) +
      '</div>' +
      (ctaHtml || '') +
      '</article>';
    container.innerHTML = inner;
  }

  function textById(id) {
    var e = global.document.getElementById(id);
    if (!e) return '';
    return e.innerText.replace(/\s+/g, ' ').trim();
  }

  function firstP(html) {
    var d = global.document.createElement('div');
    d.innerHTML = html;
    var p = d.querySelector('p');
    return p ? p.textContent.trim() : '';
  }

  function weekActionsFromS2() {
    var el = global.document.getElementById('out-s2');
    var out = [];
    if (el) {
      el.querySelectorAll('li').forEach(function (li) {
        var t = li.textContent.trim();
        if (t && out.length < 3) out.push(t);
      });
    }
    while (out.length < 3) out.push('—');
    return out;
  }

  function mountRevenue(container, ctaHtml) {
    if (!container) return;
    var startHere = textById('out-s7') || '—';
    var week = weekActionsFromS2();
    var ignore = truncate(textById('out-s3'), 280);
    var o1 = truncate(textById('out-s1'), 140);
    var o2 = truncate(textById('out-s2'), 140);
    var o3 = truncate(textById('out-s3'), 140);
    var o4 = truncate(textById('out-s4'), 140);
    var leverageAction = textById('out-s5');
    var s4html = global.document.getElementById('out-s4');
    var reason = s4html ? firstP(s4html.innerHTML) : '';
    if (!reason) reason = truncate(textById('out-s4'), 200);
    var posLine = textById('out-s5');
    var audience = truncate(textById('out-s3'), 220);

    var fastestHead = truncate(textById('out-s1'), 320);

    var weekOl =
      '<ol class="sys-output__list-num">' +
      week
        .map(function (w) {
          return '<li>' + esc(w) + '</li>';
        })
        .join('') +
      '</ol>';

    var fastestBlock =
      '<p class="sys-output__p sys-output__p--key" style="margin-bottom:14px">' +
      esc(fastestHead || '—') +
      '</p>' +
      '<div class="sys-output__chain">' +
      chainRow('Start here', startHere) +
      '</div>' +
      '<p class="sys-output__block-label" style="margin-top:16px">This week</p>' +
      weekOl +
      '<p class="sys-output__block-label" style="margin-top:16px">Ignore</p>' +
      '<p class="sys-output__p">' +
      esc(ignore || '—') +
      '</p>';

    var inner =
      '<article class="sys-output sys-output--revenue">' +
      ceiStrip('revenue') +
      '<header class="sys-output__head">' +
      '<p class="sys-output__eyebrow">Your result</p>' +
      '<h1 class="sys-output__title sys-output__title--pulse">This is your revenue path</h1>' +
      '<p class="sys-output__sub">Based on what you entered</p>' +
      '</header>' +
      '<div class="sys-output__blocks">' +
      section('Fastest path to cash', fastestBlock) +
      section(
        'Decision order',
        '<ol class="sys-output__list-num">' +
          '<li>' +
          esc(o1 || '—') +
          '</li>' +
          '<li>' +
          esc(o2 || '—') +
          '</li>' +
          '<li>' +
          esc(o3 || '—') +
          '</li>' +
          '<li>' +
          esc(o4 || '—') +
          '</li>' +
          '</ol>'
      ) +
      section(
        'Leverage point',
        '<dl class="sys-output__dl"><dt>Highest return action</dt><dd>' +
          esc(leverageAction || '—') +
          '</dd><dt>Why</dt><dd>' +
          esc(reason || '—') +
          '</dd></dl>'
      ) +
      section(
        'Position clarity',
        '<dl class="sys-output__dl"><dt>One-line positioning</dt><dd>' +
          esc(posLine || '—') +
          '</dd><dt>Audience</dt><dd>' +
          esc(audience || '—') +
          '</dd></dl>'
      ) +
      '</div>' +
      (ctaHtml || '') +
      '</article>';
    container.innerHTML = inner;
  }

  global.StephuarySystemOutput = {
    mountDirection: mountDirection,
    mountRevenue: mountRevenue,
    esc: esc
  };
})(typeof window !== 'undefined' ? window : this);
