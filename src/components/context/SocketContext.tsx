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

  const emitDownloadR10Report = (payload: any) => {
    console.log("clicked");
    socketService.emit("r10Download", payload);
  };
  const emitDownloadr5Report = (payload: any) => {
    console.log(payload)
    socketService.emit("r5DeviceSerial", payload);
  };
  const emitDownloadWrongDeviceReport = (payload: any) => {
    console.log(payload)
    socketService.emit("rWrongDevice", payload);
  };
  const emitGetNotification = () => {
    socketService.emit("getNotification","");
  };
  const onDownloadReport = (callback: (data: { notificationId: string; percent: string }) => void) => {
    socketService.on("progress", callback);
  };
  const onnotification = (callback: (data: NotificationData[]) => void) => {
    socketService.on("socket_receive_notification", callback);
  };
  
  const off = (event: string) => {
    socketService.off(event);
  };

  return <SocketContext.Provider value={{ emitDownloadReport,emitDownloadWrongDeviceReport, onDownloadReport, isConnected, refreshConnection, isLoading, off, onnotification,emitGetNotification,emitDownloadR4Report,emitDownloadR2Report,emitDownloadR10Report,emitDownloadr5Report }}>{children}</SocketContext.Provider>;
};
