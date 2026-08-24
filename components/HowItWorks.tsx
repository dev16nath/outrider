import Image from "next/image";
import Reveal from "./Reveal";
import { asset } from "@/lib/asset";

type Step = {
  chip: { label: string; bg: string; fg: string };
  title: string;
  body: string;
  plate: string;
  card: string;
  /** Figma alternates which column holds the artwork */
  mediaFirst: boolean;
};

const steps: Step[] = [
  {
    chip: { label: "Detect", bg: "#ff9e25", fg: "#ffe081" },
    title: "We see it first.",
    body: "We watch the open web, dark web, and criminal forums for anything tied to your name — exposed passwords, spoofed domains, chatter marking you as a target.",
    plate: "/assets/how-1-plate.png",
    card: "/assets/how-1-card.svg",
    mediaFirst: true,
  },
  {
    chip: { label: "Assess", bg: "#268fff", fg: "#57f3ff" },
    title: "We tell you what it means.",
    body: "Every signal is scored and explained — how real, how urgent, who's behind it, and how they work. Intelligence, not a raw feed to drown in.",
    plate: "/assets/how-2-plate.png",
    card: "/assets/how-2-card.svg",
    mediaFirst: false,
  },
  {
    chip: { label: "Act", bg: "#53a02e", fg: "#c6e700" },
    title: "We see it first.",
    body: "We watch the open web, dark web, and criminal forums for anything tied to your name — exposed passwords, spoofed domains, chatter marking you as a target.",
    plate: "/assets/how-3-plate.png",
    card: "/assets/how-3-card.svg",
    mediaFirst: true,
  },
];

/**
 * The colour blocks painted into each plate, measured off the PNGs (all
 * 611 x 448, rendered at the same aspect, so percentages land exactly).
 *
 * These cannot travel — the painting behind them does not exist in any asset
 * and the composite is a hue blend, so what is underneath is unrecoverable.
 * They can only GROW: an overlay in the same hue, blended with
 * mix-blend-mode: color, is idempotent over the printed block and tints fresh
 * painting identically past its edge. See .plate-block in globals.css.
 *
 * `color` is each block's own median pixel, which gets the hue and the blend
 * spec's Sat() right by construction. `grow` carries the far edge 44
 * plate-units out — one distance for every block on every plate, so they all
 * move at one speed and only their heights differ.
 *
 * `origin` is chosen by which direction the movement can actually be SEEN,
 * not by which frame edge is nearer. The product card covers x 12.275-87.814%
 * and y 16.518-83.482% of every plate, and most of these blocks sit largely
 * under it; growing toward the roomier frame edge buries the moving edge
 * behind the card and the block reads as static. So each one is anchored so
 * its far edge sweeps into open plate — for the blocks fully under the card
 * that means growing until the edge emerges past the card's own boundary.
 *
 * The one exception is plate 1's blue: it already reaches within 15 units of
 * the plate's bottom, so its visible travel is short (grow 1.060). Growing
 * the other way would be longer and completely hidden.
 */
const PLATE_BLOCKS: Record<string, { color: string; left: string; top: string; width: string; height: string; origin: string; grow: number }[]> = {
  "/assets/how-1-plate.png": [
    { color: "#ff9f36", left: "17.185%", top: "16.071%", width: "15.385%", height: "24.330%", origin: "bottom", grow: 1.404 },
    { color: "#4073ff", left: "32.570%", top: "40.402%", width: "19.476%", height: "56.250%", origin: "top", grow: 1.06 },
    { color: "#7ca42c", left: "52.046%", top: "61.830%", width: "26.514%", height: "18.973%", origin: "top", grow: 1.518 },
  ],
  "/assets/how-2-plate.png": [
    { color: "#ffa638", left: "15.057%", top: "20.759%", width: "69.722%", height: "31.696%", origin: "bottom", grow: 1.31 },
    { color: "#4873ff", left: "0.000%", top: "36.830%", width: "21.113%", height: "31.473%", origin: "bottom", grow: 1.312 },
    { color: "#53801c", left: "84.779%", top: "52.455%", width: "15.221%", height: "31.473%", origin: "top", grow: 1.312 },
  ],
  "/assets/how-3-plate.png": [
    { color: "#ff6b17", left: "7.692%", top: "4.464%", width: "26.841%", height: "26.786%", origin: "bottom", grow: 1.167 },
    { color: "#2651ff", left: "34.534%", top: "18.080%", width: "24.714%", height: "60.045%", origin: "bottom", grow: 1.164 },
    { color: "#276115", left: "50.082%", top: "73.884%", width: "43.863%", height: "26.116%", origin: "bottom", grow: 1.376 },
  ],
};

/**
 * 611 x 448 plate with the product card floated at Figma's 75 / 74 offset.
 *
 * The card is a plain <img>, not next/image: these are SVGs, which the
 * optimiser refuses without dangerouslyAllowSVG. Problem.tsx renders its
 * artwork the same way for the same reason.
 *
 * Nothing animates in here any more. The card used to assemble itself from
 * a grid of fragments, which was a second entrance idiom competing with the
 * scan wipe the rest of the page enters with; the whole step is now wiped in
 * as one card by .card-scan, exactly like a Problem card.
 */
