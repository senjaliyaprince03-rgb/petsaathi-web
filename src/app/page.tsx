import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import TrustSection from "@/components/TrustSection";
import Pricing from "@/components/Pricing";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-between w-full overflow-hidden">
      <Navbar />
      <Hero />
      <Services />
      <TrustSection />
      <HowItWorks />
      <Pricing />
      <Footer />
    </main>
  );
}
