import { useState } from "react";
import { donationTiers } from "@/data/dummyData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Heart, IndianRupee } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DonatePage = () => {
  const { toast } = useToast();
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const amount = selected ?? (custom ? parseInt(custom) : 0);

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 1) return;
    toast({
      title: "Thank you for your generosity! 🙏",
      description: `Your donation of ₹${amount.toLocaleString("en-IN")} will help save stray lives.`,
    });
    setSelected(null);
    setCustom("");
    setName("");
    setEmail("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-warm-gradient">
        <div className="container mx-auto px-4 py-16 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-primary" fill="currentColor" />
          <h1 className="font-display text-3xl font-bold text-foreground md:text-5xl">
            Make a <span className="text-gradient-warm">Difference</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Every rupee helps feed, vaccinate, and shelter a stray dog in need. Your contribution saves lives.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Tiers */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            {donationTiers.map((tier) => (
              <button
                key={tier.amount}
                onClick={() => { setSelected(tier.amount); setCustom(""); }}
                className={`group rounded-xl border p-5 text-left transition-all hover:shadow-warm ${
                  selected === tier.amount
                    ? "border-primary bg-accent shadow-warm"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="text-3xl mb-2">{tier.icon}</div>
                <p className="font-display text-xl font-bold text-foreground">₹{tier.amount.toLocaleString("en-IN")}</p>
                <p className="text-sm text-muted-foreground">{tier.label}</p>
              </button>
            ))}
          </div>

          {/* Custom + Form */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <form onSubmit={handleDonate} className="space-y-5">
                <div className="space-y-2">
                  <Label>Or enter a custom amount</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="number"
                      className="pl-9"
                      placeholder="Enter amount"
                      value={custom}
                      onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Your Name</Label>
                    <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                </div>
                {amount > 0 && (
                  <div className="rounded-lg bg-accent p-4 text-center">
                    <p className="text-sm text-muted-foreground">You're donating</p>
                    <p className="font-display text-3xl font-bold text-primary">₹{amount.toLocaleString("en-IN")}</p>
                  </div>
                )}
                <Button type="submit" size="lg" className="w-full rounded-full text-base" disabled={!amount}>
                  <Heart className="mr-2 h-5 w-5" />
                  Donate Now
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

export default DonatePage;
