// Vercel serverless: secure form intake → Resend notification.
// Diagnostic capture uses /api/diagnostic-capture so it never routes through Resend.
// Env: RESEND_API_KEY, RESEND_FROM_EMAIL, FORM_NOTIFICATION_EMAIL.

const ALLOWED_TYPES = new Set(['contact', 'snapshot-interest', 'club-application']);

function readJsonBody(req) {
  if (req.body != null && typeof req.body === 'string') {
    try {
      return Promise.resolve(req.body ? JSON.parse(req.body) : {});
    } catch (e) {
      return Promise.reject(e);
    }
  }
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return Promise.resolve(req.body);
  }
  return new Promise(function (resolve, reject) {
    var chunks = [];
    req.on('data', function (c) {
      chunks.push(c);
    });
    req.on('end', function () {
      try {
        var raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function escHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function normalizeEmail(v) {
  if (typeof v !== 'string') return '';
  return v.trim().toLowerCase();
}

var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePayload(body) {
  var formType = body && body.formType;
  if (!ALLOWED_TYPES.has(formType)) {
    return { error: 'Invalid form type' };
  }
  var name = isNonEmptyString(body.name) ? body.name.trim() : '';
  var email = normalizeEmail(body.email);
  if (!name) return { error: 'Name is required' };
  if (!email || !EMAIL_RE.test(email)) return { error: 'Valid email is required' };

  if (formType === 'contact') {
    var message = isNonEmptyString(body.message) ? body.message.trim() : '';
    if (!message) return { error: 'Message is required' };
    return {
      ok: true,
      data: { formType: formType, name: name, email: email, message: message }
    };
  }
  if (formType === 'snapshot-interest') {
    var note = isNonEmptyString(body.note) ? body.note.trim() : '';
    return {
      ok: true,
      data: { formType: formType, name: name, email: email, note: note }
    };
  }
  if (formType === 'club-application') {
    var p1 = isNonEmptyString(body.application_p1) ? body.application_p1.trim() : '';
    var p2 = isNonEmptyString(body.application_p2) ? body.application_p2.trim() : '';
    if (!p1 || !p2) return { error: 'Both application paragraphs are required' };
    return {
      ok: true,
      data: { formType: formType, name: name, email: email, application_p1: p1, application_p2: p2 }
    };
  }
  return { error: 'Invalid form type' };
}

function buildEmailHtml(meta, fields) {
  var rows = Object.keys(fields).map(function (k) {
    return (
      '<tr><td style="padding:8px 12px;border:1px solid #e6e0d6;background:#faf7f2;font-weight:600;width:180px;">' +
      escHtml(k) +
      '</td><td style="padding:8px 12px;border:1px solid #e6e0d6;background:#fff;white-space:pre-wrap;">' +
      escHtml(fields[k]) +
      '</td></tr>'
    );
  });
  return (
    '<p style="font-family:system-ui,sans-serif;font-size:15px;color:#111;">New Stephuary form submission</p>' +
    '<table style="border-collapse:collapse;max-width:720px;font-family:system-ui,sans-serif;font-size:14px;">' +
    rows.join('') +
    '</table>' +
    '<p style="font-family:system-ui,sans-serif;font-size:12px;color:#666;margin-top:16px;">' +
    escHtml(meta.footer) +
    '</p>'
  );
}

async function sendResendEmail(subject, html) {
  var key = process.env.RESEND_API_KEY;
  var from = process.env.RESEND_FROM_EMAIL;
  var toRaw = process.env.FORM_NOTIFICATION_EMAIL;
  if (!key || !from || !toRaw) {
    return { ok: false, reason: 'Email not configured' };
  }
  var toList = toRaw
    .split(',')
    .map(function (s) {
      return s.trim();
    })
    .filter(Boolean);
  if (!toList.length) return { ok: false, reason: 'No notification recipients' };

  var res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: from,
      to: toList,
      subject: subject,
      html: html
    })
  });
  if (!res.ok) {
    return { ok: false, reason: 'Resend error' };
  }
  return { ok: true };
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    var body;
    try {
      body = await readJsonBody(req);
    } catch (eJ) {
      return res.status(400).json({ ok: false, error: 'Invalid JSON' });
    }

    var checked = validatePayload(body || {});
    if (!checked.ok) {
      return res.status(400).json({ ok: false, error: checked.error });
    }

    var d = checked.data;
    var ts =
      (body && isNonEmptyString(body.timestamp) && body.timestamp.trim()) ||
      new Date().toISOString();
    var page =
      (body && isNonEmptyString(body.sourcePage) && body.sourcePage.trim()) ||
      (body && isNonEmptyString(body.page) && body.page.trim()) ||
      '';

    var typeLabel = {
      contact: 'Contact',
      'snapshot-interest': 'Snapshot interest',
      'club-application': '.5% Club application'
    }[d.formType];

    var fields = {
      'Form type': typeLabel,
      Name: d.name,
      Email: d.email,
      'Page source': page || '(not provided)',
      Timestamp: ts
    };

    if (d.formType === 'contact') {
      fields.Message = d.message;
    } else if (d.formType === 'snapshot-interest') {
      if (d.note) fields.Note = d.note;
    } else if (d.formType === 'club-application') {
      fields['Application paragraph 1'] = d.application_p1;
      fields['Application paragraph 2'] = d.application_p2;
    }

    var subject = '[Stephuary] ' + typeLabel + ' — ' + d.name;
    var html = buildEmailHtml({ footer: 'Sent from stephuary.com form handler' }, fields);

    var sent = await sendResendEmail(subject, html);
    if (!sent.ok) {
      return res.status(503).json({ ok: false, error: 'Notification delivery failed' });
    }

    res.setHeader('Cache-Control', 'private, max-age=0, no-store');
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Internal error' });
  }
};
