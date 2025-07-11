import { socketService } from "@/services/socket/SocketService";
import React, { createContext, useContext, useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};
export type NotificationData = {
  ID: number;
  insert_date: string;
  module_name: string;
  msg_type: string;
  other_data: string;
  reactNotificationId: string;
  req_code: string;
  req_date: string;
  request_txt_label: string;
  status: string;
  update_date: string | null;
  user_id: string;
};

const SocketContext = createContext<any>(null);

export const useSocketContext = () => useContext(SocketContext);

// SocketProvider component that provides socket context globally
export const SocketProvider: React.FC<Props> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleConnectionState = () => {
      setIsConnected(socketService.isConnected());
      setIsLoading(socketService.isLoading);
    };

    // Initialize socket connection
    socketService.connect();
    handleConnectionState();

    // Interval to monitor connection status
    const interval = setInterval(handleConnectionState, 100);

    // Cleanup interval (but don't disconnect socket)
    return () => clearInterval(interval);
  }, []);

  const refreshConnection = () => {
    socketService.refreshConnection();
    setIsLoading(true); // Start loading while refreshing
  };

  const emitDownloadReport = (payload: any) => {
    console.log("clicked");
    socketService.emit("r7Download", payload);
  };
  const emitDownloadR4Report = (payload: any) => {
    console.log("clicked");
    socketService.emit("r4Download", payload);
  };

  const emitDownloadR2Report = (payload: any) => {
    console.log("clicked");
    socketService.emit("r2_download", payload);
  };

  const emitDownloadR1Report = (payload: any) => {
    console.log("clicked", payload);
    socketService.emit("r1Download", payload);
  };

  const emitR5DispatchReport = (payload: any) => {
    console.log("clicked", payload);
    socketService.emit("r5DispatchReport", payload);
  };

  const emitR6DispatchReport = (payload: any) => {
    console.log("clicked", payload);
    socketService.emit("r6Download", payload);
  };

  const emitDownloadR3Report = (payload: any) => {
    console.log("clicked", payload);
    socketService.emit("r3Download", payload);
  };

  const emitDownloadSwipeReport = (payload: any) => {
    console.log("clicked");
    socketService.emit("swipeDispatchReport", payload);
  };

  const emitDownloadR10Report = (payload: any) => {
    console.log("clicked");
    socketService.emit("r10Download", payload);
  };
  const emitDownloadR14Report = (payload: any) => {
    console.log("clicked");
    socketService.emit("berComponent", payload);
  };
  const emitDownloadr5Report = (payload: any) => {
    console.log(payload);
    socketService.emit("r5DeviceSerial", payload);
  };
  const emitDownloadWrongDeviceReport = (payload: any) => {
    console.log(payload);
    socketService.emit("rWrongDevice", payload);
  };
  const emitDownloadR18Report = (payload: any) => {
    console.log(payload);
    socketService.emit("swipeRejectionReport", payload);
  };

   const emitDownloadR19Report = (payload: any) => {
    console.log(payload);
    socketService.emit("preQcReportDownload", payload);
  };

  const emitDownloadR17Report = (payload: any) => {
    console.log(payload);
    socketService.emit("swipeFunctionalReport", payload);
  };
  const emitGetNotification = () => {
    socketService.emit("getNotification", "");
  };
  const onDownloadReport = (
    callback: (data: { notificationId: string; percent: string }) => void
  ) => {
    socketService.on("progress", callback);
  };

  const emitDownloadSwipeR10Report = (payload: any) => {
    socketService.emit("swipeMonoReport", payload);
  };

  const swipeMachineInward = (payload: any) => {
    console.log(payload);
    socketService.emit("swipeMachineInward", payload);
  };
  const emitDeviceInwardReport = (payload: any) => {
    console.log(payload);
    socketService.emit("deviceInwardReport", payload);
  };
  const emitWrongDeviceReport = (payload: any) => {
    console.log(payload);
    socketService.emit("fetchWrongDeviceDownload", payload);
  };
  const emitR8DeviceReport = (payload: any) => {
    console.log(payload);
    socketService.emit("r8Download", payload);
  };
  const emitR13Report = (payload: any) => {
    console.log(payload);
    socketService.emit("deviceReportDownload", payload);
  };

  const emitR11Report = (payload: any) => {
    console.log(payload);
    socketService.emit("bpeIssueReportDownload", payload);
  };
   const emitR15Report = (payload: any) => {
    console.log(payload);
    socketService.emit("physicalReportDownload", payload);
  };
  const onnotification = (callback: (data: NotificationData[]) => void) => {
    socketService.on("socket_receive_notification", callback);
  };

  const off = (event: string) => {
    socketService.off(event);
  };

  return (
    <SocketContext.Provider
      value={{
        emitR15Report,
        emitDownloadR19Report,
        emitR11Report,
        emitR8DeviceReport,
        emitR13Report,
        emitDeviceInwardReport,
        emitWrongDeviceReport,
        emitR6DispatchReport,
        emitR5DispatchReport,
        emitDownloadR1Report,
        emitDownloadSwipeR10Report,
        emitDownloadR17Report,
        emitDownloadSwipeReport,
        swipeMachineInward,
        emitDownloadReport,
        emitDownloadR14Report,
        emitDownloadWrongDeviceReport,
        onDownloadReport,
        isConnected,
        refreshConnection,
        isLoading,
        off,
        onnotification,
        emitGetNotification,
        emitDownloadR4Report,
        emitDownloadR2Report,
        emitDownloadR10Report,
        emitDownloadr5Report,
        emitDownloadR3Report,
        emitDownloadR18Report,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
