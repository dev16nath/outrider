/**
 * Micro-motion for the audience-card illustrations.
 *
 * Same situation as SignalTrace: the art is flattened SVG out of Figma, so
 * nothing inside it can be animated. Each variant traces the centrelines of
 * that illustration's own shapes in a transparent overlay sharing its viewBox,
 * positioned with the identical `box` the <img> uses, so a pulse sits exactly
 * on the printed line at any card width. All geometry is solved from the
 * export's path data, never eyeballed.
 *
 * Every illustration reads the same way — one orange cell singled out by a
 * dark frame, surrounded by quiet beige geometry — so the motion says the same
 * thing on all three: the focus frame carries a pulse lapping it, and the
 * quiet shapes around it only breathe.
 *
 * SPEED — a deliberate departure. Everything else on the site moves at about
 * 0.109 units/ms, and these illustrations happen to render at almost exactly
 * 1:1 with the problem-card artwork (their 159-174 units span 40-45% of the
 * same 389-unit box). But their shapes are a quarter the size, so at the site
 * speed the smallest frame laps every 709ms, which buzzes rather than pulses.
 * This section runs at half that speed. It is still ONE speed across all five
 * runs here, so they stay consistent with each other.
 */
type Run = {
  /** Centreline in illustration coordinates. */
  path: string;
  /** Dash offset at the top of the cycle. The dash length parks it just off
   *  the start of an open path; 0 puts it on a closed one immediately. */
  start: number;
  /** Units travelled per cycle: one lap for a closed path, or enough to clear
   *  an open one, the overshoot being the beat of quiet before the next. */
  run: number;
  /** On a closed path, dash + gap must equal the perimeter exactly so the
   *  pattern wraps onto itself and the lap never breaks. On an open path,
   *  larger than `run` so only one pulse is ever in flight. */
  gap: number;
  dur: number;
};

/** The site's pulse length, shared with SignalTrace, and it has to be shared
 *  literally rather than proportionally: these illustrations render at almost
 *  exactly 1:1 with the problem-card artwork (their 159-174 units span 40-45%
 *  of the same 389-unit box, so one unit here is one unit there to within
 *  0.3%), and the stroke is the same 1.4. A shorter dash therefore does not
 *  read as a scaled-down pulse — it reads as a smaller pulse sitting next to
 *  the real one. It was 12, and against the problem cards that was visibly
 *  half-length.
 *
 *  It does mean the dash is a large fraction of the shorter loops here — a
 *  third of the intel frame's 78-unit perimeter — so those laps read as an
 *  arc sweeping the frame rather than a dot circling it. That is the correct
 *  trade: matching the pulse everywhere else on the page matters more than
 *  the pulse keeping its dot shape on the two smallest frames. */
const DASH = 24;

type Variant = {
  viewBox: string;
  runs: Run[];
  /** Ambient cells that breathe rather than travel. Rendered at `size` square,
   *  each on its own phase via --k. */
  cells?: { x: number; y: number; size: number; k: number }[];
};

/* The SOC grid: 5 x 3 cells on a 34.2857 pitch, each with a 1.261 border, so a
   cell's interior is 18.907 square at +1.261 from its corner. Every cell but
   the focus one (column 2, row 1) breathes. --k comes from index * 9 mod 14,
   which is a permutation because 9 and 14 are coprime — so all fourteen get a
   distinct phase and the grid flickers scattered rather than sweeping. */
const SOC_CELLS = (() => {
  const out: { x: number; y: number; size: number; k: number }[] = [];
  let i = 0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      if (c === 2 && r === 1) continue;
      out.push({
        x: +(c * 34.2857 + 1.261).toFixed(3),
        y: +(r * 34.2857 + 1.261).toFixed(3),
        size: 18.907,
        k: (i++ * 9) % 14,
      });
    }
  }
  return out;
})();

export const TRACES = {
  /* SOC analyst: the focus frame's centreline is the mean of the dark path's
     outer (62.52 / 28.235 to 96.05 / 61.765) and inner (63.782 / 29.495 to
     94.79 / 60.505) rects, giving a 32.269 square — 129.078 round. */
  soc: {
    viewBox: "0 0 159 90",
    runs: [
      {
        path: "M63.151 28.865H95.420V61.135H63.151Z",
        start: 0,
        run: 129.078,
        gap: 129.078 - DASH,
        dur: 2350,
      },
    ],
    cells: SOC_CELLS,
  },
  /* Threat intel: the small focus frame (19.497 square, 77.99 round) and the
     big outlined field it sits beside (89.13 square, 356.52 round). The field
     takes 4.6x as long simply because it is 4.6x the distance. */
  intel: {
    viewBox: "0 0 160 90",
    runs: [
      {
        path: "M121.596 32.466H141.093V51.964H121.596Z",
        start: 0,
        run: 77.99,
        gap: 77.99 - DASH,
        dur: 1420,
      },
      {
        path: "M0.435 0.435H89.565V89.565H0.435Z",
        start: 0,
        run: 356.52,
        gap: 356.52 - DASH,
        dur: 6490,
      },
    ],
  },
  /* CISO: the focus frame (34.752 square, 139.004 round), plus the rule the
     composition sits on. The rule is open, so its dash starts parked off the
     left edge and travels far enough to clear the full 173.755 before the
     next leaves. */
  ciso: {
    viewBox: "0 0 174 60",
    runs: [
      {
        path: "M10.859 24.570H45.611V59.321H10.859Z",
        start: 0,
        run: 139.004,
        gap: 139.004 - DASH,
        dur: 2530,
      },
      {
        path: "M0 41.946H173.755",
        start: DASH,
        run: DASH + 173.755,
        gap: 400,
        dur: 3630,
      },
    ],
  },
} satisfies Record<string, Variant>;

export type AudienceTraceName = keyof typeof TRACES;

export default function AudienceTrace({
  name,
  style,
}: {
  name: AudienceTraceName;
  style: React.CSSProperties;
}) {
  const variant: Variant = TRACES[name];

  return (
    <svg
      aria-hidden
      viewBox={variant.viewBox}
      fill="none"
      className="pointer-events-none absolute"
      style={style}
    >
      {variant.cells?.map(({ x, y, size, k }) => (
        <rect
          key={`${x}-${y}`}
          className="illus-cell"
          x={x}
          y={y}
          width={size}
          height={size}
          fill="var(--color-signal-orange)"
          style={{ "--k": k } as React.CSSProperties}
        />
      ))}
      {variant.runs.map(({ path, start, run, gap, dur }) => (
        <g
          key={path}
          className="trace-pulse"
          stroke="var(--color-signal-orange)"
          strokeWidth={1.4}
          strokeLinecap="round"
          style={
            {
              "--trace-dash": `${DASH}px`,
              "--trace-start": `${start}px`,
              "--trace-run": `-${run}px`,
              "--trace-gap": `${gap}px`,
              "--trace-dur": `${dur}ms`,
            } as React.CSSProperties
          }
        >
          <path d={path} />
        </g>
      ))}
    </svg>
  );
}
