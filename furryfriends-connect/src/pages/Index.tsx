import HeroSection from "@/components/HeroSection";
import DogsListing from "@/components/DogsListing";
import SheltersListing from "@/components/SheltersListing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <DogsListing />
    <SheltersListing />
    <Footer />
  </div>
);

export default Index;
