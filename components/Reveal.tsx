"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  /** Stagger, in ms, against its siblings. */
  delay?: number;
  /** Rise distance; cards travel a little further than text. */
  distance?: number;
  className?: string;
  as?: "div" | "li" | "section" | "header" | "footer";
  /** Merged after --d / --reveal-y, for custom properties the caller needs
   *  on the observed element itself (How-it-works' --i stack index). */
  style?: React.CSSProperties;
};

/**
 * Fades and rises its children once, when they first scroll into view.
 * The visual states live in globals.css so they can sit inside a
 * prefers-reduced-motion query; this only flips the data attribute.
 */
export default function Reveal({
  children,
  delay = 0,
  distance,
  className = "",
  as: Tag = "div",
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.shown = "true";
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.shown = "true";
        io.disconnect();
      },
      // Fire a little before the element is fully on screen, so the
      // motion reads as the page settling rather than as a jump.
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal=""
      className={className}
      style={
        {
          "--d": `${delay}ms`,
          ...(distance ? { "--reveal-y": `${distance}px` } : {}),
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
