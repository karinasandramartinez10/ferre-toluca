import { useContext } from "react";
import { SocketContext } from "./SocketContext";

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("❌ useSocket debe ser usado dentro de un SocketProvider");
  }
  return context;
};
