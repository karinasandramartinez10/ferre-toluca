"use client";

import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import { ArrowBackIosNewRounded } from "@mui/icons-material";
import Image from "next/image";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import NextLink from "next/link";
import AdminNavbarMobile from "../../navbars/admin/AdminNavbarMobile";
import { getPageMetadata } from "./routes-metadata";
import { drawerItems } from "./drawerItems";
import { logout } from "../../actions/logout";
import NotificationsBell from "../../components/NotificationsBell";

const drawerWidth = 200;

export const AdminLayout = ({ children, session }) => {
  const [_, setIsClosing] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { title, subtitle } = getPageMetadata(pathname);

  const role = session?.user?.role;

  const handleDrawerClose = () => {
    setIsClosing(true);
  };

  const drawer = useMemo(
    () => (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: "auto", px: 1 }}>
          <List sx={{ paddingX: 2, borderRadius: 1, paddingTop: 0 }}>
            <Box width="100%" padding={2} position="relative" height="100px">
              <NextLink href="/">
                <Image src={"/images/texcoco_logo2.svg"} alt="ferreteria texcoco" fill />
              </NextLink>
            </Box>
            <Stack gap={1}>
              {drawerItems
                .filter((item) => item.visibleFor.includes(role))
                .map((item) => (
                  <NextLink key={item.text} href={item.pathname}>
                    <ListItem disablePadding>
                      <ListItemButton
                        sx={(theme) => ({
                          color:
                            pathname === item.pathname ||
                            (item.isDynamic && pathname.startsWith(item.pathname))
                              ? "#FFF"
                              : theme.palette.primary.main,
                          borderRadius: 2,
                          alignItems: "flex-start",
                          gap: 1,
                          backgroundColor:
                            pathname === item.pathname ||
                            (item.isDynamic && pathname.startsWith(item.pathname))
                              ? theme.palette.primary.hover
                              : "transparent",
                          "&:hover": {
                            color: "#FFF",
                            backgroundColor: theme.palette.primary.hover,
                            transition: "background-color 0.3s ease",
                          },
                        })}
                        onClick={() => handleDrawerClose()}
                      >
                        {item.icon}
                        {item.text}
                      </ListItemButton>
                    </ListItem>
                  </NextLink>
                ))}
            </Stack>
          </List>
        </Box>
        {/* Separador */}
        <Divider sx={{ mx: 2 }} />

        {/* Botón de logout */}
        <Box sx={{ p: 2 }}>
          <Button variant="outlined" color="primary" fullWidth onClick={() => logout()}>
            Cerrar sesión
          </Button>
        </Box>
      </Box>
    ),
    [pathname, role]
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
