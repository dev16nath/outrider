import { chromium } from 'playwright';
const SC = process.argv[2];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 700 } });
const p = await ctx.newPage();
await p.goto('http://localhost:3000');
const marks = [900, 1040, 1170, 1400, 1900];
let prev = 0;
for (const t of marks) {
  await p.waitForTimeout(t - prev); prev = t;
  await p.screenshot({ path: `${SC}/hf-${t}.png`, clip: { x: 60, y: 90, width: 1320, height: 490 } });
}
// blend must survive the scaleX, and the cursor must not move anything
const settled = await p.evaluate(() => {
  const els = [...document.querySelectorAll('.plate-stretch')];
  return els.map(e => ({ blend: getComputedStyle(e).mixBlendMode, tf: getComputedStyle(e).transform }));
});
console.log('settled:', JSON.stringify(settled));
const before = await p.evaluate(() =>
  [...document.querySelectorAll('.plate-stretch')].map(e => e.getBoundingClientRect().x.toFixed(2)));
await p.mouse.move(1100, 250); await p.waitForTimeout(400);
await p.mouse.move(300, 420);  await p.waitForTimeout(600);
const after = await p.evaluate(() =>
  [...document.querySelectorAll('.plate-stretch')].map(e => e.getBoundingClientRect().x.toFixed(2)));
console.log('cursor moved blocks:', JSON.stringify(before) === JSON.stringify(after) ? 'no  ok' : `YES XX ${before} -> ${after}`);
await b.close();
