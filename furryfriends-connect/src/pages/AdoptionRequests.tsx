import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, CheckCircle, Clock, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const statusConfig = {
  approved: { icon: CheckCircle, label: "Approved", className: "bg-success text-success-foreground" },
  pending: { icon: Clock, label: "Pending", className: "bg-accent text-accent-foreground" },
  rejected: { icon: XCircle, label: "Rejected", className: "bg-destructive text-destructive-foreground" },
};

interface AdoptionRequest {
  _id: string;
  dogName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  occupation?: string;
  experience?: string;
  reason: string;
  housingType: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const AdoptionRequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/adoptions", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch adoption requests");
        }

        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, [user]);

  const stats = {
    pending: requests.filter((req) => req.status === "pending").length,
    approved: requests.filter((req) => req.status === "approved").length,
    rejected: requests.filter((req) => req.status === "rejected").length,
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            <ClipboardList className="mr-3 inline h-8 w-8 text-primary" />
            Adoption Requests
          </h1>
          <p className="mt-2 text-muted-foreground">Track all adoption applications and their statuses.</p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading adoption requests...</div>
        ) : (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => {
                const config = statusConfig[status];
                const Icon = config.icon;
                return (
                  <Card key={status} className="shadow-card">
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.className}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-display text-2xl font-bold text-foreground">{stats[status]}</p>
                        <p className="text-sm text-muted-foreground">{config.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-lg">All Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Dog</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((req) => {
                      const config = statusConfig[req.status];
                      return (
                        <TableRow key={req._id}>
                          <TableCell className="font-medium text-foreground">{req.name}</TableCell>
                          <TableCell>{req.dogName}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(req.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge className={config.className}>{config.label}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdoptionRequestsPage;
