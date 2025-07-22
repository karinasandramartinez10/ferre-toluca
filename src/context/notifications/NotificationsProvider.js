"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import NotificationsContext from "./NotificationsContext";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notifications";

export const NotificationsProvider = ({ children }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotification, setLastNotification] = useState(null);
  const socketRef = useRef(null);

  const fetchNotificationsList = useCallback(async () => {
    if (!userId) return;
    try {
      const notifications = await fetchNotifications();
      setNotifications(notifications || []);
      setUnreadCount((notifications || []).filter((n) => !n.isRead).length);
    } catch (err) {
      // handle error
    }
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      // handle error
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      // handle error
    }
  };

  // Socket.io connection
  useEffect(() => {
    if (!userId) return;
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_API_URL || "", {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;
    socket.emit("join-user-room", userId);
    socket.on("notification", (notification) => {
      console.log("Conectado al backend por socket, id:", socket.id);

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setLastNotification(notification);
    });
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // Fetch notifications on mount and when userId changes
  useEffect(() => {
    fetchNotificationsList();
  }, [fetchNotificationsList]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        fetchNotifications: fetchNotificationsList,
        lastNotification,
        setLastNotification,
        socket: socketRef.current,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
