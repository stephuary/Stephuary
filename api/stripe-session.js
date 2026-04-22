// Vercel serverless function.
// Returns a minimal, client-safe subset of a Stripe Checkout Session.
// Never exposes STRIPE_SECRET_KEY.
// Env required (optional at build time): STRIPE_SECRET_KEY
//
// Request:  GET /api/stripe-session?id=cs_test_...
// Response: 200 { id, amount_total, currency, customer_email, product, type, metadata }
//           400 { error } on missing/invalid id
//           501 { error } if Stripe key is not configured (graceful fallback signal)
//           502 { error } on upstream Stripe failure

const SESSION_ID_RE = /^cs_(test|live)_[A-Za-z0-9_]+$/;

module.exports = async function handler(req, res) {
  try {
    if (req.method && req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const id = (req.query && req.query.id) || '';
    if (!id || typeof id !== 'string' || !SESSION_ID_RE.test(id)) {
      return res.status(400).json({ error: 'Missing or invalid session id' });
    }

    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      // Not configured yet. Client will fall back to URL params.
      return res.status(501).json({ error: 'Stripe not configured' });
    }

    const url =
      'https://api.stripe.com/v1/checkout/sessions/' +
      encodeURIComponent(id) +
      '?expand[]=line_items&expand[]=line_items.data.price.product';

    const upstream = await fetch(url, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + key, 'Stripe-Version': '2024-06-20' }
    });

    if (!upstream.ok) {
      return res.status(502).json({ error: 'Stripe session lookup failed' });
    }

    const s = await upstream.json();

    // Prefer Stripe metadata; fall back to line item product name.
    const metadata = (s && s.metadata) || {};
    let product = metadata.product || null;
    let type = metadata.type || null;

    if (!product && s && s.line_items && Array.isArray(s.line_items.data) && s.line_items.data.length) {
      const li = s.line_items.data[0];
      if (li && li.price && li.price.product && typeof li.price.product === 'object') {
        product = li.price.product.name || null;
      } else if (li && li.description) {
        product = li.description;
      }
    }

    res.setHeader('Cache-Control', 'private, max-age=0, no-store');
    return res.status(200).json({
      id: s.id || id,
      amount_total: typeof s.amount_total === 'number' ? s.amount_total : null,
      currency: s.currency || null,
      customer_email:
        (s.customer_details && s.customer_details.email) ||
        s.customer_email ||
        null,
      product: product,
      type: type,
      metadata: metadata
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error' });
  }
};
