import Link from "next/link";
import FooterWordmark from "./FooterWordmark";
import Reveal from "./Reveal";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "#" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Coverage", href: "#" },
      { label: "Coverage", href: "#" },
      { label: "Request a demo", href: "#demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Threat reports", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Security", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Responsible Disclosure", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-sand" data-node-id="39:4357">
      <div className="frame flex flex-col items-center gap-12 pb-12 pt-16 md:pt-[72px]">
        <div className="flex w-full flex-col items-start gap-12 md:gap-[72px]">
          <nav className="grid w-full grid-cols-2 gap-8 text-base leading-[1.33] text-ink sm:grid-cols-4 md:flex md:justify-between">
            {columns.map(({ title, links }, i) => (
              <Reveal key={title} delay={i * 70} className="flex flex-col items-start gap-1">
                <p className="whitespace-nowrap">{title}</p>
                {links.map(({ label, href }, i) => (
                  <Link
                    key={`${label}-${i}`}
                    href={href}
                    className="whitespace-nowrap opacity-70 transition-[opacity,transform] duration-(--dur-hover) ease-out hover:translate-x-0.5 hover:opacity-100 motion-reduce:transform-none"
                  >
                    {label}
                  </Link>
                ))}
              </Reveal>
            ))}
          </nav>
          {/* w-full is on the wrapper, not just the svg. The column is
              items-start, so this row shrink-to-fits — which the old <img>
              filled off its 1312px intrinsic width. An inline <svg> has no
              intrinsic width, so without this it collapses to the replaced
              element default of 300px and w-full resolves against that. */}
          <Reveal distance={24} className="w-full">
            <FooterWordmark className="block w-full aspect-[557/120]" />
          </Reveal>
        </div>
        <p className="text-base leading-[1.33] text-ink">
          © 2026 Outrider. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
