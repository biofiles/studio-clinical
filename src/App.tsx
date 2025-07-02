import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ParticipantDashboard from "./pages/ParticipantDashboard";
import InvestigatorDashboard from "./pages/InvestigatorDashboard";
import CROSponsorDashboard from "./pages/CROSponsorDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/participant" element={<ParticipantDashboard onLogout={() => window.location.href = '/'} />} />
          <Route path="/investigator" element={<InvestigatorDashboard onLogout={() => window.location.href = '/'} />} />
          <Route path="/cro-sponsor" element={<CROSponsorDashboard onLogout={() => window.location.href = '/'} />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
