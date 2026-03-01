"use client";

import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { createSocketConnection, disconnectSocket, isSocketConnected } from "../../config/socket";

const SocketContext = createContext();

export { SocketContext };

export const SocketProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [socketStatus, setSocketStatus] = useState("disconnected");
  const socketRef = useRef(null);
  const isConnectingRef = useRef(false);
  const handlersRef = useRef(null);

  const getHandlers = useCallback(() => {
    if (!handlersRef.current) {
      handlersRef.current = {
        onConnect: () => setSocketStatus("connected"),
        onDisconnect: (reason) => {
          console.log("Socket.IO desconectado:", reason);
          setSocketStatus("disconnected");
        },
        onConnectError: (error) => {
          console.error("Error de conexión Socket.IO:", error);
          setSocketStatus("disconnected");
        },
      };
    }
    return handlersRef.current;
  }, []);

  const setupSocketEvents = useCallback(
    (socket) => {
      const handlers = getHandlers();
      socket.off("connect", handlers.onConnect);
      socket.off("disconnect", handlers.onDisconnect);
      socket.off("connect_error", handlers.onConnectError);

      socket.on("connect", handlers.onConnect);
      socket.on("disconnect", handlers.onDisconnect);
      socket.on("connect_error", handlers.onConnectError);
    },
    [getHandlers]
  );

  const cleanupSocketEvents = useCallback(
    (socket) => {
      const handlers = getHandlers();
      socket.off("connect", handlers.onConnect);
      socket.off("disconnect", handlers.onDisconnect);
      socket.off("connect_error", handlers.onConnectError);
    },
    [getHandlers]
  );

  // Socket.io connection
  useEffect(() => {
    if (status !== "authenticated" || !userId || isConnectingRef.current) return;

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

    return () => {
      if (socketRef.current) {
        cleanupSocketEvents(socketRef.current);
        disconnectSocket(socketRef.current);
        socketRef.current = null;
        isConnectingRef.current = false;
      }
    };
  }, [userId, status, setupSocketEvents, cleanupSocketEvents]);

  // Cleanup al desmontar completamente (logout, etc.)
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        cleanupSocketEvents(socketRef.current);
        disconnectSocket(socketRef.current);
        socketRef.current = null;
        isConnectingRef.current = false;
      }
    };
  }, [cleanupSocketEvents]);

  const value = {
    socket: socketRef.current,
    socketStatus,
    isConnected: isSocketConnected(socketRef.current),
    userId,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
