import { useNavigate } from "react-router-dom";
import Login from "@/components/Login";

const Index = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'participant' | 'investigator' | 'cro-sponsor') => {
    // Redirect to authentication page with role parameter
    navigate(`/auth?role=${role}`);
  };

  return <Login onRoleSelect={handleRoleSelect} />;
};

export default Index;
