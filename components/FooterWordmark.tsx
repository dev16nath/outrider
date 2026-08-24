/**
 * The footer wordmark, letter by letter.
 *
 * The export is one flat <g> of two <path>s — every letter, every counter and
 * the mark merged together — so nothing in it could be addressed on its own.
 * Rather than redraw it as live type (Zarathustra sets the wordmark, but the
 * export carries its own optical spacing, and matching that back out of font
 * metrics would drift), the original path data is split into its subpaths and
 * regrouped: the counters of O/d/e and the diamond over the i nest inside
 * their letter's x-range, so plain interval merging reassembles the glyphs
 * exactly. Each glyph's subpaths are then rejoined into a single <path>, which
 * is what keeps its counters hollow; see the note at the render below. The
 * union of the paths is the original file, unchanged — the wordmark renders
 * pixel for pixel as it did as an <img>.
 *
 * `hit` is a full-height band per glyph, not the letter's own outline. The
 * bands tile the whole 1312-unit width, each gap split down its middle, so the
 * pointer is always over exactly one glyph and never falls between two — which
 * is what makes only ever one letter light at a time, with no dead space and
 * no moment where two are lit at once.
 *
 * Accents cycle orange -> blue -> green, the same three signals HoverWords
 * runs through the headings, so a letter here answers the pointer in the same
 * voice a word up the page does. The fill lives in .wordmark-glyph rather
 * than a Tailwind hover: utility — see the note in globals.css.
 */
const ACCENTS = [
  "var(--color-signal-orange)",
  "var(--color-signal-blue)",
  "var(--color-signal-green)",
] as const;

/** Solved from the export's own geometry — see the note above. `hit` is
 *  [x, width] of the glyph's band in viewBox units. */
