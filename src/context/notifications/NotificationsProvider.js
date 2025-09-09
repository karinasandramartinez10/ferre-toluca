"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import NotificationsContext from "./NotificationsContext";
import { useSocket } from "../socket/useSocket"; // ← Usar el hook correcto
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notifications";

export const NotificationsProvider = ({ children }) => {
  const { socket, userId } = useSocket();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotification, setLastNotification] = useState(null);

  const unreadCountMemo = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const updateUnreadCount = useCallback(() => {
    setUnreadCount(unreadCountMemo);
  }, [unreadCountMemo]);

  useEffect(() => {
    updateUnreadCount();
  }, [updateUnreadCount]);

  const fetchNotificationsList = useCallback(async () => {
    if (!userId) return;

    try {
      const notifications = await fetchNotifications();
      setNotifications(Array.isArray(notifications) ? notifications : []);
    } catch {
      // Si la llamada falla, aseguramos estado consistente
      setNotifications([]);
    }
  }, [userId]);

  const markAsRead = useCallback(async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {}
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  }, []);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setLastNotification(notification);
  }, []);

  useEffect(() => {
    if (!socket || !userId) return;

    socket.emit("join-user-room", userId);

    const handleConnect = () => {
      socket.emit("join-user-room", userId);
    };

    const handleNotification = (notification) => {
      addNotification(notification);
    };

    socket.on("connect", handleConnect);
    socket.on("notification", handleNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("notification", handleNotification);
    };
  }, [socket, userId, addNotification]);

  useEffect(() => {
    fetchNotificationsList();
  }, [fetchNotificationsList]);

  const contextValue = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      fetchNotifications: fetchNotificationsList,
      lastNotification,
      setLastNotification,
      socket,
      socketStatus: socket?.connected ? "connected" : "disconnected",
      isConnected: socket?.connected || false,
    }),
    [
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      fetchNotificationsList,
      lastNotification,
      socket,
    ]
  );

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  );
};
