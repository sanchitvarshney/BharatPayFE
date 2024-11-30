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
    // Simulating an async check for authentication
    const checkAuth = async () => {
      // Run your logic here (e.g., verifying tokens, API call, etc.)
      await new Promise((resolve) => setTimeout(resolve, 500)); // Example async wait
      
      if (authentication && authStatus !== authentication) {
        navigate("/login");
      } else if (!authentication && authStatus !== authentication) {
        navigate("/");
      } else {
        setIsLoading(false); // Only set loading to false if logic passes
      }
    };

    checkAuth();
  }, [authStatus, authentication, navigate]);

  // Render a loader or fallback while waiting for the auth logic to complete
  if (isLoading ) {
    return <div className="relative flex items-center justify-center w-full h-screen bg-white">
      <div className="absolute top-0 left-0 right-0 w-full h-full opacity-50">
        <LinearProgress/>
      </div>
      <img src="/ms.png" alt="lMscorpres Logo" className="w-[500px] opacity-50" />
    </div>; // Replace this with your loading spinner or component
  }

  // Render children after the authentication logic has completed
  return <>{children}</>;
};

export default Protected;
