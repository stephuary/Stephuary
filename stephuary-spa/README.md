# Stephuary SPA

React + Vite + TypeScript single-page app: **entry → 25-question diagnostic (5 phases × 5) → full results → post-result offer**. Full value is delivered before any offer. No paywall on core output.

## Setup

```bash
cd stephuary-spa
npm install
npm run dev
```

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build (`dist/`)
- `npm run preview` — preview `dist/`
- `npm run lint` — ESLint

## Layout

| Path | Role |
| --- | --- |
| `src/data/questions.ts` | 25 questions, 5 phases, tags + score deltas |
| `src/data/resultRules.ts` | Eight result sections, defaults + priority rules |
| `src/data/siteCopy.ts` | Entry + post-result offer copy |
| `src/lib/scoring.ts` | Tags + scores from answers |
| `src/lib/matchRules.ts` | Declarative rule matching |
| `src/lib/outputGenerator.ts` | Assembled section outputs (no hardcoded blurbs in UI) |
| `src/components/` | Entry, questions, results, offer |

The offer step is a prototype: select a tier, then **Choose your next step** resets the flow (wire to checkout when ready).

## GitHub

```bash
git add stephuary-spa
git commit -m "Add Stephuary linear diagnostic SPA"
```

Push using the remote from the GitHub repo **Code** menu.
