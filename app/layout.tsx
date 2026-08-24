import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const zarathustra = localFont({
  src: "./fonts/Zarathustra.otf",
  variable: "--font-zarathustra",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Outrider — Ride ahead of the threat",
  description:
    "Outrider watches the outside world: leaked credentials, spoofed domains, dark-web chatter, and warns your team while the attack is still forming.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${zarathustra.variable} h-full antialiased`}
    >
      <head>
        <noscript>
          {/* The reveal styles hide content until JS marks it shown. */}
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
