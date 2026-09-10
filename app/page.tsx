import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import WhyVehix from "@/components/WhyVehix";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import StickerStore from "@/components/StickerStore";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030712] text-white">
      <Navbar />

      <Hero />

      <Stats />

      <WhyVehix />

      <Features />

      <HowItWorks />

      <StickerStore />

      <Testimonials />

      <Footer />
    </main>
  );
}