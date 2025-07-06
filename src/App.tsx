
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { StudyProvider } from "./contexts/StudyContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import StudySelection from "./pages/StudySelection";
import ParticipantDashboard from "./pages/ParticipantDashboard";
import InvestigatorDashboard from "./pages/InvestigatorDashboard";
import CROSponsorDashboard from "./pages/CROSponsorDashboard";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <StudyProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/select-study" element={
                  <ProtectedRoute>
                    <StudySelection />
                  </ProtectedRoute>
                } />
                <Route path="/participant" element={
                  <ProtectedRoute>
                    <ParticipantDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/investigator" element={
                  <ProtectedRoute>
                    <InvestigatorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/cro-sponsor" element={
                  <ProtectedRoute>
                    <CROSponsorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </StudyProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
