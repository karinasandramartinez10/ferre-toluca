import { useState } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Divider,
  Tooltip,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useNotificationsContext } from "../context/notifications/useNotificationsContext";

const MAX_NOTIFICATIONS = 10;

export default function NotificationsBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotificationsContext();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    if (notification.type === "inbox" && notification.data?.quoteId) {
      const role = session?.user?.role;
      if (role === "admin" || role === "superadmin") {
        router.push(`/admin/quotes/${notification.data.quoteId}`);
      } else {
        router.push(`/history/${notification.data.quoteId}`);
      }
    }
    handleClose();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <>
      <Tooltip title="Notificaciones" arrow>
        <IconButton
          sx={{
            color: pathname.includes("/admin") ? "primary.main" : "grey.light",
          }}
          onClick={handleOpen}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 340,
            maxHeight: 400,
            p: 0,
          },
        }}
      >
        <Box
          px={2}
          py={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontSize="16px" fontWeight={700}>
            Notificaciones
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              variant="text"
              onClick={handleMarkAllAsRead}
              sx={{ fontSize: "12px", textTransform: "none" }}
            >
              Marcar todo como leído
            </Button>
          )}
        </Box>
        <Divider />
        {(!Array.isArray(notifications) || notifications.length === 0) && (
          <MenuItem sx={{ marginTop: 1 }} disabled>
            <ListItemText
              primaryTypographyProps={{ fontSize: "14px" }}
              primary="No tienes notificaciones"
            />
          </MenuItem>
        )}
        {Array.isArray(notifications) &&
          notifications.slice(0, MAX_NOTIFICATIONS).map((n) => (
          <MenuItem
            key={n.id}
            onClick={() => handleNotificationClick(n)}
            selected={!n.isRead}
            sx={{ alignItems: "flex-start", whiteSpace: "normal" }}
          >
            <ListItemIcon sx={{ mt: 0.5 }}>
              <MarkEmailReadIcon color={n.isRead ? "disabled" : "primary"} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  fontWeight={n.isRead ? 400 : 700}
                  color={n.isRead ? "text.secondary" : "primary.main"}
                >
                  {n.title}
                </Typography>
              }
              secondary={
                <>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block" }}
                  >
                    {n.body}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ display: "block" }}
                  >
                    {new Date(n.createdAt).toLocaleString()}
                  </Typography>
                </>
              }
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
