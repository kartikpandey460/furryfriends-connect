import { adoptionRequests } from "@/data/dummyData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, CheckCircle, Clock, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const statusConfig = {
  approved: { icon: CheckCircle, label: "Approved", className: "bg-success text-success-foreground" },
  pending: { icon: Clock, label: "Pending", className: "bg-accent text-accent-foreground" },
  rejected: { icon: XCircle, label: "Rejected", className: "bg-destructive text-destructive-foreground" },
};

const AdoptionRequestsPage = () => (
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

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {(["pending", "approved", "rejected"] as const).map((status) => {
          const config = statusConfig[status];
          const count = adoptionRequests.filter((r) => r.status === status).length;
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
              {adoptionRequests.map((req) => {
                const config = statusConfig[req.status];
                return (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium text-foreground">{req.applicantName}</TableCell>
                    <TableCell>{req.dogName}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(req.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</TableCell>
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
    </div>
    <Footer />
  </div>
);

export default AdoptionRequestsPage;
