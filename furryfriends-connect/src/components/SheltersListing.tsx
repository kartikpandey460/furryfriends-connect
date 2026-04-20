import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Star, Dog } from "lucide-react";

interface Shelter {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  dogsCount: number;
  rating: number;
  image: string;
}

const ShelterCard = ({ shelter }: { shelter: Shelter }) => (
  <Card className="overflow-hidden border shadow-card transition-all hover:shadow-elevated">
    <div className="relative h-48 overflow-hidden">
      <img src={shelter.image} alt={shelter.name} loading="lazy" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
      <div className="absolute bottom-3 left-4">
        <h3 className="font-display text-lg font-bold text-primary-foreground">{shelter.name}</h3>
      </div>
      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold">
        <Star className="h-3 w-3 text-primary" fill="currentColor" />
        {shelter.rating}
      </div>
    </div>
    <CardContent className="p-4 space-y-3">
      <p className="text-sm text-muted-foreground line-clamp-2">{shelter.description}</p>
      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />{shelter.location}</div>
        <div className="text-xs text-muted-foreground">{shelter.address}</div>
        <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-primary" />{shelter.phone}</div>
        <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-primary" />{shelter.email}</div>
      </div>
    </CardContent>
  </Card>
);

const SheltersListing = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/shelters')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Unable to load shelters');
        }
        return res.json();
      })
      .then(setShelters)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="text-base text-muted-foreground">Loading shelters...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="text-base text-destructive">{error}</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Our Partner Shelters & NGOs
        </h2>
        <p className="mt-2 text-muted-foreground">
          Incredible organizations working tirelessly for stray dog welfare.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {shelters.map((s) => (
          <ShelterCard key={s.id} shelter={s} />
        ))}
      </div>
    </section>
  );
};

export default SheltersListing;
