import { chromium } from 'playwright';
const SC = process.argv[2];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
// catch the hero mid-assembly
await p.goto('http://localhost:3000');
await p.waitForTimeout(430);
await p.screenshot({ path: `${SC}/m-hero-mid.png` });
await p.waitForTimeout(1600);
await p.screenshot({ path: `${SC}/m-hero-settled.png` });
// hover a problem card + a button
await p.locator('#problem li').first().hover();
await p.waitForTimeout(450);
await p.locator('#problem').screenshot({ path: `${SC}/m-card-hover.png` });
// scrolled navbar state
await p.evaluate(() => scrollTo(0, 1200));
await p.waitForTimeout(600);
await p.screenshot({ path: `${SC}/m-nav-scrolled.png`, clip: { x: 0, y: 0, width: 1440, height: 130 } });
await b.close();
