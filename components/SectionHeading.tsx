import Button from "./Button";

type Props = {
  title: React.ReactNode;
  /** Figma: Geist 20px, leading 1.2, 70% ink */
  kicker?: React.ReactNode;
  cta?: { label: string; href?: string };
  titleClassName?: string;
  kickerClassName?: string;
};

export default function SectionHeading({
  title,
  kicker,
  cta,
  titleClassName = "",
  kickerClassName = "",
}: Props) {
  return (
    <div className="flex w-full flex-col items-start justify-between gap-6 md:flex-row md:gap-12">
      <div className="flex flex-col items-start justify-center gap-4">
        <h2
          className={`font-display text-display-section leading-none tracking-[-0.02em] text-ink ${titleClassName}`}
        >
          {title}
        </h2>
        {kicker ? (
          <p className={`text-lg leading-[1.2] opacity-70 md:text-xl ${kickerClassName}`}>
            {kicker}
          </p>
        ) : null}
      </div>
      {cta ? <Button href={cta.href}>{cta.label}</Button> : null}
    </div>
  );
}
