import { useContext } from "react";
import NotificationsContext from "./NotificationsContext";

export const useNotificationsContext = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
      throw new Error("❌ useNotifications debe ser usado dentro de un NotificacionsProvider");
    }
    return context;
  };
  