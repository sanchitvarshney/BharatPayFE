import { socketService } from '@/services/socket/SocketService';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Props = {
    children: React.ReactNode
}

// Creating a context for SocketService
const SocketContext = createContext<any>(null);

// Custom hook to use SocketContext
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
    socketService.emit('DOWNLOAD_REPORT', payload);
  };

  const onDownloadReport = (callback: (data: any) => void) => {
    socketService.on('DOWNLOAD_REPORT', callback);
  };

  return (
    <SocketContext.Provider value={{ emitDownloadReport, onDownloadReport, isConnected, refreshConnection, isLoading }}>
      {children}
    </SocketContext.Provider>
  );
};
