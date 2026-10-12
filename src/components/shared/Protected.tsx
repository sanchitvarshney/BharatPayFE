import useAuth from "@/hooks/useAuth";
import AppLoader from "@/components/shared/AppLoader";
import React, { useEffect, useState, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setReturnTo } from "@/utils/returnTo";

interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
}

const Protected: React.FC<ProtectedProps> = ({ children, authentication = true }) => {

  const [isLoading, setIsLoading] = useState(true);
  const authStatus: boolean = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (authentication && authStatus !== authentication) {
        setReturnTo(`${location.pathname}${location.search}`);
        navigate("/login");
        setIsLoading(false);
        return;
      }
      if (!authentication && authStatus !== authentication) {
        navigate("/");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [authStatus, authentication, navigate, location.pathname, location.search]);

  // Render a loader or fallback while waiting for the auth logic to complete
  if (isLoading) {
    return <AppLoader />;
  }

  // Render children after all logic has been verified
  return <>{children}</>;
};

export default Protected;
