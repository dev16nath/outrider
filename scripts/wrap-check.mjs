import { chromium } from 'playwright';
// Figma line counts, read off the design frames
const spec = {
  'hero h1':          ['h1', 2, 'Ride ahead of the threat, / before it reaches you.'],
  'hero body':        ['section[data-node-id="39:2749"] h1 + p', 2, ''],
  'problem kicker':   ['#problem h2 + p', 2, ''],
  'problem card body':['#problem li h3 + p', 2, ''],
  'step h3':          ['#how-it-works h3', 1, 'We see it first.'],
  'step body':        ['#how-it-works h3 + p', 3, ''],
  'signals h2':       ['section[data-node-id="39:3792"] h2', 2, 'The signals that come / before an attack.'],
  'cta h2':           ['#demo h2', 2, 'Days of warning, not / a post-mortem.'],
  'cta body':         ['#demo h2 + p', 3, ''],
  'audience h2':      ['#audience h2', 2, 'For the team that would / rather see it coming.'],
  'audience kicker':  ['#audience h2 + p', 1, ''],
};
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p.waitForTimeout(1000);
const res = await p.evaluate((spec) => {
  const o = {};
  for (const [k, [s, want]] of Object.entries(spec)) {
    const el = document.querySelector(s);
    if (!el) { o[k] = null; continue; }
    // count by box height / line-height: robust to <br> phantom rects
    const c = getComputedStyle(el);
    const lh = parseFloat(c.lineHeight);
    o[k] = { lines: Math.round(el.getBoundingClientRect().height / lh), want };
  }
  return o;
}, spec);
console.log('element'.padEnd(20), 'lines'.padEnd(8), 'figma', '  note');
console.log('-'.repeat(70));
for (const [k, v] of Object.entries(res)) {
  if (!v) { console.log(k, 'NOT FOUND'); continue; }
  const ok = v.lines === v.want;
  console.log(k.padEnd(20), String(v.lines).padEnd(8), String(v.want).padEnd(6), ok ? 'ok' : 'XX  wrap changed');
}
await b.close();
