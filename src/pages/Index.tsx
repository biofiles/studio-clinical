import { useNavigate } from "react-router-dom";
import Login from "@/components/Login";

const Index = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'participant' | 'investigator' | 'cro-sponsor') => {
    if (role === 'participant') {
      navigate(`/${role}`);
    } else {
      navigate(`/select-study?role=${role}`);
    }
  };

  return <Login onRoleSelect={handleRoleSelect} />;
};

export default Index;