function Plate({ plate, card }: Pick<Step, "plate" | "card">) {
  return (
    <div className="relative isolate w-full overflow-hidden aspect-[611/448]">
      <Image
        src={asset(plate)}
        alt=""
        aria-hidden
        fill
        sizes="(min-width: 768px) 611px, 100vw"
        className="object-cover"
      />
      {/* Between the plate and the card, so the card hides whatever passes
          under it — no redraw needed here, unlike the Signals plate where the
          card is baked into the image. `isolate` is on the wrapper above
          because these have to blend against the plate, its sibling. */}
      <div
        className="plate-blocks pointer-events-none absolute inset-0"
        style={{ "--phase": "1733ms" } as React.CSSProperties}
        aria-hidden
      >
        {(PLATE_BLOCKS[plate] ?? []).map((b, i) => (
          <span
            key={b.color}
            className="plate-block"
            style={
              {
                left: b.left,
                top: b.top,
                width: b.width,
                height: b.height,
                background: b.color,
                transformOrigin: b.origin,
                "--grow": b.grow,
                "--k": i,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <img
        src={asset(card)}
        alt=""
        aria-hidden
        className="absolute left-[12.275%] top-[16.518%] h-[66.964%] w-[75.539%]"
      />
    </div>
  );
}

/**
 * The tag's pixel field, as four interleaved grids rather than one element
 * per pixel — a few dozen animated nodes per tag would be a lot of DOM for a
 * texture. Each layer is the same grid shifted by half a cell, so the four
 * together land on every position without overlapping, and each breathes on
 * its own phase. Nothing translates; only opacity moves.
 *
 * These are half-cell flags, not lengths: pixel size and spacing both live on
 * --px-size / --px-pitch in globals.css, so the field rescales from there
 * without touching this.
 */
const FIELD = [
  { cx: 0, cy: 0 },
  { cx: 1, cy: 0 },
  { cx: 0, cy: 1 },
  { cx: 1, cy: 1 },
];

/**
 * The colour is a separate layer from the label so it can carry the hero's
 * stretch entrance. Scaling the chip itself would stretch the type and the
 * padding with it — the hero's separations get away with scaleX because they
 * are empty colour.
 *
 * The dot and label are nested in one face rather than being faded directly:
 * a fade on `.chip-stretch > *` would land an animation shorthand on
 * .signal-dot at higher specificity and kill its pulse.
 */
function Chip({ label, bg, fg }: Step["chip"]) {
  return (
    <span
      className="chip-stretch relative inline-flex items-center justify-center px-4 py-2 text-base leading-[1.2]"
      style={{ "--chip-bg": bg, color: fg } as React.CSSProperties}
    >
      {FIELD.map(({ cx, cy }, k) => (
        <span
          key={k}
          className="chip-field"
          style={{ "--k": k, "--cx": cx, "--cy": cy } as React.CSSProperties}
          aria-hidden
        />
      ))}
      <span className="chip-face relative inline-flex items-center gap-4">
        <span
          className="signal-dot size-2 shrink-0"
          style={{ backgroundColor: fg }}
          aria-hidden
        />
        {label}
      </span>
    </span>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="frame flex flex-col items-start gap-8 py-16 md:py-[72px]"
      data-node-id="39:3356"
    >
      <Reveal className="how-head w-full bg-cream md:pb-5">
        <h2 className="font-display text-display-section leading-none tracking-[-0.02em] text-ink">
          How it works
        </h2>
      </Reveal>

      <div className="flex w-full flex-col gap-8 bg-sand p-4 md:p-[17px]">
        {steps.map((step, i) => (
          <Reveal
            key={step.chip.label}
            distance={20}
            style={{ "--i": i } as React.CSSProperties}
            className="how-step bg-sand md:shadow-[0_-10px_24px_-14px_rgba(39,39,39,0.16)]"
          >
            {/* Same shape as Problem.tsx: .card-scan clips the step's
                CONTENT while the sand plate and its shadow, on the observed
                element above, stay unclipped and land first. */}
            <div className="card-scan relative overflow-hidden">
              <div className="grid grid-cols-1 items-center gap-6 p-0 md:grid-cols-2 md:p-4">
                <div className={step.mediaFirst ? "md:order-1" : "md:order-2"}>
                  <Plate plate={step.plate} card={step.card} />
                </div>
                <div
                  className={`flex flex-col items-start justify-center gap-8 ${
                    step.mediaFirst ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <Chip {...step.chip} />
                  <div className="flex flex-col items-start gap-2 text-ink">
                    <h3 className="font-display text-display-section leading-[1.33] tracking-[-0.02em]">
                      <span className="card-line block overflow-hidden">
                        <span>{step.title}</span>
                      </span>
                    </h3>
                    {/* text-ink/70, not opacity-70: .card-body's keyframe ends
                        at opacity 1 and would wash element opacity back up. */}
                    <p className="card-body max-w-[441px] text-base leading-[1.33] text-ink/70">
                      {step.body}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
