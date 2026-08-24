import { chromium } from 'playwright';
const b = await chromium.launch();

async function pageIn(opts = {}) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight) {
      scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 130));
    }
    scrollTo({ top: 0, behavior: 'instant' });
  });
  await p.waitForTimeout(1400);
  return { p, ctx };
}

const audit = async (p) => p.evaluate(() => {
  const els = [...document.querySelectorAll('[data-reveal]')];
  const hidden = els.filter(e => {
    const c = getComputedStyle(e);
    return parseFloat(c.opacity) < 0.99;
  }).map(e => e.className || e.tagName);
  return { total: els.length, hidden };
});

// 1. normal
{
  const { p, ctx } = await pageIn();
  const r = await audit(p);
  console.log(`normal          reveals=${r.total}  still hidden after scroll: ${r.hidden.length ? r.hidden.join(', ') : 'none  ok'}`);
  await ctx.close();
}
// 2. reduced motion — nothing may ever be hidden
{
  const { p, ctx } = await pageIn({ reducedMotion: 'reduce' });
  const r = await audit(p);
  const anim = await p.evaluate(() => {
    const el = document.querySelector('.signal-dot');
    return el ? getComputedStyle(el).animationName : 'n/a';
  });
  // The hero separations must be at full opacity, unanimated, and untranslated.
  const hero = await p.evaluate(() => {
    const els = [...document.querySelectorAll('.plate-stretch')];
    return els.map(e => {
      const c = getComputedStyle(e);
      return { anim: c.animationName, op: c.opacity, tf: c.transform };
    });
  });
  // Must be unanimated, visible, and at identity scale (no residual stretch).
  const heroBad = hero.filter(
    h => h.anim !== 'none' || +h.op < 0.99 || !(h.tf === 'none' || h.tf === 'matrix(1, 0, 0, 1, 0, 0)')
  );
  console.log(`reduced-motion  reveals=${r.total}  hidden: ${r.hidden.length ? r.hidden.join(', ') : 'none  ok'}   dot animation: ${anim}`);
  console.log(`                hero separations=${hero.length}  ${heroBad.length ? 'XX ' + JSON.stringify(heroBad) : 'static + visible  ok'}`);
  await ctx.close();
}
// 3. no JS — noscript override must apply
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000', { waitUntil: 'load' });
  await p.waitForTimeout(800);
  const r = await audit(p);
  // The registration sequence is pure CSS, so it should still play and settle.
  const heroOp = await p.evaluate(() =>
    [...document.querySelectorAll('.plate-stretch')].map(e => getComputedStyle(e).opacity));
  const heroOk = heroOp.length === 3 && heroOp.every(o => +o > 0.99);
  console.log(`no-JS           reveals=${r.total}  hidden: ${r.hidden.length ? r.hidden.length + ' HIDDEN  XX' : 'none  ok'}   hero settled: ${heroOk ? 'ok' : 'XX ' + heroOp.join(',')}`);
  await ctx.close();
}
await b.close();
