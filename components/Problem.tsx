import SectionHeading from "./SectionHeading";
import SignalTrace, { type TraceName } from "./SignalTrace";
import Reveal from "./Reveal";
import { asset } from "@/lib/asset";

const cards: { src: string; trace: TraceName; title: string; body: string }[] = [
  {
    src: "/assets/problem-1-credentials.svg",
    trace: "breach",
    title: "Credentials sold weeks ago.",
    body: "Your employees' logins surface in a breach dump and get traded on forums long before anyone notices.",
  },
  {
    src: "/assets/problem-2-domain.svg",
    trace: "domain",
    title: "Fake domain, already live.",
    body: "A lookalike of your login page goes up and starts collecting passwords while you're none the wiser.",
  },
  {
    src: "/assets/problem-3-access.svg",
    trace: "listing",
    title: "Access up for sale.",
    body: "A broker quietly lists entry to your network — named by company — and waits for a buyer.",
  },
];

export default function Problem() {
  return (
    <section
      id="problem"
      className="frame flex flex-col items-start gap-8 py-16 md:py-[72px]"
      data-node-id="39:2764"
    >
      <Reveal className="w-full">
        <SectionHeading
          title="The problem"
          kicker={
            <>
              By the time you see the breach,
              <br className="hidden md:block" /> it&rsquo;s already old news.
            </>
          }
          cta={{ label: "Get started", href: "#demo" }}
        />
      </Reveal>

      <ul className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map(({ src, trace, title, body }, i) => (
          <Reveal
            key={title}
            as="li"
            delay={i * 90}
            distance={20}
            className="overflow-hidden bg-sand"
          >
            {/* .card-scan clips the card's CONTENT, not the <li> itself, so
                the sand plate lands first and its contents then wipe across
                it. Clipping both together would make the card appear out of
                nothing. Keeping it off the observed element also keeps it
                clear of Chromium's IntersectionObserver, which this card
                learned the hard way once. */}
            <div className="card-scan relative overflow-hidden">
              <div className="flex flex-col gap-6 p-4">
                <div className="relative w-full overflow-hidden border border-rule-warm bg-sand">
                  <img
                    src={asset(src)}
                    alt=""
                    aria-hidden
                    width={389}
                    height={280}
                    className="block h-auto w-full"
                  />
                  <SignalTrace name={trace} />
                </div>
                <div className="flex flex-col gap-2 text-ink">
                  <h3 className="text-2xl leading-[1.33]">
                    <span className="card-line block overflow-hidden">
                      <span>{title}</span>
                    </span>
                  </h3>
                  <p className="card-body text-sm leading-[1.2] text-ink/70">{body}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
