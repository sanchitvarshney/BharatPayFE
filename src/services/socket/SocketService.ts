import { getToken } from "@/utils/tokenUtills";
import { io, Socket } from "socket.io-client";

interface ISocketService {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
  on: <T>(event: string, callback: (data: T) => void) => void;
  off: (event: string) => void;
  emit: <T>(event: string, data: T) => void;
  isConnected: () => boolean;
}

class SocketService implements ISocketService {
  socket: Socket | null = null;
  isLoading = false;
  constructor(private url: string) {}

  connect() {
    if (this.socket?.connected) return;
    this.isLoading = true; // Start loading
    this.socket = io(this.url, {
      transports: ["websocket"],
      auth: { token: getToken() },
    });

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id)
      this.isLoading = false;
    });
    this.socket.on("disconnect", () => {
      console.log("Socket disconnected")
      this.isLoading = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.isLoading = false; // Stop loading on error
    });
  
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  on<T>(event: string, callback: (data: T) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }

  emit<T>(event: string, data: T) {
    this.socket?.emit(event, data);
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
  refreshConnection() {
    console.log("Refreshing socket connection...");
    this.disconnect();
    this.connect();
  }
}

export const socketService = new SocketService(import.meta.env.VITE_SOKET_URL);
