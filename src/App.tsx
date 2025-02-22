import { Outlet } from "react-router-dom";
import "./App.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import InternetStatusBar from "./components/shared/InternetStatusBar";
import BugAndChat from "./components/shared/BugAndChat";
import { useUser } from "./hooks/useUser";
import MailVerifyPage from "./pages/commonPages/MailVerifyPage";
import ChangePassword from "@/pages/commonPages/ChangePassword";
import OtpPage from "@/pages/commonPages/otpPage";

dayjs.extend(customParseFormat);
function App() {
  const { user } = useUser();
  const [isOffline, setIsOffline] = useState<boolean>(false);
  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true); // User is offline, apply blur effect
    };

    const handleOnline = () => {
      setIsOffline(false); // User is online, remove blur effect
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Check initial connection status
    if (!navigator.onLine) {
      setIsOffline(true); // If the user is offline when the app loads
    }

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (user && user?.other) {
    if (!user?.other.e_v) {
      return <MailVerifyPage />;
    } else if(!user.other.c_p){
      return <ChangePassword />
    } else {
      return (
        <>
          {/* <FestivalEffct /> */}
          <InternetStatusBar />
          <div className={` ${isOffline ? "fixed top-0 left-0 right-0 botom filter blur-sm grayscale pointer-events-none cursor-not-allowed" : ""}`}>
            <Outlet />
            {(import.meta.env.VITE_REACT_APP_ENVIRONMENT === "DEV" || import.meta.env.VITE_REACT_APP_ENVIRONMENT === "DEVME") && <BugAndChat />}
          </div>
        </>
      );
    }
  }
  else{
    return <OtpPage />
  }
}

export default App;
