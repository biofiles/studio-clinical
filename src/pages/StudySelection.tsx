import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StudySelector from "@/components/StudySelector";

const StudySelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') as 'investigator' | 'cro-sponsor';

  useEffect(() => {
    // Redirect if no valid role is provided
    if (!role || (role !== 'investigator' && role !== 'cro-sponsor')) {
      navigate('/');
    }
  }, [role, navigate]);

  if (!role || (role !== 'investigator' && role !== 'cro-sponsor')) {
    return null;
  }

  return <StudySelector userRole={role} />;
};

export default StudySelection;