import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudySelector from "@/components/StudySelector";
import { useAuth } from "@/contexts/AuthContext";

const StudySelection = () => {
  const navigate = useNavigate();
  const { user, getUserRole } = useAuth();
  const [userRole, setUserRole] = useState<'investigator' | 'cro-sponsor' | null>(null);

  useEffect(() => {
    // Redirect if no user is logged in
    if (!user) {
      navigate('/');
      return;
    }

    // Check user role and redirect if not investigator or cro_sponsor
    const checkRole = async () => {
      const role = await getUserRole();
      if (!role || (role !== 'investigator' && role !== 'cro_sponsor')) {
        navigate('/');
      } else {
        // Map cro_sponsor to cro-sponsor for the component
        const mappedRole = role === 'cro_sponsor' ? 'cro-sponsor' : role;
        setUserRole(mappedRole as 'investigator' | 'cro-sponsor');
      }
    };
    
    checkRole();
  }, [user, getUserRole, navigate]);

  if (!user || !userRole) {
    return null;
  }

  return <StudySelector userRole={userRole} />;
};

export default StudySelection;