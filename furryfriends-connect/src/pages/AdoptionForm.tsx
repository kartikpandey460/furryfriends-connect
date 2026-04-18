import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dogs, shelters } from "@/data/dummyData";
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

const AdoptionFormPage = () => {
  const { dogId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dog = dogs.find((d) => d.id === dogId);
  const shelter = dog ? shelters.find((s) => s.id === dog.shelterId) : null;

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", occupation: "", experience: "", reason: "", housingType: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted! 🎉",
      description: `Your adoption request for ${dog?.name || "this dog"} has been sent to ${shelter?.name || "the shelter"}.`,
    });
    setTimeout(() => navigate("/adoption-requests"), 1500);
  };

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
                  <Select onValueChange={(v) => setForm({ ...form, housingType: v })}>
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
                <Button type="submit" size="lg" className="w-full rounded-full text-base">
                  <PawPrint className="mr-2 h-5 w-5" />
                  Submit Adoption Request
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
