import { useState, useEffect } from 'react';


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
    m_v: string;
    e_v: string;
    c_p: string;
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
  const [user, setUser] = useState<LoggedInUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedinUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const saveUser = (userData: LoggedInUser) => {
    localStorage.setItem('loggedinUser', JSON.stringify(userData));
    setUser(userData);
  };

  const clearUser = () => {
    localStorage.removeItem('loggedinUser');
    setUser(null);
  };

  return {
    user,
    saveUser,
    clearUser,
  };
}
