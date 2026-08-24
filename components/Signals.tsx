import Image from "next/image";
import HoverWords from "./HoverWords";
import Reveal from "./Reveal";
import { asset } from "@/lib/asset";

/**
 * The painting's two colour blocks, measured off signals-dashboard.png
 * (1312 x 960) and expressed as percentages, which hold because the image
 * renders at the same 1.3667 aspect and so is never cropped.
 *
 * `color` is the source for a colour blend, so only its hue and saturation
 * matter — and "saturation" there is the spec's Sat(), max channel minus min,
 * NOT HSL saturation. Converting via HSL blows that out (orange came to 255
 * against the printed block's 188) and the overlay stops being invisible at
 * rest. So each source is simply the printed block's own median pixel: its
 * hue and Sat() are right by construction, and its luminance is discarded by
 * the blend anyway.
 * `grow` is the scale that just reaches the frame edge the block is
 * anchored away from: orange is pinned at its bottom and reaches up,
 * green is pinned at its top and reaches down.
 */
const BLOCKS = [
  {
    name: "orange",
    // Full width, most of which the dashboard card hides. The pair is
    // clearly matched — same 307px height, stacked, and the green ends at
    // the frame edge while this one ends exactly where the green begins —
    // so it takes the green's width and runs x1102-1206. .plate-blocks is
    // clipped around the card, so the buried part never paints over it.
    left: "83.994%",
    top: "18.750%",
    width: "8.003%",
    height: "31.979%",
    color: "#ffab43",
    origin: "bottom",
    grow: 1.586,
  },
  {
    name: "green",
    left: "91.997%",
    top: "50.833%",
    width: "8.003%",
    height: "31.979%",
    color: "#406811",
    origin: "top",
    grow: 1.537,
  },
];

/** One accent per line, in the order the shine visits them — and the colour
 *  of that line's bullet too, so the marker names which pass is coming.
 *  Theme tokens rather than hexes, so they stay the same blue/orange/green
 *  the tags and the hero's hover words use. */
const SHINE = [
  "var(--color-signal-blue)",
  "var(--color-signal-orange)",
  "var(--color-signal-green)",
];

const signals = [
  "Leaked and stolen credentials",
  "Phishing kits and pages targeting your brand",
  "Dark-web and Telegram chatter naming you",
];

export default function Signals() {
  return (
    <section className="frame py-16 md:py-[72px]" data-node-id="39:3792">
      <div className="grid grid-cols-1 items-center gap-10 md:min-h-[512px] md:grid-cols-[493px_1fr] md:gap-[163px]">
        <Reveal className="flex flex-col items-start justify-center gap-10 md:gap-16">
          <h2 className="font-display text-display-section leading-none tracking-[-0.02em] text-ink">
            <HoverWords>The signals that come before an attack.</HoverWords>
          </h2>
          {/* Square markers, matching the step tags' dot rather than a disc.
              ::marker cannot be given a shape, so the list drops its own
              markers and draws them: absolutely positioned, so the text keeps
              the exact left edge the discs gave it, and centred against the
              first line box (1lh) so it holds whatever the leading is. */}
          <ul className="ms-[30px] max-w-[441px] list-none text-lg leading-[1.49] opacity-70 md:text-xl">
            {signals.map((s, i) => (
              <Reveal
                as="li"
                key={s}
                delay={200 + i * 110}
                style={{ "--k": i, "--shine": SHINE[i % SHINE.length] } as React.CSSProperties}
                className="relative"
              >
                {/* Outside .signal-shine on purpose: that span goes
                    color: transparent to show its clipped gradient, and a
                    marker inside it would go transparent too. --shine is set
                    on the <li>, so it reaches here by inheritance and the
                    bullet carries the same accent its line's shine does. */}
                <span
                  aria-hidden
                  className="absolute -left-5 top-0 flex h-[1lh] items-center"
                >
                  <span className="size-2 bg-[var(--shine)]" />
                </span>
                <span className="signal-shine">{s}</span>
              </Reveal>
            ))}
          </ul>
        </Reveal>

        {/* image 21 + dashboard, clipped to the Figma 656 x 480 window */}
        <Reveal delay={160} distance={20} className="relative w-full aspect-[656/480]">
          {/* Same entrance the Problem cards and How-it-works steps use: the
              plate lands, then .card-scan wipes its contents in left to right.
              It sits on an inner div rather than the observed element, as it
              does there. `isolate` has to stay explicit even though the clip
              would create a stacking context on its own — under reduced motion
              there is no clip, and without it the blocks' colour blend would
              reach the page behind the plate. */}
          <div className="card-scan relative isolate h-full w-full overflow-hidden">
          <Image
            src={asset("/assets/signals-dashboard.png")}
            alt="Outrider dashboard showing critical signals, domains watched, and open actions"
            fill
            sizes="(min-width: 768px) 656px, 100vw"
            className="object-cover"
          />
          {/* The `isolate` is on the wrapper above, not here — these have to
              blend against the image, which is its sibling. See .plate-block
              in globals.css for why they can only grow, not travel. */}
          <div className="plate-blocks pointer-events-none absolute inset-0" aria-hidden>
            {BLOCKS.map((b, i) => (
              <span
                key={b.name}
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
          {/* The card, painted back over the blocks from the same image so
              their buried halves stay buried. This rather than clipping the
              blocks — see .plate-block in globals.css. */}
          <Image
            src={asset("/assets/signals-dashboard.png")}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 768px) 656px, 100vw"
            className="plate-card pointer-events-none object-cover"
          />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
