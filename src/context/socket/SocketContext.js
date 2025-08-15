"use client";

import { createContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  createSocketConnection,
  disconnectSocket,
  isSocketConnected,
} from "../../config/socket";

const SocketContext = createContext();

export { SocketContext };

export const SocketProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  
  const [socketStatus, setSocketStatus] = useState("disconnected");
  const socketRef = useRef(null);
  const isConnectingRef = useRef(false);

  const setupSocketEvents = (socket) => {
    socket.on("connect", () => {
      setSocketStatus("connected");
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO desconectado:", reason);
      setSocketStatus("disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Error de conexión Socket.IO:", error);
      setSocketStatus("disconnected");
    });
  };

  // Socket.io connection
  useEffect(() => {
    if (status !== 'authenticated' || !userId || isConnectingRef.current) return;

    // Si ya tenemos un socket conectado, solo configurar eventos
    if (socketRef.current && socketRef.current.connected) {
      setupSocketEvents(socketRef.current);
      setSocketStatus("connected");
      return;
    }

    // Marcar como conectando
    isConnectingRef.current = true;
    setSocketStatus("connecting");

    // Crear nueva conexión
    const socket = createSocketConnection(userId);
    
    if (!socket) {
      setSocketStatus("disconnected");
      isConnectingRef.current = false;
      return;
    }

    // Guardar referencia y configurar eventos
    socketRef.current = socket;
    setupSocketEvents(socket);

    // Cleanup function
    return () => {
      // Solo desconectar si realmente hay un socket Y no es un hot reload
      if (socketRef.current && !socketRef.current.connected) {
        disconnectSocket(socketRef.current);
        setSocketStatus("disconnected");
        socketRef.current = null;
        isConnectingRef.current = false;
      }
    };
  }, [userId, status]);

  // Cleanup al desmontar completamente (logout, etc.)
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        disconnectSocket(socketRef.current);
        socketRef.current = null;
        isConnectingRef.current = false;
      }
    };
  }, []);

  const value = {
    socket: socketRef.current,
    socketStatus,
    isConnected: isSocketConnected(socketRef.current),
    userId,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
