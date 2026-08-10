import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import WhyVehix from "@/components/WhyVehix";
import StickerStore from "@/components/StickerStore";
{/*import Features from "@/components/Features";*/}
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
{/*import FAQ from "@/components/FAQ";*/}
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="bg-[#030712] text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <WhyVehix />
      {/* <Features /> */}
      <HowItWorks />
      <StickerStore />
      <Testimonials />
     
      <Footer />
    </main>
  );
}