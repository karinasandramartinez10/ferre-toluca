import { io } from "socket.io-client";

export const SOCKET_CONFIG = {
  SOCKET_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  SOCKET_OPTIONS: {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    withCredentials: true,
    timeout: 20000,
    upgrade: true,
    rememberUpgrade: true,
  },
};

export const createSocketConnection = (token, options = {}) => {
  if (!SOCKET_CONFIG.SOCKET_URL) {
    console.error("NEXT_PUBLIC_BACKEND_API_URL no está definido");
    return null;
  }

  const socket = io(SOCKET_CONFIG.SOCKET_URL, {
    ...SOCKET_CONFIG.SOCKET_OPTIONS,
    auth: { token },
    ...options,
  });

  return socket;
};

export const disconnectSocket = (socket) => {
  if (socket) {
    console.log("Desconectando Socket.IO...");
    socket.disconnect();
  }
};

export const isSocketConnected = (socket) => {
  return socket && socket.connected;
};
