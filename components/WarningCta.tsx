import Image from "next/image";
import Button from "./Button";
import HoverWords from "./HoverWords";
import Reveal from "./Reveal";
import { asset } from "@/lib/asset";

export default function WarningCta() {
  return (
    <section id="demo" className="frame py-16 md:py-[72px]" data-node-id="39:4286">
      {/* 1312 x 568 collage band with the cream card inset by 64 / 128 */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-10 md:aspect-[1312/568] md:px-16 md:py-32">
        <Image
          src={asset("/assets/cta-band.png")}
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 1440px) 1312px, 100vw"
          className="object-cover"
        />
        <Reveal delay={120} distance={18} className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-cream px-6 py-8 md:h-[312px] md:px-12 md:py-4">
          <div className="flex w-full flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex flex-col items-start justify-center gap-4">
              <h2 className="max-w-[472px] font-display text-display-cta leading-none tracking-[-0.02em] text-ink">
                <HoverWords>Days of warning, not a post-mortem.</HoverWords>
              </h2>
              <p className="max-w-[608px] text-base leading-[1.2] opacity-70 md:text-xl">
                The difference between reacting to a threat and reacting to a
                breach is time. Outrider gives you the head start — so you close
                the gap while it&rsquo;s still a gap.
              </p>
            </div>
            <Button href="#signup">Sign up</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
