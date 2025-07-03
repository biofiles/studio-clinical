
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ParticipantDashboard from "./pages/ParticipantDashboard";
import InvestigatorDashboard from "./pages/InvestigatorDashboard";
import CROSponsorDashboard from "./pages/CROSponsorDashboard";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-studio-bg flex items-center justify-center">
      <div className="text-studio-text">Cargando...</div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-studio-bg flex items-center justify-center">
      <div className="text-studio-text">Cargando...</div>
    </div>;
  }
  
  if (user) {
    return <Navigate to="/participant" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthRoute><Index /></AuthRoute>} />
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/participant" element={
          <ProtectedRoute>
            <ParticipantDashboard onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/investigator" element={
          <ProtectedRoute>
            <InvestigatorDashboard onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/cro-sponsor" element={
          <ProtectedRoute>
            <CROSponsorDashboard onLogout={handleLogout} />
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
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
