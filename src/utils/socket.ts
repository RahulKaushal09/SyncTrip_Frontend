import { io, Socket } from "socket.io-client";
import { StorageUtils } from "@/utils";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const token = StorageUtils.getToken();
    socket = io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL!, {
      auth: { token },
      transports: ["websocket", "polling"], // ← Add polling fallback
      autoConnect: true,
      reconnection: true,
    });
  }
  return socket;
};
