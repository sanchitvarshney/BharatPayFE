import { Outlet } from "react-router-dom";
import "./App.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import BugAndChat from "./components/shared/BugAndChat";
import { useEffect, useState } from "react";
import InternetStatusBar from "./components/shared/InternetStatusBar";
dayjs.extend(customParseFormat);
function App() {
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
  return (
    <>
      <InternetStatusBar />
      <div className={` ${isOffline ? "fixed top-0 left-0 right-0 botom filter blur-sm grayscale pointer-events-none cursor-not-allowed" : ""}`}>
        <Outlet />
        <BugAndChat />
      </div>
    </>
  );
}

export default App;
