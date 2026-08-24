import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Signals from "@/components/Signals";
import WarningCta from "@/components/WarningCta";
import Audience from "@/components/Audience";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <Hero />
        <Problem />
        <HowItWorks />
        <Signals />
        <WarningCta />
        <Audience />
      </main>
      <Footer />
    </>
  );
}
