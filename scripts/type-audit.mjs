import { chromium } from 'playwright';

// Figma spec: [family, px, lineHeightPx, letterSpacingPx, weight]
const spec = {
  'nav link':          ['Geist',       20, 24,    -0.6,  400],  // Figma says Inter; deliberate swap
  'hero h1':           ['Zarathustra', 64, 64,    -1.28, 400],
  'hero body':         ['Geist',       20, 26.6,   0,    400],
  'hero button':       ['Geist',       24, 26.4,   0,    500],
  'problem h2':        ['Zarathustra', 48, 48,    -0.96, 400],
  'problem kicker':    ['Geist',       20, 24,     0,    400],
  'problem card h3':   ['Geist',       24, 31.92,  0,    400],
  'problem card body': ['Geist',       14, 16.8,   0,    400],
  'howitworks h2':     ['Zarathustra', 48, 48,    -0.96, 400],
  'chip':              ['Geist',       16, 19.2,   0,    400],
  'step h3':           ['Zarathustra', 48, 63.84, -0.96, 400],
  'step body':         ['Geist',       16, 21.28,  0,    400],
  'signals h2':        ['Zarathustra', 48, 48,    -0.96, 400],
  'signals li':        ['Geist',       20, 29.8,   0,    400],
  'cta h2':            ['Zarathustra', 48, 48,    -0.96, 400],
  'cta body':          ['Geist',       20, 24,     0,    400],
  'audience h2':       ['Zarathustra', 48, 48,    -0.96, 400],
  'audience card h3':  ['Geist',       24, 31.92,  0,    400],
  'audience card body':['Geist',       14, 16.8,   0,    400],
  'footer col head':   ['Geist',       16, 21.28,  0,    400],
  'footer link':       ['Geist',       16, 21.28,  0,    400],
  'copyright':         ['Geist',       16, 21.28,  0,    400],
};

const sel = {
  'nav link':          'header nav ul li a',
  'hero h1':           'h1',
  'hero body':         'section[data-node-id="39:2749"] h1 + p',
  'hero button':       'section[data-node-id="39:2749"] a[href="#demo"]',
  'problem h2':        '#problem h2',
  'problem kicker':    '#problem h2 + p',
  'problem card h3':   '#problem li h3',
  'problem card body': '#problem li h3 + p',
  'howitworks h2':     '#how-it-works > h2',
  'chip':              '#how-it-works span',
  'step h3':           '#how-it-works h3',
  'step body':         '#how-it-works h3 + p',
  'signals h2':        'section[data-node-id="39:3792"] h2',
  'signals li':        'section[data-node-id="39:3792"] li',
  'cta h2':            '#demo h2',
  'cta body':          '#demo h2 + p',
  'audience h2':       '#audience h2',
  'audience card h3':  '#audience li h3',
  'audience card body':'#audience li h3 + p',
  'footer col head':   'footer nav div p',
  'footer link':       'footer nav a',
  'copyright':         'footer > div > p',
};

// The build applies a global --type-scale; the Figma numbers above are at 1.0.
// Scaling the spec by it verifies every size moved by exactly the same ratio.
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);

const SCALE = await p.evaluate(() =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--type-scale')) || 1
);
console.log(`TYPE SCALE: ${SCALE}  (1.0 = Figma sizes exactly)\n`);

const loaded = await p.evaluate(() =>
  [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`)
);
console.log('LOADED FACES:', loaded.join(' | '), '\n');

const rows = await p.evaluate((sel) => {
  const out = {};
  for (const [k, s] of Object.entries(sel)) {
    const el = document.querySelector(s);
    if (!el) { out[k] = null; continue; }
    const c = getComputedStyle(el);
    out[k] = {
      family: c.fontFamily,
      size: parseFloat(c.fontSize),
      lh: c.lineHeight === 'normal' ? 'normal' : parseFloat(c.lineHeight),
      ls: c.letterSpacing === 'normal' ? 0 : parseFloat(c.letterSpacing),
      w: c.fontWeight,
    };
  }
  return out;
}, sel);

const near = (a, bb, t = 0.6) => typeof a === 'number' && Math.abs(a - bb) <= t;
const fam = (actual, want) => actual.toLowerCase().includes(want.toLowerCase());

console.log('elem'.padEnd(20), 'family'.padEnd(9), 'size'.padEnd(13), 'line-height'.padEnd(17), 'tracking'.padEnd(15), 'wt');
console.log('-'.repeat(92));
for (const [k, want] of Object.entries(spec)) {
  const g = rows[k];
  if (!g) { console.log(k.padEnd(20), 'NOT FOUND'); continue; }
  const [wf, ws0, wl0, wt0, ww] = want;
  const ws = +(ws0 * SCALE).toFixed(2);
  const wl = +(wl0 * SCALE).toFixed(2);
  const wt = +(wt0 * SCALE).toFixed(3);
  const m = (ok) => (ok ? '  ok' : ' XX ');
  console.log(
    k.padEnd(20),
    (fam(g.family, wf) ? 'ok' : `XX ${wf}`).padEnd(9),
    `${g.size}/${ws}${m(near(g.size, ws))}`.padEnd(13),
    `${g.lh}/${wl}${m(near(g.lh, wl, 0.9))}`.padEnd(17),
    `${g.ls}/${wt}${m(near(g.ls, wt, 0.08))}`.padEnd(15),
    `${g.w}/${ww}${m(String(g.w) === String(ww))}`
  );
}

// pass 2: every instance of each repeating group must be uniform
const groups = {
  'nav links':      'header nav ul li a',
  'chips':          '#how-it-works [class*="inline-flex"]',
  'step h3s':       '#how-it-works h3',
  'step bodies':    '#how-it-works h3 + p',
  'problem h3s':    '#problem li h3',
  'problem bodies': '#problem li h3 + p',
  'audience h3s':   '#audience li h3',
  'audience bodies':'#audience li h3 + p',
  'footer heads':   'footer nav div p',
  'footer links':   'footer nav a',
  'buttons':        'main a[class*="bg-signal-orange"]',
};
console.log('\nUNIFORMITY ACROSS REPEATED INSTANCES');
console.log('-'.repeat(92));
const uni = await p.evaluate((groups) => {
  const out = {};
  for (const [k, s] of Object.entries(groups)) {
    const els = [...document.querySelectorAll(s)];
    const sig = els.map((e) => {
      const c = getComputedStyle(e);
      return `${parseFloat(c.fontSize)}/${c.lineHeight}/${c.letterSpacing}/${c.fontWeight}`;
    });
    out[k] = { n: els.length, uniq: [...new Set(sig)] };
  }
  return out;
}, groups);
for (const [k, v] of Object.entries(uni)) {
  const ok = v.uniq.length === 1 && v.n > 0;
  console.log(k.padEnd(18), `n=${v.n}`.padEnd(6), ok ? 'ok  ' + v.uniq[0] : 'XX  ' + v.uniq.join('  |  '));
}
await b.close();
