import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, PawPrint } from "lucide-react";
import heroImage from "@/assets/hero-dog.jpg";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-warm-gradient">
    <div className="container mx-auto grid min-h-[85vh] items-center gap-8 px-4 py-16 md:grid-cols-2">
      <div className="z-10 animate-fade-in">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
          <PawPrint className="h-4 w-4" />
          Every stray deserves love
        </div>
        <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">
          Give a Furry Soul<br />
          <span className="text-gradient-warm">A Forever Home</span>
        </h1>
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">
          FurrySouls connects pet shelters and NGOs working for stray dog welfare 
          with compassionate adopters and donors across the city.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild size="lg" className="rounded-full px-8 text-base">
            <Link to="/dogs">
              <PawPrint className="mr-2 h-5 w-5" />
              Adopt Now
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-base">
            <Link to="/donate">
              <Heart className="mr-2 h-5 w-5" />
              Donate
            </Link>
          </Button>
        </div>
        <div className="mt-10 flex items-center gap-8 text-sm">
          <div>
            <span className="block font-display text-2xl font-bold text-foreground">500+</span>
            <span className="text-muted-foreground">Dogs Rescued</span>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <span className="block font-display text-2xl font-bold text-foreground">350+</span>
            <span className="text-muted-foreground">Happy Adoptions</span>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <span className="block font-display text-2xl font-bold text-foreground">₹15L+</span>
            <span className="text-muted-foreground">Donations Raised</span>
          </div>
        </div>
      </div>
      <div className="relative animate-scale-in">
        <div className="overflow-hidden rounded-3xl shadow-elevated">
          <img
            src={heroImage}
            alt="A happy golden retriever puppy in a sunlit garden"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute -bottom-4 -left-4 rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-success-foreground text-lg">
              🐾
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Just Adopted!</p>
              <p className="text-xs text-muted-foreground">Bruno found his forever home</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
