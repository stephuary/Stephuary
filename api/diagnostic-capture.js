const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    req.on('data', function (chunk) {
      chunks.push(chunk);
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

function stringValue(v) {
  return typeof v === 'string' ? v.trim() : '';
}

function normalizeEmail(v) {
  return stringValue(v).toLowerCase();
}

function firstNameFrom(name) {
  var n = stringValue(name);
  if (!n) return '';
  return n.split(/\s+/)[0] || n;
}

function fieldValue(v) {
  if (v == null) return '';
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'string') return v.trim();
  try {
    return JSON.stringify(v).slice(0, 2000);
  } catch (e) {
    return '';
  }
}

function mailerLiteHeaders(token, includeJson) {
  var headers = {
    Authorization: 'Bearer ' + token,
    Accept: 'application/json'
  };
  if (includeJson) headers['Content-Type'] = 'application/json';
  return headers;
}

async function loadAvailableFieldKeys(token) {
  var response = await fetch('https://connect.mailerlite.com/api/fields', {
    method: 'GET',
    headers: mailerLiteHeaders(token, false)
  });
  if (!response.ok) return null;

  var data = null;
  try {
    data = await response.json();
  } catch (e) {
    return null;
  }

  var list = data && Array.isArray(data.data) ? data.data : [];
  var keys = {};
  list.forEach(function (field) {
    if (field && field.key) keys[String(field.key)] = true;
  });
  return keys;
}

function buildFields(body, availableKeys) {
  var candidateFields = {
    first_name: firstNameFrom(body.name || body.first_name),
    diagnostic_phase: fieldValue(body.diagnostic_phase || body.phase),
    archetype: fieldValue(body.archetype_name || body.archetype),
    score: fieldValue(body.score),
    result_summary: fieldValue(body.result_summary || body.selectedResult || body.result_type),
    completed_at: fieldValue(body.completed_at || body.timestamp) || new Date().toISOString(),
    source: 'diagnostic'
  };
  var fields = {};

  var name = stringValue(body.name);
  if (name) fields.name = name;

  Object.keys(candidateFields).forEach(function (key) {
    if (!candidateFields[key]) return;
    if (availableKeys && !availableKeys[key]) return;
    fields[key] = candidateFields[key];
  });
  return fields;
}

async function postSubscriber(token, payload) {
  var response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: mailerLiteHeaders(token, true),
    body: JSON.stringify(payload)
  });

  var data = null;
  try {
    data = await response.json();
  } catch (e) {}

  return { ok: response.ok, status: response.status, data: data };
}

async function addOrUpdateSubscriber(body) {
  var token = process.env.MAILERLITE_API_KEY;
  var groupId = process.env.MAILERLITE_GROUP_ID;
  if (!token || !groupId) {
    return { ok: false, status: 500, error: 'MailerLite is not configured' };
  }

  var availableKeys = null;
  try {
    availableKeys = await loadAvailableFieldKeys(token);
  } catch (eFields) {}

  var payload = {
    email: normalizeEmail(body.email),
    fields: buildFields(body, availableKeys),
    groups: [String(groupId)],
    status: 'active'
  };

  var result = await postSubscriber(token, payload);
  if (!result.ok) {
    var minimalPayload = {
      email: normalizeEmail(body.email),
      groups: [String(groupId)],
      status: 'active'
    };
    var name = stringValue(body.name);
    if (name) minimalPayload.fields = { name: name };
    result = await postSubscriber(token, minimalPayload);
  }
  if (!result.ok && payload.fields && payload.fields.name) {
    result = await postSubscriber(token, {
      email: normalizeEmail(body.email),
      groups: [String(groupId)],
      status: 'active'
    });
  }
  if (!result.ok) {
    return { ok: false, status: result.status, error: 'MailerLite subscriber request failed' };
  }

  var data = result.data;
  var subscriberId = data && data.data && data.data.id;
  if (subscriberId) {
    try {
      await fetch(
        'https://connect.mailerlite.com/api/subscribers/' +
          encodeURIComponent(subscriberId) +
          '/groups/' +
          encodeURIComponent(String(groupId)),
        {
          method: 'POST',
          headers: mailerLiteHeaders(token, false)
        }
      );
    } catch (eGroup) {}
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
    } catch (eJson) {
      return res.status(400).json({ ok: false, error: 'Invalid JSON' });
    }

    var email = normalizeEmail(body && body.email);
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ ok: false, error: 'Valid email is required' });
    }

    var result = await addOrUpdateSubscriber(Object.assign({}, body, { email: email }));
    res.setHeader('Cache-Control', 'private, max-age=0, no-store');
    if (!result.ok) {
      return res.status(result.status || 502).json({ ok: false, error: result.error || 'MailerLite error' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Internal error' });
  }
};
