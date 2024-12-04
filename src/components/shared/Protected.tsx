import useAuth from "@/hooks/useAuth";
import { LinearProgress } from "@mui/material";
import React, { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
}

const Protected: React.FC<ProtectedProps> = ({ children, authentication = true }) => {

  const [isLoading, setIsLoading] = useState(true);
  const authStatus: boolean = useAuth(); // Replace with actual auth hook/state
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating an async check for authentication and email verification
    const checkAuth = async () => {
      // Simulate an async operation (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Check for authentication
      if (authentication && authStatus !== authentication) {
        navigate("/login");
        setIsLoading(false)
        return;
      } else if (!authentication && authStatus !== authentication) {
        navigate("/");
        setIsLoading(false)
        return;
      }
     
      setIsLoading(false); // All checks passed, allow access
    };

    checkAuth();
  }, [authStatus, authentication, navigate]);

  // Render a loader or fallback while waiting for the auth logic to complete
  if (isLoading) {
    return (
      <div className="relative flex items-center justify-center w-full h-screen bg-white">
        <div className="absolute top-0 left-0 right-0 w-full h-full opacity-50">
          <LinearProgress />
        </div>
        <img src="/ms.png" alt="Mscorpres Logo" className="w-[500px] opacity-50" />
      </div>
    );
  }

  // Render children after all logic has been verified
  return <>{children}</>;
};

export default Protected;
