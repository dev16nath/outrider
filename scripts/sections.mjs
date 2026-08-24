import { chromium } from 'playwright';
const figma = {
  'Navbar': ['header', 97],
  'Hero': ['section[data-node-id="39:2749"]', 806],
  'Problem': ['#problem', 698],
  'How it works': ['#how-it-works', 1762],
  'Signals': ['section[data-node-id="39:3792"]', 656],
  'CTA': ['#demo', 712],
  'Audience': ['#audience', 739],
  'Footer': ['footer', 690],
};
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += innerHeight) {
    scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 100));
  }
  scrollTo({ top: 0, behavior: 'instant' });
});
await p.waitForTimeout(1200);
let total = 0, ftotal = 0;
console.log('section'.padEnd(15), 'built'.padEnd(9), 'figma'.padEnd(9), 'delta');
console.log('-'.repeat(46));
for (const [name, [sel, want]] of Object.entries(figma)) {
  const box = await p.locator(sel).first().boundingBox();
  const h = box ? Math.round(box.height) : 0;
  total += h; ftotal += want;
  const d = h - want;
  console.log(name.padEnd(15), String(h).padEnd(9), String(want).padEnd(9), (d > 0 ? '+' : '') + d + (Math.abs(d) > 8 ? '  <--' : ''));
}
console.log('-'.repeat(46));
console.log('TOTAL'.padEnd(15), String(total).padEnd(9), String(ftotal).padEnd(9), (total - ftotal));
await b.close();
