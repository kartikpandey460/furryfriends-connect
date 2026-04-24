import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import DogsPage from "./pages/Dogs";
import SheltersPage from "./pages/Shelters";
import AdoptionFormPage from "./pages/AdoptionForm";
import AdoptionRequestsPage from "./pages/AdoptionRequests";
import DonatePage from "./pages/Donate";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import DonationsAdminPage from "./pages/DonationsAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dogs" element={<RequireAuth><DogsPage /></RequireAuth>} />
            <Route path="/shelters" element={<RequireAuth><SheltersPage /></RequireAuth>} />
            <Route path="/adopt/:dogId" element={<RequireAuth><AdoptionFormPage /></RequireAuth>} />
            <Route path="/adoption-requests" element={<RequireAuth><AdoptionRequestsPage /></RequireAuth>} />
            <Route path="/donate" element={<RequireAuth><DonatePage /></RequireAuth>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/donations" element={<RequireAuth><DonationsAdminPage /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
