import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, PawPrint } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  location: string;
  address: string;
}

const AdoptionFormPage = () => {
  const { dogId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dog, setDog] = useState<Dog | null>(null);
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [dogLoading, setDogLoading] = useState(true);

  useEffect(() => {
    if (!dogId) {
      setDog(null);
      setDogLoading(false);
      return;
    }

    setDogLoading(true);
    fetch(`http://localhost:5000/api/pets/${dogId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Dog not found");
        }
        return res.json();
      })
      .then((data: Dog) => setDog(data))
      .catch(() => setDog(null))
      .finally(() => setDogLoading(false));
  }, [dogId]);

  useEffect(() => {
    if (!dog?.shelterId) {
      setShelter(null);
      return;
    }

    fetch(`http://localhost:5000/api/shelters/${dog.shelterId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Shelter not found');
        }
        return res.json();
      })
      .then(setShelter)
      .catch(() => setShelter(null));
  }, [dog?.shelterId]);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", occupation: "", experience: "", reason: "", housingType: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/adoptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dogId: dog?.id ?? (dog as any)?._id,
          dogName: dog?.name,
          shelterId: dog?.shelterId,
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          occupation: form.occupation,
          experience: form.experience,
          reason: form.reason,
          housingType: form.housingType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Application Submitted! 🎉",
          description: `Your adoption request for ${dog?.name || "this dog"} has been sent.`,
        });
        setTimeout(() => navigate("/adoption-requests"), 1500);
      } else {
        toast({
          title: "Submission Failed",
          description: data.message || "Unable to submit your application.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (dogLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-32 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">Loading dog details...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-32 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">Dog not found</h2>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/dogs")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <Button variant="ghost" onClick={() => navigate("/dogs")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to dogs
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Dog Info */}
          <Card className="lg:col-span-1 overflow-hidden shadow-card">
            <div className="aspect-square overflow-hidden">
              <img src={dog.image} alt={dog.name} className="h-full w-full object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-display text-xl font-bold text-foreground">{dog.name}</h3>
              <p className="text-sm text-muted-foreground">{dog.breed} · {dog.age} · {dog.gender}</p>
              <p className="mt-2 text-sm text-muted-foreground">{dog.description}</p>
              {shelter && (
                <div className="mt-3 rounded-lg bg-accent p-3 text-sm">
                  <p className="font-medium text-accent-foreground">{shelter.name}</p>
                  <p className="text-xs text-muted-foreground">{shelter.location}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-2xl">
                <PawPrint className="mr-2 inline h-6 w-6 text-primary" />
                Adoption Application for {dog.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input id="occupation" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} placeholder="Your occupation" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Your complete address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="housingType">Housing Type</Label>
                  <Select value={form.housingType} onValueChange={(v) => setForm({ ...form, housingType: v })}>
                    <SelectTrigger><SelectValue placeholder="Select your housing type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">Independent House</SelectItem>
                      <SelectItem value="villa">Villa with Garden</SelectItem>
                      <SelectItem value="farm">Farmhouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Previous Pet Experience</Label>
                  <Textarea id="experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="Tell us about your experience with pets..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Why do you want to adopt {dog.name}?</Label>
                  <Textarea id="reason" required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Share your reasons..." />
                </div>
                <Button type="submit" size="lg" className="w-full rounded-full text-base" disabled={loading}>
                  {loading ? (
                    "Submitting..."
                  ) : (
                    <>
                      <PawPrint className="mr-2 h-5 w-5" />
                      Submit Adoption Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdoptionFormPage;
