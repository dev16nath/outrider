/**
 * Splits a line into individually hoverable words. Each word is assigned
 * one of the three signal accents, cycling orange -> blue -> green, and
 * takes that colour while the pointer is over it.
 *
 * The colours come from the theme tokens rather than literal hexes, so
 * they stay exactly #ffa347 / #478dff / #669e41 and move with the theme
 * if those ever change. Whitespace is preserved as its own text node, so
 * the line still breaks and wraps exactly as plain text would.
 *
 * The hover itself is .hover-accent in globals.css, NOT a Tailwind hover:
 * utility — see the note there. --i and --n let the same class drive the
 * pointerless fallback without the component knowing anything about it.
 */
const ACCENTS = [
  "var(--color-signal-orange)",
  "var(--color-signal-blue)",
  "var(--color-signal-green)",
] as const;

export default function HoverWords({ children }: { children: string }) {
  // Capture the gaps as well as the words, so both survive the split.
  const parts = children.split(/(\s+)/);
  const total = parts.filter((p) => p.trim()).length;
  let word = 0;

  return (
    <>
      {parts.map((part, i) => {
        if (!part.trim()) return part;
        const k = word++;
        return (
          <span
            key={i}
            style={
              {
                "--accent": ACCENTS[k % ACCENTS.length],
                "--i": k,
                "--n": total,
              } as React.CSSProperties
            }
            className="hover-accent"
          >
            {part}
          </span>
        );
      })}
    </>
  );
}
