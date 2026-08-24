import { chromium } from 'playwright';
const [,, out, w, h, full] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
// scroll the whole page so lazy images decode before a full-page capture
await p.evaluate(async () => {
  const step = window.innerHeight;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo({ top: y, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
});
await p.waitForLoadState('networkidle');
await p.waitForTimeout(1500);
await p.screenshot({ path: out, fullPage: full === 'full' });
await b.close();
