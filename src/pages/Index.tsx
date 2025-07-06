import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  // If user is logged in, redirect to auth page to handle role-based routing
  if (user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to auth page for login
  return <Navigate to="/auth" replace />;
};

export default Index;
