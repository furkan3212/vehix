import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyVehix from "@/components/WhyVehix";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#0B0B0F] min-h-screen">
      <Navbar />
      <Hero />
      <WhyVehix />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <Footer />
    </main>
  );
}