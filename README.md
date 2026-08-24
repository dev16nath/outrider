# Outrider — landing page

Next.js 16 (App Router) + Tailwind v4 + TypeScript. Built from the
[Outrider landing page](https://www.figma.com/design/hlyJqyGhcEVW2As3o3eM7O/Outrider-landing-page?node-id=39-2742)
Figma file, desktop frame `39:2742`.

```bash
npm run dev     # http://localhost:3000
npm run build
npm run shot out.png 1440 900 full   # full-page screenshot for design QA
npm run type-audit                   # diff computed type against the Figma spec
npm run wrap-check                   # diff line counts against the Figma frames
npm run motion-check                 # assert nothing stays hidden (normal / reduced-motion / no-JS)
node scripts/sections.mjs            # diff section heights against the Figma frame
```

## Type scale

Every font size derives from one token in `app/globals.css`:

```css
--type-scale: 0.9;   /* 1 = the Figma sizes exactly */
```

Change that number and the whole system moves in proportion — line-heights are
unitless ratios and tracking is in `em`, so both follow automatically. Display
sizes are named by role (`text-display-hero`, `text-display-section`,
`text-display-cta`) rather than repeated as inline `clamp()` values.

Currently set to **0.9**, a deliberate 10% reduction from the design. At this
scale the smallest text on the page — the card captions — computes to 12.6px,
which is on the small side for body copy; worth a look before going lower.

Note that text measures (`max-w-[815px]` etc.) are still at their Figma values,
so smaller type means more words per line. Line counts are unchanged everywhere,
but the hero headline now breaks after "before" rather than after "threat,".
Scaling the measures by `--type-scale` too would restore the designed breaks.

## Motion

Restrained by intent — the design is editorial and still, so the motion is short
rises and fades, no bounce and no spring. Tokens live in `app/globals.css`:

```css
--ease-reveal: cubic-bezier(0.22, 1, 0.36, 1);
--dur-reveal:  620ms;   /* scroll reveals */
--dur-hover:   200ms;   /* hover states  */
```

- **Hero separations.** Each block opens from a sliver, sweeps out until it
  spans the band **edge to edge**, then contracts onto its mark with a small
  rebound. Staggered 380/510/640ms behind the plate, 1150ms each, with the
  timing function set per keyframe: a slow build out of the gate, a firm push
  into full width, then a soft settle.

  The peak scale and transform-origin are solved per block rather than guessed.
  A left or right origin can only ever reach one edge, so the origin has to sit
  *inside* the block:

  ```
  S = 100 / width          origin = left / (width * (S - 1))
  orange / blue  S = 6.4000  origin = 55.104%
  green          S = 6.7632  origin = 37.209%
  ```

  Only `scaleX` moves, so the settled position is untouched — the blocks never
  leave their designed marks, they arrive at them. Pure CSS: the collage is a
  server component with no JS at all.
- **Everything else** uses `components/Reveal.tsx`: fade plus a 12px rise
  (20–24px for cards and plates), once, on first intersection. Card grids
  stagger 90ms per sibling; in "How it works" the product card lifts 220ms
  after its plate.
- **Hover** — cards lift 4px and warm their border while the artwork scales
  ~3%; buttons lift with a wash sweeping across; nav links grow an underline
  from the left; footer links nudge 2px right.
- **The chip dots** pulse on a slow 2.4s cycle, a "signal detected" motif.
- **Navbar** is sticky with a blurred cream backdrop, gaining a hairline once
  scrolled. The hairline is a `box-shadow`, not a border, so the bar stays
  exactly 97px and nothing shifts. `scroll-padding-top` keeps anchor targets
  clear of it.

One constraint to respect if this is ever extended: the separations must carry
their own transform directly. Wrapping them in a transformed parent creates a
stacking context, which isolates `mix-blend-mode` from the painting and kills
the blend. `npm run motion-check` guards the settled state, and
`scripts/hero-frames.mjs` samples the sequence and asserts the cursor moves
nothing, and `npm run peak-check` seeks each animation to its peak and asserts
the block spans 0%..100% of the composition, then that it finishes on the Figma
mark. Note that `Animation.currentTime` is measured from the start *including*
the delay, so the stagger has to be added when seeking or each block is sampled
mid-wait.

### Accessibility

The hiding rules sit *inside* a `prefers-reduced-motion: no-preference` query,
so a reduced-motion visitor is never shown a hidden element in the first place —
rather than being shown one that never animates in. A `<noscript>` override in
`app/layout.tsx` covers the same risk when JS does not run.

`npm run motion-check` asserts all three paths: it walks the page and reports any
`[data-reveal]` still below full opacity under normal, reduced-motion, and
JS-disabled conditions, and separately checks the hero separations. Currently
32 reveals 0 stuck in all three; under reduced motion the separations are
static, visible and at identity scale; without JS the CSS entrance still plays
and settles, since the collage needs no JS.

Note the audit scripts scroll with `behavior: 'instant'`, since `html` now has
`scroll-behavior: smooth` and their step waits would otherwise race.

## Fidelity

Checked against the Figma frame at 1440px, not eyeballed:

- **Wrap** — `npm run wrap-check` diffs rendered line counts against the Figma
  frames. Currently 11/11.
- **Type** — `npm run type-audit` reads computed `font-family`, `font-size`,
  `line-height`, `letter-spacing` and `font-weight` off the live page for 22
  elements and diffs them against the values in the Figma nodes, then asserts
  every repeated instance (all 3 chips, all 16 footer links, all 4 buttons…)
  is uniform. The spec is scaled by `--type-scale` before comparison, so this
  verifies every size moved by exactly the same ratio. Currently 22/22, 0 mismatches.
- **Layout** — `scripts/sections.mjs` diffs each section's rendered height
  against its Figma frame. Currently 6161px vs the design's 6160px; the only
  residual deltas are Hero −1px and Footer +2px, which are line-box rounding
  (Geist at 16px/1.33 computes 21.28px where Figma rounds to 21), not layout drift.

Both scripts need `npm run dev` running.

One gotcha worth knowing if you edit type: in Tailwind v4 `--tw-leading` is
registered `inherits: false`, so a named `text-*` utility resets line-height
even when a parent sets `leading-*`. Put the `leading-*` on the same element as
the `text-*`, never on an ancestor.

## Structure

| Section | Component | Figma node |
| --- | --- | --- |
| Navbar | `components/Navbar.tsx` | `39:2743` |
| Hero collage | `components/Hero.tsx` | `39:2749` |
| The problem | `components/Problem.tsx` | `39:2764` |
| How it works | `components/HowItWorks.tsx` | `39:3356` |
| The signals | `components/Signals.tsx` | `39:3792` |
| Days of warning (CTA) | `components/WarningCta.tsx` | `39:4286` |
| For the team | `components/Audience.tsx` | `39:4298` |
| Footer | `components/Footer.tsx` | `39:4357` |

Shared: `components/Button.tsx`, `components/SectionHeading.tsx`.

## Design tokens

The Figma file defines only one variable (a `Body` text style), so the palette was
lifted from the frames and centralised in `app/globals.css` under `@theme`:

| Token | Value | Use |
| --- | --- | --- |
| `--color-cream` | `#fffcf3` | page background |
| `--color-sand` | `#f7f5e8` | cards, panels, footer |
| `--color-rule-warm` | `#e2dcc2` | illustration frame borders |
| `--color-ink` | `#272727` | body text |
| `--color-ink-nav` | `#363439` | nav links |
| `--color-signal-orange` | `#ffa347` | buttons, Detect |
| `--color-signal-blue` | `#478dff` | Assess |
| `--color-signal-green` | `#669e41` | Act |

Layout uses the Figma frame: 1440 wide, 64px gutters, 1312px content column
(`.frame` in `globals.css`).

Fonts are self-hosted via `next/font`: **Zarathustra** (display, `app/fonts/`)
and **Geist** (UI, `next/font/google`).

## Assets

Everything in `public/assets/` is exported from Figma. The detailed product
mockups are outlined vector artwork in the design (even their label text is
paths), so each is exported as one flat SVG rather than rebuilt in markup.
The oil-painting plates are PNG and served through `next/image`.

To refresh an asset, re-export the same node from Figma and overwrite the file.

## Open items from the design

These are things in the Figma file that look unintentional. The build reproduces
them as-drawn — decide and I'll update:

1. **"How it works", third row.** The *Act* step reuses the *Detect* headline and
   body verbatim ("We see it first." / "We watch the open web…"). Needs its own copy.
2. **Footer, Product column.** "Coverage" is listed twice (`39:4365`, `39:4366`).
3. **Nav typeface.** The navbar text is specified as Inter (`39:2745`) while every
   other UI string is Geist. Built with Geist for consistency — this is the one
   deliberate deviation from the design, and the only row the type audit is
   pointed at Geist rather than the Figma value. Say the word and I'll switch it.
4. **No mobile or tablet frames.** Responsive behaviour is a judgment call —
   3-up card grids stack, the hero collage centre-crops to preserve its geometry,
   and the CTA band drops its fixed aspect ratio below `md`.
5. **Zarathustra licensing.** The font is self-hosted, which requires a webfont
   licence. Worth confirming before launch.

All links are `#` placeholders pending real routes.
