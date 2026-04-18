# Stephuary routing & UX audit (structural)

## 1. Audit summary

**Strongest issues**
- Root `index.html` hero presented three parallel actions (diagnostic, how it works, install), diluting the diagnostic-led model.
- `index.html` hero lead explicitly invited skipping the diagnostic before users committed.
- `pricing.html` init forced **Snapshot** open by default while **Entry** was the intended first lane; accordion logic already allows one open group at a time.
- Nav on `index` / `systems` omitted a first-class **Diagnostic** link; routing story was implicit.

**Strongest opportunities**
- Single dominant primary CTA on the homepage hero; secondary only educates (`#system`), not sells install.
- Default pricing accordion to **Entry** so the page reads as progression, not a vertical mall.
- Align top nav across key pages: Diagnostic → System → Pricing → …

**What hurts conversion most**
- Competing hero CTAs and copy that suggests bypassing the diagnostic before value is delivered.

## 2. Page-by-page revision plan (ongoing)

| Page | Role | Issues addressed in code | Future work |
|------|------|---------------------------|-------------|
| `/` (index) | Route to diagnostic; trust; curiosity | Removed install CTA; tightened lead; Diagnostic in nav; diagnostic block CTA as primary | Phase rail still offers direct phase links for power users; consider progressive disclosure later |
| `/capture` | Front door | No change this pass | Continue tightening “required path” copy if needed |
| `/systems` | Explain sequence | Diagnostic link in nav | Optional: split “continue” vs “start” by localStorage |
| `/pricing` | Layered offers | Default open = Entry | Further collapse bridges if still busy |
| `/homepage` | Alternate marketing surface | Already diagnostic-first from prior work | Keep synced with index nav patterns |

## 3. Conversion hierarchy (target)

- **Primary:** Start / continue diagnostic (`/capture`, `/results` when complete).
- **Secondary:** Understand system (`#system` on index, `/systems`).
- **Hidden / delayed:** Install, private access, pricing tiers until user has context or explicit intent.
- **Revealed later:** Full pricing accordion bands; build details after CTA (already gated).

## 4. Design & layout (this pass)

- Hero: fewer buttons, clearer weight.
- Pricing: first accordion band matches “start here” mentally.

## 5. Routing & logic

- `vercel.json` rewrites remain source of truth; `/homepage` rewrite added for clean URL.
- Internal anchors: `#tier-direction` on pricing for Direction block.

## 6. Technical notes

- No new dependencies.
- Validate mobile: nav wraps; hero buttons stack.
- Manual review: `stephuary-personalization.js` home hero overrides; phase deep links from index.

## 7. Confirmation checklist (post-deploy)

- [ ] `/`, `/capture`, `/systems`, `/pricing` load.
- [ ] Nav links work; Diagnostic visible on index + systems.
- [ ] Pricing loads with Entry section open by default.
- [ ] Hero CTA script still updates for started/completed diagnostic states.

---

## Deliverable (this revision)

### A. Summary of what changed

- **Home (`index.html`):** Hero now has two CTAs (diagnostic primary, system anchor secondary). Removed the parallel “Install the system” path from the hero. Lead copy no longer suggests skipping the diagnostic. Nav adds **Diagnostic** → `/capture`. Diagnostic band CTA uses primary button styling. Phase rail subcopy reframed as sequence after the diagnostic (less “pick any card”).
- **`systems.html` & `pricing.html`:** Nav adds **Diagnostic** first for routing parity.
- **`pricing.html`:** Accordion init opens **Entry** (`pricing-major-entry`) instead of Snapshot.
- **`vercel.json`:** `/homepage` rewrites to `homepage.html` for a clean URL.

### B. Files touched

- `index.html`
- `systems.html`
- `pricing.html` (nav + accordion default)
- `vercel.json`
- `docs/STEPHUARY_ROUTING_AUDIT.md`

### C. Remaining issues / follow-ups

- **Broader pass:** Other marketing pages (`monetize`, `direction-system`, rooms, etc.) were not re-audited in this slice; nav and CTA competition may still vary.
- **`hero-cta-micro`:** Hidden microcopy on index may still imply shortcuts—review if it undermines “diagnostic first.”
- **`stephuary-pricing-guided.js`:** Sticky CTA still says “Install the system” in some states; align wording with routing story if needed.
- **Personalization:** `stephuary-personalization.js` `applyHomeHero` should be smoke-tested after hero DOM changes.

### D. Manual review recommended

- Mobile: hero button row, nav wrap, pricing accordion on small viewports.
- Completed-diagnostic state: secondary CTA → `/pricing` still appropriate vs deeper recommendation.
- Snapshot router modal on `pricing.html` (unchanged logic, verify Entry default does not break UX expectations).

### E. Confirmation (intent)

After deploy, confirm: pages load; nav works; internal routes resolve; layout stable; mobile usable; conversion hierarchy clearer on homepage and pricing default; site reads more like **one next step** than three equal hero choices.
