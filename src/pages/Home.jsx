import { useLocation } from "react-router-dom";
import { Info } from "lucide-react";
import HeroSection from "../components/home/HeroSection";
import MarketTracker from "../components/home/MarketTracker";
import ServicesSection from "../components/home/ServicesSection";
import NewsSection from "../components/home/NewsSection";
import HowItWorks from "../components/home/HowItWorks"
import StatsSection from "../components/home/StatsSection";
import CTABanner from "../components/home/CTABanner";



function Home() {
  const location = useLocation();
  const flashMessage = location.state?.message;

  return (
    <div>
      {/* Flash message (e.g. redirected here from a locked dashboard) */}
      {flashMessage && (
        <div className="bg-amber-50 border-b border-amber-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2">
            <Info size={16} className="text-amber-600 flex-shrink-0" />
            <p className="text-amber-800 text-sm font-medium">{flashMessage}</p>
          </div>
        </div>
      )}
      <HeroSection />
       <MarketTracker/>
      <ServicesSection />
        <NewsSection/>
      <HowItWorks/>
      <StatsSection/>
        <CTABanner/>
      
       
    </div>
  );
}
export default Home;