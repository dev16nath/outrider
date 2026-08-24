"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";

const links = [
  { label: "Home", href: "#" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-50 w-full bg-cream/80 shadow-[0_1px_0_0_transparent] backdrop-blur-sm transition-[box-shadow,background-color] duration-(--dur-hover) data-[scrolled=true]:bg-cream/95 data-[scrolled=true]:shadow-[0_1px_0_0_var(--color-rule)]"
      data-node-id="39:2743"
    >
      <nav className="frame flex items-center justify-between py-6 md:min-h-[97px]">
        <Link href="#" aria-label="Outrider home" className="shrink-0">
          <Image
            src={asset("/assets/logo-wordmark.svg")}
            alt="Outrider"
            width={149}
            height={32}
            priority
            className="h-7 w-[131px] transition-opacity duration-(--dur-hover) hover:opacity-70 sm:h-8 sm:w-[149px]"
          />
        </Link>
        <ul className="flex items-center gap-4 py-2 text-sm leading-[1.2] tracking-[-0.03em] text-ink-nav sm:gap-6 sm:text-base md:gap-8 md:text-xl">
          {links.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="relative inline-block after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-(--dur-hover) after:ease-out hover:after:origin-left hover:after:scale-x-100"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
