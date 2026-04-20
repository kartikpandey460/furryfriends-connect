import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin, Shield, Scissors } from "lucide-react";
import { Link } from "react-router-dom";

interface Dog {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  image: string;
  description: string;
  shelterId: string;
  vaccinated: boolean;
  neutered: boolean;
}

interface Shelter {
  id: string;
  name: string;
}

const DogCard = ({ dog, shelters }: { dog: Dog; shelters: Shelter[] }) => {
  const shelter = shelters.find((s) => s.id === dog.shelterId);

  return (
    <Card className="group overflow-hidden border shadow-card transition-all hover:shadow-elevated hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={dog.image}
          alt={dog.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 flex gap-1.5">
          {dog.vaccinated && (
            <Badge className="bg-success text-success-foreground text-xs"><Shield className="mr-1 h-3 w-3" />Vaccinated</Badge>
          )}
          {dog.neutered && (
            <Badge variant="secondary" className="text-xs"><Scissors className="mr-1 h-3 w-3" />Neutered</Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">{dog.name}</h3>
            <p className="text-sm text-muted-foreground">{dog.breed} · {dog.age}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {dog.gender} · {dog.size}
          </Badge>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{dog.description}</p>
        {shelter && (
          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {shelter.name}
          </div>
        )}
        <Button asChild className="mt-4 w-full rounded-full" size="sm">
          <Link to={`/adopt/${dog.id}`}>
            <Heart className="mr-2 h-4 w-4" />
            Adopt {dog.name}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const DogsListing = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/pets').then((res) => res.json()),
      fetch('http://localhost:5000/api/shelters').then((res) => res.json()),
    ])
      .then(([petsData, sheltersData]) => {
        setDogs(petsData);
        setShelters(sheltersData);
      })
      .catch(console.error);
  }, []);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Meet Our Furry Friends
        </h2>
        <p className="mt-2 text-muted-foreground">
          Each one is waiting for a loving home. Could it be yours?
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dogs.map((dog) => (
          <DogCard key={dog.id} dog={dog} shelters={shelters} />
        ))}
      </div>
    </section>
  );
};

export default DogsListing;
