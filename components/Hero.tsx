import Button from "./Button";
import HoverWords from "./HoverWords";
import HeroCollage from "./HeroCollage";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section className="frame flex flex-col pb-16 md:pb-[72px]" data-node-id="39:2749">
      <div className="flex w-full flex-col gap-8 md:gap-12">
        <HeroCollage />
        <div className="flex w-full flex-col items-start justify-between gap-8 md:flex-row md:gap-12">
          <div className="flex max-w-[815px] flex-col items-start gap-6 text-ink">
            <Reveal delay={620}>
              <h1 className="font-display text-display-hero leading-none tracking-[-0.02em]">
                <HoverWords>Ride ahead of the threat, before it reaches you.</HoverWords>
              </h1>
            </Reveal>
            <Reveal delay={740}>
              <p className="max-w-[727px] text-lg leading-[1.33] opacity-70 md:text-xl">
                Outrider watches the outside world: leaked credentials, spoofed
                domains, dark-web chatter, and warns your team while the attack is
                still forming.
              </p>
            </Reveal>
          </div>
          <Reveal delay={860}>
            <Button href="#demo">Request a demo</Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
