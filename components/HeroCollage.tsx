import Image from "next/image";
import { asset } from "@/lib/asset";

/**
 * Each separation, positioned as a percentage of the Figma 1312 x 480
 * composition.
 *
 * `sMax` / `origin` are solved so that at the peak of the entrance the
 * block spans the composition exactly edge to edge:
 *   S = 100 / width        origin = left / (width * (S - 1))
 * See the .plate-stretch comment in globals.css.
 *
 * No JS: the entrance is pure CSS and the blocks hold their designed
 * position once settled.
 */
const SEPARATIONS = [
  {
    key: "orange",
    className: "left-[46.494%] top-[8.75%] h-[37.917%] w-[15.625%] bg-signal-orange",
    sMax: 6.4,
    origin: "55.104%",
    delay: 380,
  },
  {
    key: "blue",
    className: "left-[46.494%] top-[46.667%] h-[42.917%] w-[15.625%] bg-signal-blue",
    sMax: 6.4,
    origin: "55.104%",
    delay: 510,
  },
  {
    key: "green",
    className: "left-[31.707%] top-[46.667%] h-[42.917%] w-[14.786%] bg-signal-green",
    sMax: 6.7632,
    origin: "37.209%",
    delay: 640,
  },
] as const;

export default function HeroCollage() {
  return (
    <div className="relative w-full overflow-hidden bg-black aspect-[3/2] md:aspect-[1312/480]">
      <div className="absolute left-1/2 h-full -translate-x-1/2 aspect-[1312/480]">
        {/* image 16 — 1467x1010 at (-124, -200) */}
        <Image
          src={asset("/assets/hero-painting.png")}
          alt="Cavalry outriders scouting ahead of a column"
          fill
          priority
          sizes="100vw"
          className="hero-plate !absolute !left-[-9.451%] !top-[-41.667%] !h-[210.417%] !w-[111.814%] max-w-none object-cover"
        />
        {/* Vector — 756x756 centred at (349, 279) */}
        <img
          src={asset("/assets/hero-vector.svg")}
          alt=""
          aria-hidden
          className="hero-in absolute left-[-2.21%] top-[-20.625%] h-[157.5%] w-[57.622%] max-w-none mix-blend-hard-light [--d:260ms]"
        />
        {SEPARATIONS.map(({ key, className, sMax, origin, delay }) => (
          <div
            key={key}
            className={`plate-stretch absolute mix-blend-hard-light ${className}`}
            style={
              {
                "--d": `${delay}ms`,
                "--origin": origin,
                "--s-max": sMax,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
