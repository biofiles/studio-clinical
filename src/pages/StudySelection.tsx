import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudySelector from "@/components/StudySelector";
import { useAuth } from "@/contexts/AuthContext";

const StudySelection = () => {
  const navigate = useNavigate();
  const { user, userRole, roleLoading } = useAuth();

  useEffect(() => {
    // Redirect if no user is logged in
    if (!user) {
      navigate('/');
      return;
    }

    // Check user role and redirect if not investigator or cro_sponsor
    if (!roleLoading && userRole) {
      if (userRole !== 'investigator' && userRole !== 'cro_sponsor') {
        navigate('/unauthorized');
      }
    }
  }, [user, userRole, roleLoading, navigate]);

  // Show loading while checking role
  if (roleLoading) {
    return (
      <div className="min-h-screen bg-studio-bg flex items-center justify-center">
        <div className="text-studio-text">Loading...</div>
      </div>
    );
  }

  // Only render if user has the right role
  if (!userRole || (userRole !== 'investigator' && userRole !== 'cro_sponsor')) {
    return null;
  }

  // Map cro_sponsor to cro-sponsor for the component
  const mappedRole = userRole === 'cro_sponsor' ? 'cro-sponsor' : userRole;

  return <StudySelector userRole={mappedRole as 'investigator' | 'cro-sponsor'} />;
};

export default StudySelection;