const GLYPHS: { name: string; hit: [number, number]; d: string[] }[] = [
  {
    name: "mark",
    hit: [0, 328.56],
    d: [
      "M219.053 64.087V0H0V283H71.819V128.174H154.925V64.087Z",
      "M219.053 64.087V128.174H154.925V283H283.181V64.087Z",
    ],
  },
  {
    name: "O",
    hit: [328.56, 216.83],
    d: [
      "M457.127 59.706C508.709 59.706 537.289 103.128 537.289 146.783C537.289 186.954 511.265 229.215 454.803 229.215C403.686 229.215 373.944 184.4 373.944 140.281C373.944 96.626 403.686 59.706 457.127 59.706",
      "M512.195 149.337C512.195 112.881 491.515 74.799 454.106 74.799C415.536 74.799 399.503 106.611 399.503 137.959C399.503 174.415 421.112 213.426 458.056 213.426C492.677 213.426 512.195 185.561 512.195 149.337",
    ],
  },
  {
    name: "u",
    hit: [545.4, 140.15],
    d: [
      "M660.622 190.902C660.622 210.639 672.239 214.819 681.301 216.676V228.054C678.048 228.519 675.027 228.751 672.472 228.751C652.721 228.751 644.124 216.909 640.407 207.388C631.577 221.785 619.727 228.751 604.392 228.751C583.712 228.751 566.054 213.658 566.054 192.063V145.389C566.054 131.922 561.871 127.51 553.506 125.884V117.06C557.224 116.596 564.892 116.132 583.48 107.308L587.895 108.701V186.49C587.895 199.493 594.168 212.497 610.433 212.497C626.93 212.497 638.548 196.01 638.548 187.186V144.925C638.548 131.457 634.598 127.277 626.233 126.116V117.06C633.436 117.06 646.68 111.487 656.207 107.308L660.622 108.701Z",
    ],
  },
  {
    name: "t",
    hit: [685.54, 83.28],
    d: [
      "M730.913 188.347C730.913 201.351 735.327 215.051 750.663 215.051C753.683 215.051 757.633 214.354 762.28 212.961V221.32C756.471 225.036 748.804 227.358 740.904 227.358C724.407 227.358 707.91 217.605 707.91 186.722V121.704H689.786V109.63C697.686 107.772 709.304 103.128 715.345 75.728L717.436 63.188H731.145V109.63H759.027V121.704H730.913Z",
    ],
  },
  {
    name: "r",
    hit: [768.82, 100.13],
    d: [
      "M863.431 113.577L848.793 133.315C844.611 126.813 838.337 125.188 833.922 125.188C825.093 125.188 812.313 136.101 812.313 154.678V195.778C812.313 210.407 819.284 216.676 824.396 218.998V225.965C817.658 225.965 809.293 225.268 801.16 225.268C792.796 225.268 784.431 225.965 778.157 225.965V218.998C783.269 216.676 790.472 210.639 790.472 195.778V140.978C789.775 135.172 787.452 128.671 777.46 128.671H775.369V118.918C783.734 118.221 794.422 116.364 807.434 110.094L812.313 111.487V129.367C816.496 119.615 828.578 106.843 843.216 106.843C850.884 106.843 858.552 109.165 863.431 113.577",
    ],
  },
  {
    name: "i",
    hit: [868.95, 64.73],
    d: [
      "M910.954 195.778C910.954 209.942 917.46 216.676 923.501 218.998V226.197L916.531 225.732C912.116 225.5 906.54 225.268 900.034 225.268C894.225 225.268 888.881 225.5 884.466 225.732L877.728 226.197V218.998C881.91 216.676 889.113 210.871 889.113 195.778V145.389C889.113 132.386 880.051 127.974 874.475 126.116V119.15C891.204 116.596 903.054 109.862 913.975 103.592L918.39 110.326C913.975 114.274 910.954 121.937 910.954 132.85Z",
      "M897.942 91.982L877.495 71.316L897.942 51.114L918.39 71.316Z",
    ],
  },
  {
    name: "d",
    hit: [933.69, 148.86],
    d: [
      "M1055.4 186.722C1055.4 209.246 1066.78 214.819 1075.38 216.676V228.054C1072.13 228.519 1069.11 228.751 1066.55 228.751C1047.03 228.751 1037.74 217.141 1034.49 207.388C1025.66 218.07 1014.04 228.983 993.593 228.983C961.064 228.983 943.87 199.029 943.87 167.913C943.87 140.281 959.437 107.54 996.149 107.54C1013.34 107.54 1024.73 116.364 1032.4 125.188V86.874C1032.4 81.301 1030.07 77.121 1027.28 74.334C1024.26 71.78 1020.55 70.387 1017.76 69.691V62.724C1027.05 61.564 1040.53 59.009 1060.51 47.167L1064.93 53.901C1060.28 57.848 1055.4 64.582 1055.4 78.514Z",
      "M1032.63 192.759V141.21C1024.96 131.457 1014.74 122.169 999.867 122.169C975.934 122.169 965.478 143.764 965.478 163.501C965.478 186.954 978.723 210.175 1002.19 210.175C1020.55 210.175 1028.91 199.725 1032.63 192.759",
    ],
  },
  {
    name: "e",
    hit: [1082.54, 131.9],
    d: [
      "M1158.95 210.175C1180.79 210.175 1193.8 201.583 1199.61 194.385L1204.96 200.19C1191.01 220.16 1169.87 229.68 1149.42 229.68C1114.1 229.68 1089.71 201.119 1089.71 167.681C1089.71 136.333 1108.99 108.004 1147.8 108.004C1186.6 108.004 1200.54 138.656 1204.26 165.824H1113.87C1113.87 191.598 1135.48 210.175 1158.95 210.175",
      "M1177.3 152.356C1174.05 134.94 1162.43 121.008 1144.08 121.008C1118.75 121.008 1114.8 141.442 1114.34 152.356Z",
    ],
  },
  {
    name: "r2",
    hit: [1214.45, 97.55],
    d: [
      "M1312 113.577L1297.36 133.315C1293.18 126.813 1286.91 125.188 1282.49 125.188C1273.66 125.188 1260.88 136.101 1260.88 154.678V195.778C1260.88 210.407 1267.85 216.676 1272.96 218.998V225.965C1266.23 225.965 1257.86 225.268 1249.73 225.268C1241.36 225.268 1233 225.965 1226.73 225.965V218.998C1231.84 216.676 1239.04 210.639 1239.04 195.778V140.978C1238.34 135.172 1236.02 128.671 1226.03 128.671H1223.94V118.918C1232.3 118.221 1242.99 116.364 1256 110.094L1260.88 111.487V129.367C1265.06 119.615 1277.15 106.843 1291.79 106.843C1299.45 106.843 1307.12 109.165 1312 113.577",
    ],
  },
];

export default function FooterWordmark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1312 283"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      className={className}
    >
      {GLYPHS.map(({ name, hit, d }, i) => (
        <g
          key={name}
          style={
            {
              "--accent": ACCENTS[i % ACCENTS.length],
              "--i": i,
              "--n": GLYPHS.length,
            } as React.CSSProperties
          }
          className="wordmark-glyph"
        >
          {/* The band the pointer actually hits. fill="none" is the rect's own
              presentation attribute, so it is not touched by the fill rule on
              the group above; pointer-events keeps it hit-testable anyway. */}
          <rect
            x={hit[0]}
            y={0}
            width={hit[1]}
            height={283}
            fill="none"
            pointerEvents="all"
          />
          {/* One <path>, not one per subpath. The counters of O/d/e are
              punched by nonzero winding against their own outline, which only
              works while they share a path element — split apart, each counter
              becomes a shape in its own right and fills solid. */}
          <path d={d.join("")} />
        </g>
      ))}
    </svg>
  );
}
