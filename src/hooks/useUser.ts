import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./useReduxHook";

interface FavPage {
  page_id: string;
  page_name: string;
  url: string;
}

interface Setting {
  name: string;
  code: string;
  value: string;
}

interface OtherSettings {
  m_v: boolean;
  e_v: boolean;
  c_p: boolean;
}

interface LoggedInUser {
  token: string;
  department: string;
  crn_mobile: string;
  crn_email: string;
  crn_id: string;
  company_id: string;
  username: string;
  fav_pages: FavPage[];
  settings: Setting[];
  crn_type: string;
  successPath: string;
  validity: number;
  other: OtherSettings;
}

export function useUser() {
 const  dispatch = useAppDispatch()
  const navigate = useNavigate();
  const [user, setUser] = useState<LoggedInUser | null>(null);

  // Utility function to check if a string is valid JSON
  const isValidJSON = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  // Utility function to check if a string is valid Base64
  const isValidBase64 = (str: string): boolean => {
    try {
      return btoa(atob(str)) === str; // Encode after decoding to verify validity
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedinUser");
    if (storedUser) {
      if (isValidBase64(storedUser)) {
        const decodedUser = atob(storedUser); // Decode the Base64 string
        if (isValidJSON(decodedUser)) {
          setUser(JSON.parse(decodedUser));
        } else {
          console.error("Invalid JSON in loggedinUser");
          localStorage.clear();
          window.location.reload();
        }
      } else {
        console.error("Invalid Base64 in loggedinUser");
        localStorage.clear();
        window.location.reload();
      }
    }
  }, [navigate,dispatch]);

  const saveUser = (userData: LoggedInUser | null) => {
    if (userData) {
      const encodedUser = btoa(JSON.stringify(userData)); // Encode to Base64
      localStorage.setItem("loggedinUser", encodedUser);
      setUser(userData);
    } else {
      clearUser();
    }
  };

  const clearUser = () => {
    localStorage.removeItem("loggedinUser");
    setUser(null);
  };

  return {
    user,
    saveUser,
    clearUser,
  };
}
