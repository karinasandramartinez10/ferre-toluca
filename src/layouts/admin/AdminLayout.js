"use client";

import {
  AppBar,
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  Stack,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import { ArrowBackIosNewRounded, ExpandLess, ExpandMore } from "@mui/icons-material";
import Image from "next/image";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import NextLink from "next/link";
import AdminNavbarMobile from "../../navbars/admin/AdminNavbarMobile";
import { getPageMetadata } from "./routes-metadata";
import { drawerGroups } from "./drawerItems";
import { logout } from "../../actions/logout";
import NotificationsBell from "../../components/NotificationsBell";
import { useNotificationsContext } from "../../context/notifications/useNotificationsContext";

const drawerWidth = 200;

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
  const { notifications } = useNotificationsContext();

  const { title, subtitle } = getPageMetadata(pathname);

  const role = session?.user?.role;

  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    drawerGroups.forEach((group) => {
      const hasActiveItem = group.items.some(
        (item) => item.visibleFor.includes(role) && isItemActive(pathname, item)
      );
      initial[group.label] = hasActiveItem;
    });
    return initial;
  });

  const toggleGroup = (label) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const drawer = useMemo(
    () => (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ flexGrow: 1, overflowY: "auto", px: 1 }}>
          <Box width="100%" padding={2} position="relative" height="80px">
            <NextLink href="/">
              <Image src={"/images/texcoco_logo2.svg"} alt="ferreteria texcoco" fill />
            </NextLink>
          </Box>
          <List sx={{ pt: 0 }}>
            {drawerGroups.map((group) => {
              const visibleItems = group.items.filter((item) => item.visibleFor.includes(role));
              if (visibleItems.length === 0) return null;

              const isOpen = openGroups[group.label] ?? false;

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
                    {isOpen ? (
                      <ExpandLess sx={{ fontSize: 16 }} />
                    ) : (
                      <ExpandMore sx={{ fontSize: 16 }} />
                    )}
                  </ListSubheader>
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <Stack gap={0.5} sx={{ px: 1 }}>
                      {visibleItems.map((item) => {
                        const active = isItemActive(pathname, item);
                        const badgeCount = getBadgeCount(notifications, item.badgeType);

                        return (
                          <NextLink key={item.text} href={item.pathname}>
                            <ListItem disablePadding>
                              <ListItemButton
                                sx={(theme) => ({
                                  color: active ? "#FFF" : theme.palette.primary.main,
                                  borderRadius: 2,
                                  gap: 1,
                                  py: 0.75,
                                  fontSize: "0.85rem",
                                  backgroundColor: active
                                    ? theme.palette.primary.hover
                                    : "transparent",
                                  "&:hover": {
                                    color: "#FFF",
                                    backgroundColor: theme.palette.primary.hover,
                                    transition: "background-color 0.2s ease",
                                  },
                                })}
                              >
                                {item.icon}
                                {item.text}
                                {badgeCount > 0 && (
                                  <Badge
                                    badgeContent={badgeCount}
                                    color="error"
                                    sx={{ ml: "auto" }}
                                  />
                                )}
                              </ListItemButton>
                            </ListItem>
                          </NextLink>
                        );
                      })}
                    </Stack>
                  </Collapse>
                </Box>
              );
            })}
          </List>
        </Box>
        <Divider sx={{ mx: 2 }} />
        <Box sx={{ p: 2 }}>
          <Button variant="outlined" color="primary" fullWidth onClick={() => logout()}>
            Cerrar sesión
          </Button>
        </Box>
      </Box>
    ),
    [pathname, role, openGroups, notifications]
  );

  const pathSegments = pathname.split("/").filter(Boolean);
  // por ejemplo: si hay más de 2 segmentos (p.ej. /admin/quotes/123)
  const showBackButton = pathSegments.length > 2;

  return (
    <Box
      component="section"
      sx={{
        margin: "0 auto",
        maxWidth: "1440px",
      }}
    >
      <Box component="nav" sx={{ display: { xs: "block", sm: "none" } }}>
        <AppBar>
          <Toolbar sx={{ paddingRight: "8px" }}>
            <AdminNavbarMobile role={role} />
            <Box flexGrow={1} />
          </Toolbar>
        </AppBar>
      </Box>
      <main>
        <Box
          sx={{
            width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
            marginLeft: { xs: 0, sm: `${drawerWidth}px` },
            padding: { xs: "16px", sm: "24px" },
          }}
        >
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              width: "100%",
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            {drawer}
          </Drawer>

          <Grid
            sx={{ marginTop: { xs: "50px", md: "0px" } }}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <Grid item xs={12} display="flex" alignItems="center" gap={1}>
              <Box width="100%">
                <Box display="flex" gap={1.5} justifyContent="space-between">
                  <Box display="flex" gap={1}>
                    {showBackButton && (
                      <IconButton onClick={() => router.back()}>
                        <ArrowBackIosNewRounded
                          sx={{
                            color: "primary.main",
                          }}
                        />
                      </IconButton>
                    )}
                    <Typography variant="h1">{title}</Typography>
                  </Box>
                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <NotificationsBell color="primary.main" />
                  </Box>
                </Box>
                <Typography sx={{ color: "#838383", fontWeight: 500 }} variant="body">
                  {subtitle}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              {children}
            </Grid>
          </Grid>
        </Box>
      </main>
      <footer></footer>
    </Box>
  );
};
