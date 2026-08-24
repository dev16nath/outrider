import { chromium } from 'playwright';
const SC = process.argv[2];
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 700 } })).newPage();
await p.goto('http://localhost:3000');
await p.waitForTimeout(2600); // let it settle first

const measure = async (pct) => p.evaluate((pct) => {
  const comp = document.querySelector('.plate-stretch').parentElement;
  const cb = comp.getBoundingClientRect();
  return [...document.querySelectorAll('.plate-stretch')].map((el) => {
    const a = el.getAnimations()[0];
    a.pause();
    // currentTime is measured from the start of the animation INCLUDING its
    // delay, so the stagger has to be added or each block is sampled mid-wait.
    const t = a.effect.getTiming();
    a.currentTime = t.delay + t.duration * pct;
    const r = el.getBoundingClientRect();
    return {
      leftPct: +(((r.left - cb.left) / cb.width) * 100).toFixed(3),
      rightPct: +(((r.right - cb.left) / cb.width) * 100).toFixed(3),
    };
  });
}, pct);

const peak = await measure(0.46);
console.log('at peak (46%):');
for (const [i, r] of peak.entries()) {
  const ok = Math.abs(r.leftPct) < 0.3 && Math.abs(r.rightPct - 100) < 0.3;
  console.log(`  block ${i}  ${r.leftPct}% .. ${r.rightPct}%   ${ok ? 'spans full width  ok' : 'XX'}`);
}
// screenshot each block at its own peak
await p.evaluate(() => {
  document.querySelectorAll('.plate-stretch').forEach((el, i) => {
    const a = el.getAnimations()[0]; a.pause();
    const t = a.effect.getTiming();
    a.currentTime = t.delay + t.duration * (i === 0 ? 0.46 : 0.18);
  });
});
await p.screenshot({ path: `${SC}/peak-orange.png`, clip: { x: 60, y: 90, width: 1320, height: 490 } });
// settled
await p.evaluate(() => document.querySelectorAll('.plate-stretch').forEach((el) => {
  const a = el.getAnimations()[0]; a.finish();
}));
const settled = await p.evaluate(() => {
  const comp = document.querySelector('.plate-stretch').parentElement;
  const cb = comp.getBoundingClientRect();
  return [...document.querySelectorAll('.plate-stretch')].map((el) => {
    const r = el.getBoundingClientRect();
    return +(((r.left - cb.left) / cb.width) * 100).toFixed(3);
  });
});
console.log('settled lefts:', settled, 'vs Figma [46.494, 46.494, 31.707]');
await b.close();
