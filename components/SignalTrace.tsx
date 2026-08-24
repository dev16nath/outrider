/**
 * An orange pulse run along the lines printed in the problem-card artwork.
 *
 * The art is flattened SVG exported from Figma, so nothing inside it can be
 * animated. Each variant below traces the centrelines of that card's lines in
 * a transparent overlay sharing the artwork's 389 x 280 viewBox, so the pulse
 * sits exactly on the printed line at any card width. All geometry is read off
 * the exports rather than eyeballed.
 *
 * Every variant moves at one speed — about 0.109 units/ms — so a pulse crossing
 * the narrow bracket and one lapping the wide listing box travel alike. Only
 * the distance differs, which is what sets each card's cycle length. The cards
 * drift out of phase with each other, and that is fine; a pulse that crawls
 * because its card's line is short is not.
 */
type Variant = {
  /** Centrelines to trace, in artwork coordinates. */
  paths: string[];
  /** Where the dash sits at the top of the cycle. 24 (its own length) parks
   *  it just off the start of an open path; 0 puts it on the line at once. */
  start: number;
  /** Units the dash travels per cycle. On an open path this must clear the
   *  longest run, and the overshoot is the beat of quiet before the next
   *  pulse leaves. On a closed path it is exactly one lap. */
  run: number;
  /** Dash gap. On an open path, larger than `run` so only one pulse is ever
   *  in flight. On a closed path, `24 + gap` must equal the perimeter so the
   *  pattern wraps onto itself and the lap never breaks. */
  gap: number;
  /** (24 + run) at the shared speed, or one lap for a closed path. */
  dur: number;
};

export const TRACES = {
  /* Breach dump: trunk x 196.849, junction y 183.16, boxes y 209.683,
     arms out to x 59.371 / 334.327. Three branches leave together; the
     short centre run simply lands first. */
  breach: {
    paths: [
      "M196.849 156.64V183.16H59.371V209.683",
      "M196.849 156.64V209.683",
      "M196.849 156.64V183.16H334.327V209.683",
    ],
    start: 24,
    run: 260,
    gap: 600,
    dur: 2600,
  },
  /* Lookalike domain: the dashed bracket, traced in the direction the
     artwork's arrowhead points — up off the real login page, across, then
     down into the spoof. Ends at y 91.551, where the arrow begins. */
  domain: {
    paths: ["M112.901 95.655V72.34H276.099V91.551"],
    start: 24,
    run: 260,
    gap: 600,
    dur: 2600,
  },
  /* Access listing: the one line in the card is the box around the Acme Corp
     row, so the pulse laps it clockwise from the top-left. Closed with Z so
     the last corner joins the first.

     This one never rests. Its 505.66-unit perimeter is travelled in exactly
     one cycle, and 24 + 481.66 makes the dash pattern repeat on precisely
     that perimeter — so as the dash leaves the last corner the next is
     already entering the first, and the lap reads as unbroken rather than
     dimming out and starting over. Starting at 0 puts it on the line from
     the first frame. 4600ms is one lap at the shared speed, so it circles
     at the same pace the other two cross their lines. */
  listing: {
    paths: ["M84.299 122.651H305.957V153.822H84.299Z"],
    start: 0,
    run: 505.66,
    gap: 481.66,
    dur: 4600,
  },
} satisfies Record<string, Variant>;

/**
 * The artwork's own outer frame, lapped clockwise from the top-left.
 *
 * Identical on all three cards — every export prints it as
 * `M.5.5h388v279H.5z`, a 1-unit beige stroke centred half a unit in from each
 * edge of the viewBox — so it is not variant data and lives here instead.
 * Tracing the same centreline puts the pulse on the printed frame, and the
 * overlay is inset-0 against the artwork's padding box, so it lands on the
 * SVG's own line rather than on the CSS border outside it.
 *
 * Closed, on the listing box's terms: 24 + 1310 is exactly the 1334-unit
 * perimeter, so the dash pattern repeats on precisely one lap and the frame
 * never dims out and restarts. 12135ms is that perimeter at the shared speed
 * — a long way round at the same pace everything else moves, not a slow pulse.
 */
const FRAME = {
  path: "M0.5 0.5H388.5V279.5H0.5Z",
  run: 1334,
  gap: 1310,
  dur: 12135,
};

export type TraceName = keyof typeof TRACES;

export default function SignalTrace({ name }: { name: TraceName }) {
  const { paths, start, run, gap, dur } = TRACES[name];

  return (
    <svg
      aria-hidden
      viewBox="0 0 389 280"
      fill="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {/* Its own group: the dash pattern IS the timing here, so a frame that
          laps unbroken cannot share a dasharray with lines that rest between
          pulses. */}
      <g
        className="trace-pulse"
        stroke="var(--color-rule-warm-deep)"
        strokeWidth={1.4}
        strokeLinecap="round"
        style={
          {
            "--trace-glow": "rgb(163 148 106 / 0.55)",
            "--trace-start": "0px",
            "--trace-run": `-${FRAME.run}px`,
            "--trace-gap": `${FRAME.gap}px`,
            "--trace-dur": `${FRAME.dur}ms`,
          } as React.CSSProperties
        }
      >
        <path d={FRAME.path} />
      </g>

      <g
        className="trace-pulse"
        stroke="var(--color-signal-orange)"
        strokeWidth={1.4}
        strokeLinecap="round"
        style={
          {
            "--trace-start": `${start}px`,
            "--trace-run": `-${run}px`,
            "--trace-gap": `${gap}px`,
            "--trace-dur": `${dur}ms`,
          } as React.CSSProperties
        }
      >
        {paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
