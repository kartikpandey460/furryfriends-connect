import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, DollarSign, CreditCard, Smartphone, Building, CheckCircle, Clock, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Donation {
  _id: string;
  name: string;
  email: string;
  amount: number;
  message?: string;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

const statusConfig = {
  completed: { icon: CheckCircle, label: "Completed", className: "bg-success text-success-foreground" },
  pending: { icon: Clock, label: "Pending", className: "bg-accent text-accent-foreground" },
  failed: { icon: XCircle, label: "Failed", className: "bg-destructive text-destructive-foreground" },
};

const paymentMethodConfig = {
  card: { icon: CreditCard, label: "Card" },
  upi: { icon: Smartphone, label: "UPI" },
  netbanking: { icon: Building, label: "Net Banking" },
  wallet: { icon: DollarSign, label: "Wallet" },
};

const DonationsAdminPage = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDonations();
    }
  }, [user]);

  const fetchDonations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/donations', {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDonations(data);

        // Calculate stats
        const total = data.length;
        const completed = data.filter((d: Donation) => d.status === 'completed').length;
        const pending = data.filter((d: Donation) => d.status === 'pending').length;
        const failed = data.filter((d: Donation) => d.status === 'failed').length;
        const totalAmount = data
          .filter((d: Donation) => d.status === 'completed')
          .reduce((sum: number, d: Donation) => sum + d.amount, 0);

        setStats({ total, completed, pending, failed, totalAmount });
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto flex items-center justify-center px-4 py-20">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You need admin privileges to access this page.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading donations...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            <Heart className="mr-3 inline h-8 w-8 text-primary" />
            Donations Management
          </h1>
          <p className="mt-2 text-muted-foreground">Track all donations and their status.</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">
                  ₹{stats.totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Amount</p>
              </div>
            </CardContent>
          </Card>

          {(["completed", "pending", "failed"] as const).map((status) => {
            const config = statusConfig[status];
            const count = stats[status];
            const Icon = config.icon;
            return (
              <Card key={status} className="shadow-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.className}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-sm text-muted-foreground">{config.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>All Donations ({stats.total})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => {
                  const statusConfigItem = statusConfig[donation.status];
                  const paymentConfig = paymentMethodConfig[donation.paymentMethod];
                  const PaymentIcon = paymentConfig.icon;

                  return (
                    <TableRow key={donation._id}>
                      <TableCell className="font-medium">{donation.name}</TableCell>
                      <TableCell>{donation.email}</TableCell>
                      <TableCell className="font-semibold text-primary">
                        ₹{donation.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PaymentIcon className="h-4 w-4" />
                          {paymentConfig.label}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          donation.status === 'completed' ? 'default' :
                          donation.status === 'failed' ? 'destructive' : 'secondary'
                        }>
                          {statusConfigItem.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(donation.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {donation.message || '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default DonationsAdminPage;