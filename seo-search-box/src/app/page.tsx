import { MarketingNavbar } from "@/components/common/MarketingNavbar";
import { Hero } from "@/components/marketing/Hero";
import { Services } from "@/components/marketing/Services";
import { Stats } from "@/components/marketing/Stats";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Pricing } from "@/components/marketing/Pricing";
import { FAQ } from "@/components/marketing/FAQ";
import { CTA } from "@/components/marketing/CTA";
import { Footer } from "@/components/marketing/Footer";

export default function HomePage() {
  return (
    <div className="marketing-page">
      <MarketingNavbar />
      <Hero />
      <Services />
      <Stats />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
