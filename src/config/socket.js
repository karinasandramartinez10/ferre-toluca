import { io } from 'socket.io-client';

export const SOCKET_CONFIG = {
  SOCKET_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  SOCKET_OPTIONS: {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    withCredentials: true,
    timeout: 20000,
    upgrade: true,
    rememberUpgrade: true,
  }
};

export const createSocketConnection = (userId, options = {}) => {
  if (!SOCKET_CONFIG.SOCKET_URL) {
    console.error('NEXT_PUBLIC_BACKEND_API_URL no está definido');
    return null;
  }

  const socket = io(SOCKET_CONFIG.SOCKET_URL, {
    ...SOCKET_CONFIG.SOCKET_OPTIONS,
    ...options
  });

  socket.on('connect', () => {
    if (userId) {
      socket.emit('join-user-room', userId);
    }
  });

  socket.on('connect_error', (error) => {
    console.error('Error de conexión Socket.IO:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket.IO desconectado:', reason);
  });

  return socket;
};

export const disconnectSocket = (socket) => {
  if (socket) {
    console.log('Desconectando Socket.IO...');
    socket.disconnect();
  }
};

export const isSocketConnected = (socket) => {
  return socket && socket.connected;
};
