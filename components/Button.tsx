import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
} & Omit<ComponentProps<"a">, "href">;

/** Opacity per position in the snake, head first — the length of this array
 *  is the length of the snake. Only the head is solid, and the falloff is
 *  steepest right behind it, so a longer tail still reads as one pixel
 *  dragging a wake rather than as a queue of pixels. */
const SNAKE = [1, 0.66, 0.5, 0.38, 0.28, 0.2, 0.13, 0.07];

/**
 * Figma: bg #ffa347, px 32 / py 16, Geist Medium 24px, leading 1.1.
 *
 * The label is the page's own cream (#fffcf3) rather than Figma's ink — a
 * deliberate departure, not drift. It buys a much softer button at the cost
 * of contrast: roughly 2.3:1 on the rest fill and 1.7:1 once hover
 * brightens it, against the 4.5:1 WCAG AA wants at this size. Switching
 * back is one class: text-cream -> text-ink.
 *
 * The button never moves. Hover is carried entirely by light: a band of
 * glow crosses it left to right, and underneath the fill settles onto the
 * brighter orange with a warm halo of its own hue. Both start together,
 * the sweep simply outlasts the fill.
 *
 * At rest a pixel walks the perimeter (see .btn-snake in globals.css) —
 * the one thing on the button that moves without being asked to.
 */
export default function Button({ children, href = "#", className = "", ...rest }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-signal-orange-deep px-8 py-4 text-xl leading-[1.1] font-medium whitespace-nowrap text-cream transition-[background-color,box-shadow] duration-(--dur-hover-slow) ease-(--ease-hover) hover:bg-signal-orange-bright hover:shadow-[0_10px_30px_-12px_rgba(240,145,47,0.75)] focus-visible:bg-signal-orange-bright active:bg-signal-orange active:shadow-none active:duration-75 motion-reduce:shadow-none md:text-2xl ${className}`}
      {...rest}
    >
      {/* The sheen. Parked off the left edge, driven clear off the right on
          hover, so the light passes through rather than landing on top. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent_25%,rgba(255,255,255,0.55)_50%,transparent_75%)] transition-transform duration-(--dur-sweep) ease-out group-hover:translate-x-full motion-reduce:hidden"
      />
      {/* Under the label (which is positioned) but over the fill, so the
          pixels pass behind the words at the top and bottom edges. */}
      <span aria-hidden className="btn-snake pointer-events-none">
        {SNAKE.map((o, k) => (
          <span key={k} style={{ "--k": k, "--snake-o": o } as React.CSSProperties} />
        ))}
      </span>
      <span className="relative">{children}</span>
    </Link>
  );
}
