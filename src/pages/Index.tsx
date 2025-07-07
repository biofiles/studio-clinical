import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from 'react';

const Index = () => {
  const { user, getUserRole } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (user && !redirecting) {
      setRedirecting(true);
      const redirectUser = async () => {
        try {
          const role = await getUserRole();
          if (role === 'participant') {
            window.location.href = '/participant';
          } else if (role === 'investigator') {
            window.location.href = '/investigator';
          } else if (role === 'cro_sponsor') {
            window.location.href = '/cro-sponsor';
          } else {
            // If no role found, redirect to auth
            window.location.href = '/auth';
          }
        } catch (error) {
          console.error('Error during redirect:', error);
          window.location.href = '/auth';
        }
      };
      redirectUser();
    }
  }, [user, getUserRole, redirecting]);

  // Show loading while redirecting
  if (redirecting) {
    return (
      <div className="min-h-screen bg-studio-bg flex items-center justify-center">
        <div className="text-studio-text">Cargando...</div>
      </div>
    );
  }

  // If no user, show auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Default fallback
  return <Navigate to="/auth" replace />;
};

export default Index;
