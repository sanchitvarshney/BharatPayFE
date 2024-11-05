import React, { useState, useEffect } from "react";

const InternetStatusBar: React.FC = () => {
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setAlert(true);
    };

    const handleOnline = () => {
      setAlert(false);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <>
      {alert && (
        <div className="fixed top-0 left-0 z-[99999] right-0 p-2 text-center text-white bg-red-500">
          <strong>Internet connection lost. Please check your network.</strong>
        </div>
      )}
    </>
  );
};

export default InternetStatusBar;
