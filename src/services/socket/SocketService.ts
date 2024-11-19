import { getToken } from "@/utils/tokenUtills";
import { io, Socket } from "socket.io-client";
interface ISocketService {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
  on: <T>(event: string, callback: (data: T) => void) => void;
  emit: <T>(event: string, data: T) => void;
}
class SocketService implements ISocketService {
  socket: Socket | null = null;
  constructor(private url: string) {}
  connect() {
    this.socket = io(this.url, {
      transports: ["websocket"],
      auth: {
        token: getToken(),
      },
    });
    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
    });
    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  disconnect() {
    this.socket?.disconnect();
  }

  on<T>(event: string, callback: (data: T) => void) {
    this.socket?.on(event, callback);
  }

  emit<T>(event: string, data: T) {
    this.socket?.emit(event, data);
  }
}

export const socketService = new SocketService(import.meta.env.VITE_SOKET_URL);
