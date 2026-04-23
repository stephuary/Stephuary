/**
 * Enumerates 3^7 answer-weight patterns (0/1/2) and checks that
 * archetypeFromSevenResult logic produces every public archetype
 * at least once. Run: node tools/verify-diag-v2.cjs
 *
 * Keep in sync with results.html: archetypeFromSevenResult + foundation-first.
 */
function archetypeFromWeights(w1, w2, w3, w4, w5, w6, w7) {
  if (w1 === 2 && w2 === 2 && w3 === 2 && w4 === 2 && w5 === 2 && w6 === 2 && w7 === 2) {
    return 'foundation-first';
  }
  const k1 = 2 - w1;
  const k2 = 2 - w2;
  const k3 = 2 - w3;
  const k4 = 2 - w4;
  const k5 = 2 - w5;
  const k6 = 2 - w6;
  const k7 = 2 - w7;
  const S = {
    untranslated: k1 * 3 + k2 * 1,
    commodity: k2 * 1 + k3 * 3,
    'wrong-room': k4 * 3,
    'ceiling-builder': k5 * 3 + k6 * 1,
    scattered: k6 * 2,
    underpriced: k7 * 3
  };
  let maxS = 0;
  for (const slug of Object.keys(S)) {
    if (S[slug] > maxS) maxS = S[slug];
  }
  const cands = Object.keys(S).filter((slug) => S[slug] === maxS);
  if (cands.length === 1) return cands[0];
  const ws = [w1, w2, w3, w4, w5, w6, w7];
  const minW = Math.min(...ws);
  let i0 = 0;
  for (let j = 0; j < 7; j++) {
    if (ws[j] === minW) {
      i0 = j + 1;
      break;
    }
  }
  const primary = {
    1: 'untranslated',
    2: 'commodity',
    3: 'commodity',
    4: 'wrong-room',
    5: 'ceiling-builder',
    6: 'scattered',
    7: 'underpriced'
  };
  const pref = primary[i0];
  if (pref && cands.indexOf(pref) >= 0) return pref;
  const order = ['untranslated', 'commodity', 'wrong-room', 'ceiling-builder', 'scattered', 'underpriced'];
  for (const slug of order) {
    if (cands.indexOf(slug) >= 0) return slug;
  }
  return cands[0];
}

const all = new Set();
let failed = null;

for (let n = 0; n < Math.pow(3, 7); n++) {
  const w = [];
  let x = n;
  for (let i = 0; i < 7; i++) {
    w.push(x % 3);
    x = Math.floor(x / 3);
  }
  const a = archetypeFromWeights(w[0], w[1], w[2], w[3], w[4], w[5], w[6]);
  all.add(a);
}

const required = [
  'foundation-first',
  'ceiling-builder',
  'commodity',
  'wrong-room',
  'untranslated',
  'underpriced',
  'scattered'
];
for (const r of required) {
  if (!all.has(r)) {
    failed = 'Missing archetype in enumeration: ' + r;
    break;
  }
}

if (failed) {
  console.error('FAIL:', failed);
  console.error('Saw keys:', Array.from(all).sort().join(', '));
  process.exit(1);
}

console.log('OK: all 7 archetypes materialize across', Math.pow(3, 7), 'weight vectors.');
console.log('Distinct slugs seen:', all.size, Array.from(all).sort().join(', '));
process.exit(0);
