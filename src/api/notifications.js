import privateApi from "../config/private";

export const fetchNotifications = async () => {
  try {
    const { data } = await privateApi.get("/notifications");
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return [];
  }
};

export const markNotificationAsRead = async (id) => {
  try {
    await privateApi.patch(`/notifications/${id}/read`);
    return true;
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error);
    throw new Error(
      error.response?.data?.message || "Error al marcar notificación como leída"
    );
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    await privateApi.patch("/notifications/read-all");
    return true;
  } catch (error) {
    console.error(
      "Error al marcar todas las notificaciones como leídas:",
      error
    );
    throw new Error(
      error.response?.data?.message ||
        "Error al marcar todas las notificaciones como leídas"
    );
  }
};
