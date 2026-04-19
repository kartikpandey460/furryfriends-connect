import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import DogsPage from "./pages/Dogs";
import SheltersPage from "./pages/Shelters";
import AdoptionFormPage from "./pages/AdoptionForm";
import AdoptionRequestsPage from "./pages/AdoptionRequests";
import DonatePage from "./pages/Donate";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dogs" element={<DogsPage />} />
          <Route path="/shelters" element={<SheltersPage />} />
          <Route path="/adopt/:dogId" element={<AdoptionFormPage />} />
          <Route path="/adoption-requests" element={<AdoptionRequestsPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
