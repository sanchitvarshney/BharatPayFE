import { useEffect } from "react";
import { socketService } from "../services/socket/SocketService";
import { SOCKET_EVENTS } from "../services/socket/events";
import { DownloadReportPayload } from "../services/socket/types";

export const useSocket = () => {
  useEffect(() => {
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const emitDownloadReport = (payload: DownloadReportPayload) => {
    socketService.emit(SOCKET_EVENTS.DOWNLOAD_REPORT, payload);
  };

  const onDownloadReport = (callback: (data: any) => void) => {
    socketService.on(SOCKET_EVENTS.DOWNLOAD_REPORT, callback);
  };

  return { emitDownloadReport, onDownloadReport };
};
