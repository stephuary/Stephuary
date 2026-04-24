# Launch checklist — 9+ bar

Use this as a **PR-sized** gate before calling the site “production-clean.” Check items off in the PR description or as commits land.

**Target:** No placeholder CTAs, legal/analytics honest, Stripe + thank-you reliable for every paid path.

---

## P0 — Revenue & post-purchase

- [ ] **Snapshot $950** — Replace `[one-time-stripe-link]` and `[installments-stripe-link]` in `snapshot.html` with live Stripe Payment Links or Checkout URLs (pay in full + 3×$350).
- [ ] **`STRIPE_SECRET_KEY`** — Set on Vercel production so `GET /api/stripe-session?id=…` returns **200** (not 501). Smoke-test with a real `cs_live_…` after deploy.
- [ ] **Checkout `metadata.type`** — On every Stripe product / Checkout session: set `metadata.type` to one of: `access` | `snapshot` | `snapshot-plus` | `full-unlock` (or your canonical set). Document the mapping in this file’s table below.
- [ ] **Success URLs** — Each Checkout success URL includes `session_id={CHECKOUT_SESSION_ID}`; optional `type=` kept as fallback where useful.
- [ ] **Thank-you** — Manually verify thank-you steps for Club, Snapshot, Snapshot+, Full Unlock, and any coupon/installment edge case (metadata must drive type when amount ≠ default cents).

### `metadata.type` mapping (fill in)

| Product / flow | `metadata.type` | Notes |
|----------------|-----------------|--------|
| .5% Club | `access` | |
| Snapshot | `snapshot` | |
| Snapshot+ | `snapshot-plus` | |
| Full Unlock ($27) | `full-unlock` | If thank-you should branch; else confirm generic copy is OK |

---

## P0 — Access & legal

- [ ] **Club application** — Replace `[application-form-url]` / placeholder copy on `access.html` with the live form (Tally, Typeform, or native).
- [ ] **Terms** — `terms.html`: counsel-reviewed; remove HTML comment `DRAFT: not reviewed by legal counsel…` when final.
- [ ] **Privacy** — `privacy.html`: same as terms.

---

## P1 — Trust, analytics, forms

- [ ] **GA4** — `js/stephuary-consent.js`: set real **Measurement ID**, or **do not** load GA until configured (avoid consent banner with no destination).
- [ ] **FormSubmit / email capture** — `stephuary-config.js` `MONTHLY_FREE_SESSION_FORM_ACTION`: confirm production inbox, FormSubmit confirmed, monitoring in place.

---

## P1 — Copy & UX polish

- [ ] **Snapshot pricing** — Remove or rewrite builder-facing line (“Buttons should match your live Stripe links”) once live links exist; replace with customer-facing next-step / security copy if needed.
- [ ] **Responsive QA** — ~375px + desktop: Snapshot CTAs, Access apply, thank-you (all types), consent on **home + one deep page**, results Full Unlock path.
- [ ] **Results CTA** — `results.html` primary CTA uses `href="#"` + JS; confirm acceptable or add noscript / static fallback for `Get Full Unlock — $27`.

---

## P2 — Ops

- [ ] **Stripe emails** — Receipt / customer email templates match on-site timing and deliverables.
- [ ] **Price parity** — Snapshot copy, `pricing.html`, and Stripe amounts stay aligned (single source of truth or explicit doc).
- [ ] **Alerts** — Optional: Vercel/log monitoring for `/api/stripe-session` 5xx rate.

---

## Definition of done (9+)

All **P0** items checked; **P1** at least analytics + Snapshot copy + one full device pass; no placeholder checkout URLs or legal draft banners in shipped HTML.
