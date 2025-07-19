import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from 'react';

const Index = () => {
  const { t } = useLanguage();
  const { user, userRole, roleLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (user && userRole && !redirecting && !roleLoading) {
      setRedirecting(true);
      
      if (userRole === 'participant') {
        window.location.href = '/participant';
      } else if (userRole === 'investigator') {
        window.location.href = '/investigator';
      } else if (userRole === 'cro_sponsor') {
        window.location.href = '/cro-sponsor';
      } else {
        window.location.href = '/auth';
      }
    }
  }, [user, userRole, roleLoading, redirecting]);

  // Show loading while redirecting
  if (redirecting || roleLoading) {
    return (
      <div className="min-h-screen bg-studio-bg flex items-center justify-center">
        <div className="text-studio-text">{t('auth.redirecting')}</div>
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