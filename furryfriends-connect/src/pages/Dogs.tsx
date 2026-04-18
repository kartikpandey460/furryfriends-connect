import DogsListing from "@/components/DogsListing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DogsPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="bg-warm-gradient py-12 text-center">
      <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
        Dogs Available for Adoption
      </h1>
      <p className="mt-2 text-muted-foreground">Find your perfect furry companion</p>
    </div>
    <DogsListing />
    <Footer />
  </div>
);

export default DogsPage;
