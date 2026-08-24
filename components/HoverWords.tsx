/**
 * Splits a line into individually hoverable words. Each word is assigned
 * one of the three signal accents, cycling orange -> blue -> green, and
 * takes that colour while the pointer is over it.
 *
 * The colours come from the theme tokens rather than literal hexes, so
 * they stay exactly #ffa347 / #478dff / #669e41 and move with the theme
 * if those ever change. Whitespace is preserved as its own text node, so
 * the line still breaks and wraps exactly as plain text would.
 */
const ACCENTS = [
  "var(--color-signal-orange)",
  "var(--color-signal-blue)",
  "var(--color-signal-green)",
] as const;

export default function HoverWords({ children }: { children: string }) {
  // Capture the gaps as well as the words, so both survive the split.
  const parts = children.split(/(\s+)/);
  let word = 0;

  return (
    <>
      {parts.map((part, i) => {
        if (!part.trim()) return part;
        const accent = ACCENTS[word++ % ACCENTS.length];
        return (
          <span
            key={i}
            style={{ "--accent": accent } as React.CSSProperties}
            className="transition-colors duration-(--dur-hover) ease-out hover:text-[var(--accent)]"
          >
            {part}
          </span>
        );
      })}
    </>
  );
}
