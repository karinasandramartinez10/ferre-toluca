"use client";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Chip,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ArrowBackIosNewRounded,
  ExpandLess,
  ExpandMore,
  Logout,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import NextLink from "next/link";
import { getPageMetadata } from "./routes-metadata";
import { drawerGroups } from "./drawerItems";
import { signOut } from "next-auth/react";
import NotificationsBell from "../../components/NotificationsBell";
import { useNotificationsContext } from "../../context/notifications/useNotificationsContext";

const FULL_WIDTH = 220;
const MINI_WIDTH = 72;
const APPBAR_HEIGHT = 60;

const isItemActive = (pathname, item) =>
  pathname === item.pathname || (item.isDynamic && pathname.startsWith(item.pathname));

const getBadgeCount = (notifications, badgeType) => {
  if (!badgeType || !notifications) return 0;
  if (badgeType === "quotes") {
    return notifications.filter((n) => !n.isRead && n.type === "inbox").length;
  }
  if (badgeType === "contact-requests") {
    return notifications.filter((n) => !n.isRead && n.type === "contact-request").length;
  }
  return 0;
};

export const AdminLayout = ({ children, session }) => {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { notifications } = useNotificationsContext();

  const { title, subtitle } = getPageMetadata(pathname);
  const role = session?.user?.role;
  const email = session?.user?.email || "";

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userAnchor, setUserAnchor] = useState(null);
  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    drawerGroups.forEach((group) => {
      if (group.label) initial[group.label] = true;
    });
    return initial;
  });

  const mini = collapsed && !isMobile;
  const sidebarWidth = mini ? MINI_WIDTH : FULL_WIDTH;

  const toggleGroup = (label) => setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  const handleNavClick = () => {
    if (isMobile) setMobileOpen(false);
  };

  const pathSegments = pathname.split("/").filter(Boolean);
  const showBackButton = pathSegments.length > 2;

  const renderItem = (item) => {
    const active = isItemActive(pathname, item);
    const badgeCount = getBadgeCount(notifications, item.badgeType);

    const button = (
      <NextLink
        key={item.text}
        href={item.pathname}
        onClick={handleNavClick}
        style={{ textDecoration: "none" }}
      >
        <ListItemButton
          sx={(t) => ({
            color: active ? "#FFF" : t.palette.primary.main,
            borderRadius: 2,
            mb: 0.5,
            justifyContent: mini ? "center" : "flex-start",
            px: mini ? 1 : 1.5,
            py: 0.75,
            backgroundColor: active ? t.palette.primary.hover : "transparent",
            "&:hover": { color: "#FFF", backgroundColor: t.palette.primary.hover },
          })}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: mini ? 0 : 1.5, color: "inherit" }}>
            {item.icon}
          </ListItemIcon>
          {!mini && (
            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: "0.85rem" }} />
          )}
          {!mini && badgeCount > 0 && (
            <Badge badgeContent={badgeCount} color="error" sx={{ ml: "auto", mr: 1 }} />
          )}
        </ListItemButton>
      </NextLink>
    );

    return mini ? (
      <Tooltip key={item.text} title={item.text} placement="right">
        <Box>{button}</Box>
      </Tooltip>
    ) : (
      button
    );
  };

  const navContent = (
    <List sx={{ pt: 1 }}>
      {drawerGroups.map((group, groupIndex) => {
        const visibleItems = group.items.filter((item) => item.visibleFor.includes(role));
        if (visibleItems.length === 0) return null;

        // En mini, o grupo sin título → items directos (sin header)
        if (mini || !group.label) {
          return (
            <Box key={group.label || `top-${groupIndex}`} sx={{ px: 1, mt: group.label ? 1 : 0 }}>
              {visibleItems.map(renderItem)}
            </Box>
          );
        }

        const isOpen = openGroups[group.label] ?? true;
        return (
          <Box key={group.label}>
            <ListSubheader
              onClick={() => toggleGroup(group.label)}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "transparent",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "text.disabled",
                lineHeight: "32px",
                px: 2,
                mt: 1,
                userSelect: "none",
              }}
            >
              {group.label}
              {isOpen ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
            </ListSubheader>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <Box sx={{ px: 1 }}>{visibleItems.map(renderItem)}</Box>
            </Collapse>
          </Box>
        );
      })}
    </List>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          height: APPBAR_HEIGHT,
          justifyContent: "center",
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: `${APPBAR_HEIGHT}px !important`, gap: 1 }}>
          <IconButton
            edge="start"
            onClick={() => (isMobile ? setMobileOpen(true) : setCollapsed((c) => !c))}
            aria-label="Abrir/cerrar menú"
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ position: "relative", width: 100, height: 34 }}>
            <Image
              src="/images/toluca_logo2.svg"
              alt="Ferre Toluca"
              fill
              sizes="100px"
              style={{ objectFit: "contain" }}
            />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <NotificationsBell color="primary.main" />
          <IconButton onClick={(e) => setUserAnchor(e.currentTarget)} aria-label="Cuenta">
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "0.9rem" }}>
              {(email[0] || "A").toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={userAnchor}
            open={!!userAnchor}
            onClose={() => setUserAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ px: 2, py: 1, minWidth: 220 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {email || "Administrador"}
              </Typography>
              {role && <Chip label={role} size="small" variant="outlined" sx={{ mt: 0.5 }} />}
            </Box>
            <Divider />
            <MenuItem onClick={() => signOut({ callbackUrl: "/" })}>
              <Logout fontSize="small" sx={{ mr: 1 }} />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: FULL_WIDTH, boxSizing: "border-box" } }}
        >
          <Toolbar sx={{ minHeight: `${APPBAR_HEIGHT}px !important` }} />
          {navContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            whiteSpace: "nowrap",
            "& .MuiDrawer-paper": {
              width: sidebarWidth,
              boxSizing: "border-box",
              overflowX: "hidden",
              borderRight: "1px solid",
              borderColor: "divider",
              transition: theme.transitions.create("width", {
                duration: theme.transitions.duration.shorter,
              }),
            },
          }}
        >
          <Toolbar sx={{ minHeight: `${APPBAR_HEIGHT}px !important` }} />
          {navContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          mt: `${APPBAR_HEIGHT}px`,
          p: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ maxWidth: 1440, mx: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {showBackButton && (
                <IconButton onClick={() => router.back()}>
                  <ArrowBackIosNewRounded sx={{ color: "primary.main" }} />
                </IconButton>
              )}
              <Typography variant="h1">{title}</Typography>
            </Box>
            {subtitle && (
              <Typography sx={{ color: "text.secondary", fontWeight: 500 }} variant="body">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
};
