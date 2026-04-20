import { useState } from "react";
import { donationTiers } from "@/data/dummyData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Heart, IndianRupee, CreditCard, Smartphone, Building, Wallet, Lock, CheckCircle, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DonatePage = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [donatedAmount, setDonatedAmount] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  
  // Invoice data - preserved for invoice generation (not reset)
  const [invoiceName, setInvoiceName] = useState("");
  const [invoiceEmail, setInvoiceEmail] = useState("");
  const [invoicePaymentMethod, setInvoicePaymentMethod] = useState("");

  const amount = selected ?? (custom ? parseInt(custom) : 0);

  const generateInvoiceHTML = (txnId: string) => {
    const invoiceDate = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const invoiceTime = new Date().toLocaleTimeString("en-IN");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Donation Invoice</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #f97316;
            padding-bottom: 20px;
          }
          .logo-text {
            font-size: 28px;
            font-weight: bold;
            color: #f97316;
            margin-bottom: 5px;
          }
          .tagline {
            color: #666;
            font-size: 14px;
          }
          .invoice-number {
            text-align: right;
            margin-bottom: 20px;
            color: #666;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #999;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 1px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .info-label {
            color: #666;
            font-weight: 500;
          }
          .info-value {
            color: #333;
            font-weight: 600;
          }
          .amount-section {
            background-color: #fff8f0;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #f97316;
          }
          .amount-label {
            color: #666;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .amount-value {
            font-size: 32px;
            font-weight: bold;
            color: #f97316;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 12px;
          }
          .thank-you {
            text-align: center;
            margin: 20px 0;
            color: #f97316;
            font-size: 16px;
            font-weight: bold;
          }
          @media print {
            body {
              background-color: white;
              padding: 0;
            }
            .container {
              box-shadow: none;
              max-width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-text">🐾 FurrySouls</div>
            <div class="tagline">Helping Stray Dogs Find Love & Care</div>
          </div>

          <div class="invoice-number">
            <strong>Invoice #:</strong> ${txnId}
          </div>

          <div class="thank-you">
            ✓ Thank You for Your Generous Donation!
          </div>

          <div class="section">
            <div class="section-title">Donor Information</div>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${invoiceName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${invoiceEmail}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Donation Details</div>
            <div class="info-row">
              <span class="info-label">Payment Method:</span>
              <span class="info-value">${invoicePaymentMethod === "card" ? "Credit/Debit Card" : invoicePaymentMethod === "upi" ? "UPI" : invoicePaymentMethod === "netbanking" ? "Net Banking" : invoicePaymentMethod === "wallet" ? "Digital Wallet" : "N/A"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span class="info-value">${invoiceDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Time:</span>
              <span class="info-value">${invoiceTime}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Transaction ID:</span>
              <span class="info-value">${txnId}</span>
            </div>
          </div>

          <div class="amount-section">
            <div class="amount-label">Donation Amount</div>
            <div class="amount-value">₹${donatedAmount.toLocaleString("en-IN")}</div>
          </div>

          <div class="section">
            <p style="text-align: center; color: #666; line-height: 1.6; font-size: 14px;">
              Your contribution will be used to feed, vaccinate, and provide shelter to stray dogs in need. Every rupee makes a difference!
            </p>
          </div>

          <div class="footer">
            <p>This is a digital donation receipt. No physical copy will be sent.</p>
            <p>© 2026 FurrySouls. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const downloadInvoice = () => {
    const invoiceHTML = generateInvoiceHTML(transactionId);
    const blob = new Blob([invoiceHTML], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FurrySouls_Donation_${transactionId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const printInvoice = () => {
    const invoiceHTML = generateInvoiceHTML(transactionId);
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 1 || !name || !email || !paymentMethod) return;

    // Basic validation for card if selected
    if (paymentMethod === "card" && (!cardNumber || !expiry || !cvv || !cardName)) {
      toast({
        title: "Incomplete Details",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return;
    }
    if (paymentMethod === "upi" && !upiId) {
      toast({
        title: "Incomplete Details",
        description: "Please enter your UPI ID.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          amount,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save donation');
      }

      // Simulate payment processing delay
      setTimeout(() => {
        setLoading(false);
        setDonatedAmount(amount);
        const txnId = `TXN${Date.now()}`;
        setTransactionId(txnId);
        
        // Preserve invoice data before resetting form
        setInvoiceName(name);
        setInvoiceEmail(email);
        setInvoicePaymentMethod(paymentMethod);
        
        setSuccessOpen(true);
        // Reset form after success
        setSelected(null);
        setCustom("");
        setName("");
        setEmail("");
        setPaymentMethod("");
        setCardNumber("");
        setExpiry("");
        setCvv("");
        setCardName("");
        setUpiId("");
        setBank("");
        setStep(1);
      }, 2000); // Shorter delay since API call is done
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
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
          <Tabs value={`step-${step}`} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="step-1" disabled={step < 1}>Amount & Details</TabsTrigger>
              <TabsTrigger value="step-2" disabled={step < 2}>Payment Method</TabsTrigger>
              <TabsTrigger value="step-3" disabled={step < 3}>Review & Pay</TabsTrigger>
            </TabsList>

            <TabsContent value="step-1" className="mt-6">
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

              {/* Custom Amount & Basic Details */}
              <Card className="shadow-card">
                <CardContent className="p-6 space-y-5">
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="step-2" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Secure Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label>Select Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Credit/Debit Card
                          </div>
                        </SelectItem>
                        <SelectItem value="upi">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            UPI
                          </div>
                        </SelectItem>
                        <SelectItem value="netbanking">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Net Banking
                          </div>
                        </SelectItem>
                        <SelectItem value="wallet">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            Digital Wallet
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Card Number</Label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 "))}
                          maxLength={19}
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Expiry Date</Label>
                          <Input placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} maxLength={5} />
                        </div>
                        <div className="space-y-2">
                          <Label>CVV</Label>
                          <Input type="password" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} maxLength={3} />
                        </div>
                        <div className="space-y-2">
                          <Label>Cardholder Name</Label>
                          <Input placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="space-y-2">
                      <Label>UPI ID</Label>
                      <Input placeholder="user@paytm" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                    </div>
                  )}

                  {paymentMethod === "netbanking" && (
                    <div className="space-y-2">
                      <Label>Select Bank</Label>
                      <Select value={bank} onValueChange={setBank}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sbi">State Bank of India</SelectItem>
                          <SelectItem value="hdfc">HDFC Bank</SelectItem>
                          <SelectItem value="icici">ICICI Bank</SelectItem>
                          <SelectItem value="axis">Axis Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {paymentMethod === "wallet" && (
                    <div className="space-y-2">
                      <Label>Select Wallet</Label>
                      <Select value={bank} onValueChange={setBank}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your wallet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paytm">Paytm</SelectItem>
                          <SelectItem value="gpay">Google Pay</SelectItem>
                          <SelectItem value="phonepe">PhonePe</SelectItem>
                          <SelectItem value="amazonpay">Amazon Pay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="step-3" className="mt-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Review Your Donation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium">Amount</Label>
                      <p className="text-lg font-bold">₹{amount.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Payment Method</Label>
                      <p className="text-lg">{paymentMethod === "card" ? "Credit/Debit Card" : paymentMethod === "upi" ? "UPI" : paymentMethod === "netbanking" ? "Net Banking" : "Digital Wallet"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p>{name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p>{email}</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-accent p-4 text-center">
                    <p className="text-sm text-muted-foreground">Total Donation</p>
                    <p className="font-display text-3xl font-bold text-primary">₹{amount.toLocaleString("en-IN")}</p>
                  </div>
                  <Button type="submit" size="lg" className="w-full rounded-full text-base" disabled={!amount || loading} onClick={handleDonate}>
                    {loading ? (
                      "Processing Payment..."
                    ) : (
                      <>
                        <Heart className="mr-2 h-5 w-5" />
                        Pay Now
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
              Back
            </Button>
            <Button onClick={() => setStep(Math.min(3, step + 1))} disabled={step === 3 || (step === 1 && (!amount || !name || !email)) || (step === 2 && !paymentMethod)}>
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Donation Successful!
            </DialogTitle>
            <DialogDescription>
              Thank you for your generosity! Your donation of ₹{donatedAmount.toLocaleString("en-IN")} will help save stray lives.
              <br />
              <strong>Transaction ID:</strong> {transactionId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <Button onClick={downloadInvoice} className="w-full" variant="default">
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
            <Button onClick={printInvoice} className="w-full" variant="outline">
              Print Invoice
            </Button>
            <Button onClick={() => setSuccessOpen(false)} className="w-full" variant="ghost">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default DonatePage;
