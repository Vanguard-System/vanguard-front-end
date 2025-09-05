import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "@/services/auth";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        await getMe(); 
        setAuthenticated(true); 
      } 
      catch (err) {
        setAuthenticated(false); 
      } 
      finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) return <div>Carregando...</div>; 

  if (!authenticated) return <Navigate to="/login" />; 

  return <>{children}</>; 
}
