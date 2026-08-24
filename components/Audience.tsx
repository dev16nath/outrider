import AudienceTrace, { type AudienceTraceName } from "./AudienceTrace";
import HoverWords from "./HoverWords";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { asset } from "@/lib/asset";

/** Figma group offsets inside the 389 x 280 illustration box */
const cards: {
  src: string;
  trace: AudienceTraceName;
  box: { left: string; top: string; width: string; height: string };
  title: string;
  body: string;
}[] = [
  {
    src: "/assets/audience-1-soc.svg",
    trace: "soc",
    box: { left: "29.563%", top: "33.929%", width: "40.764%", height: "32.143%" },
    title: "SOC Analyst",
    body: "Fewer false alarms. Every alert already scored and enriched, so you chase real threats instead of noise.",
  },
  {
    src: "/assets/audience-2-intel.svg",
    trace: "intel",
    box: { left: "29.563%", top: "33.929%", width: "41.037%", height: "32.143%" },
    title: "Threat Intel Lead",
    body: "External signal you can't get from inside the perimeter, credentials, domains, and chatter, attributed and in context.",
  },
  {
    src: "/assets/audience-3-ciso.svg",
    trace: "ciso",
    box: { left: "27.763%", top: "39.286%", width: "44.667%", height: "21.428%" },
    title: "CISO",
    body: "A clear view of what's forming against your company, and proof your team is ahead of it.",
  },
];

export default function Audience() {
  return (
    <section
      id="audience"
      className="frame flex flex-col items-start gap-8 py-16 md:py-[72px]"
      data-node-id="39:4298"
    >
      <Reveal className="w-full">
        <SectionHeading
          title={<HoverWords>For the team that would rather see it coming.</HoverWords>}
          titleClassName="max-w-[631px]"
          kicker="One line of sight for everyone doing the watching"
          cta={{ label: "Sign up", href: "#signup" }}
        />
      </Reveal>

      <ul className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map(({ src, trace, box, title, body }, i) => (
          <Reveal
            key={title}
            as="li"
            delay={i * 90}
            distance={20}
            className="flex flex-col justify-between gap-6 bg-sand p-4 md:min-h-[427px]"
          >
            <div className="relative w-full overflow-hidden border border-rule-warm bg-sand aspect-[389/280]">
              <img
                src={asset(src)}
                alt=""
                aria-hidden
                className="absolute"
                style={box}
              />
              {/* Same box as the <img>, so the overlay's viewBox lands exactly
                  on the printed shapes at any card width. */}
              <AudienceTrace name={trace} style={box} />
            </div>
            <div className="flex flex-col gap-2 text-ink">
              <h3 className="text-2xl leading-[1.33]">{title}</h3>
              <p className="text-sm leading-[1.2] opacity-70">{body}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
