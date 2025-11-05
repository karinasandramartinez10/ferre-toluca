"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  Drawer,
  Divider,
  Grid,
  AppBar,
  Toolbar,
  Button,
  Stack,
  ListItem,
  IconButton,
} from "@mui/material";
import useResponsive from "../../hooks/use-responsive";
import { getPageMetadata } from "../admin/routes-metadata";
import NotificationsBell from "../../components/NotificationsBell";
import { UserNavbarMobile } from "../../navbars/user/UserNavbarMobile";
import { logout } from "../../actions/logout";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { userDrawerItems } from "./userDrawerItems";
import Image from "next/image";
import { ArrowBackIosNewRounded } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const drawerWidth = 200;

export default function UserProfileLayout({ children }) {
  const [_, setIsClosing] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useResponsive("down", "sm");

  const { data: session } = useSession();

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
                <Image
                  src={"/images/texcoco_logo2.svg"}
                  alt="ferreteria texcoco"
                  fill
                />
              </NextLink>
            </Box>
            <Stack gap={1}>
              {userDrawerItems
                .filter((item) =>
                  item.visibleFor?.includes(session?.user?.role)
                )
                .map((item) => (
                  <NextLink key={item.text} href={item.pathname}>
                    <ListItem disablePadding>
                      <ListItemButton
                        sx={(theme) => ({
                          color:
                            pathname === item.pathname ||
                            (item.isDynamic &&
                              pathname.startsWith(item.pathname))
                              ? "#FFF"
                              : theme.palette.primary.main,
                          borderRadius: 2,
                          alignItems: "flex-start",
                          gap: 1,
                          backgroundColor:
                            pathname === item.pathname ||
                            (item.isDynamic &&
                              pathname.startsWith(item.pathname))
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
        <Divider sx={{ mx: 2 }} />
        <Box sx={{ p: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => logout()}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Box>
    ),
    [pathname, session?.user?.role]
  );

  const pathSegments = pathname.split("/").filter(Boolean);
  // por ejemplo: si hay más de 2 segmentos (p.ej. /admin/quotes/123)
  const showBackButton = pathSegments.length > 3;

  const { title, subtitle } = getPageMetadata(pathname);

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
            <UserNavbarMobile />
            <Box flexGrow={1} />
          </Toolbar>
        </AppBar>
      </Box>

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
      <main
        style={{
          width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
          marginLeft: isMobile ? 0 : drawerWidth,
          padding: isMobile ? "16px" : "24px",
        }}
      >
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
                {!isMobile && <NotificationsBell color="primary.main" />}
              </Box>
              <Typography
                sx={{ color: "#838383", fontWeight: 500 }}
                variant="body"
              >
                {subtitle}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </main>
    </Box>
  );
}
