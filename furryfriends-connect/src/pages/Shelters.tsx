import SheltersListing from "@/components/SheltersListing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SheltersPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="bg-warm-gradient py-12 text-center">
      <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
        Partner Shelters & NGOs
      </h1>
      <p className="mt-2 text-muted-foreground">Organizations making a difference for stray dogs</p>
    </div>
    <SheltersListing />
    <Footer />
  </div>
);

export default SheltersPage;
