import { useNavigate } from "react-router-dom";
import Login from "@/components/Login";

const Index = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'participant' | 'investigator' | 'cro-sponsor') => {
    if (role === 'participant') {
      navigate(`/${role}`);
    } else if (role === 'investigator') {
      navigate(`/select-study?role=${role}`);
    } else {
      // CRO-sponsor goes directly to dashboard
      navigate(`/${role}`);
    }
  };

  return <Login onRoleSelect={handleRoleSelect} />;
};

export default Index;
