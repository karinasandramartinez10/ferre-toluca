"use client";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  Toolbar,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  adminSectionsMobile,
  noAuthSectionsMobile,
  userSectionsMobile,
} from "./list-items";
import { BurgerMenu } from "../../components/BurgerMenu";
import { Menu } from "@mui/icons-material";
import { logout } from "../../actions/logout";

const MainNavbarDesktop = ({ session }) => {
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === "admin";

  const Logout = () => {
    logout();
  };

  return (
    <Box
      justifyContent="space-between"
      width="100%"
      alignItems="center"
      sx={{ display: { xs: "none", md: "flex" } }}
    >
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Link href="/">
          <Image src={"/pexels-tools.jpg"} alt="logo" width="80" height="30" />
        </Link>
      </Box>
      {!isAuthenticated ? (
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Button
            sx={{ marginTop: 0 }}
            variant="contained"
            startIcon={<Avatar sx={{ width: "26px", height: "26px" }} />}
            href="/auth/login"
          >
            Iniciar sesión
          </Button>
        </Box>
      ) : (
        <Box display="flex" gap={1}>
          {isAdmin && <Button href="/admin/add-product">Ir al panel</Button>}
          <Button onClick={Logout}>Cerrar sesión</Button>
        </Box>
      )}
    </Box>
  );
};

const MainNavbarMobile = ({ session }) => {
  const [openNavbar, setOpenNavbar] = useState(false);
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === "admin";

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpenNavbar(open);
  };

  const showSections = () => {
    if (!isAuthenticated) return noAuthSectionsMobile;

    if (isAdmin) {
      return adminSectionsMobile;
    } else {
      return userSectionsMobile;
    }
  };

  return (
    <Box
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      sx={{ display: { xs: "flex", md: "none" } }}
    >
      <Link href="/">
        <Image src="/pexels-tools.jpg" alt="murket" width="90" height="30" />
      </Link>
      <IconButton
        size="large"
        edge="start"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{ padding: 0, color: "#FFF" }}
      >
        <Menu />
      </IconButton>
      <Drawer anchor="top" open={openNavbar} onClose={toggleDrawer(false)}>
        <BurgerMenu
          src="/pexels-tools.jpg"
          toggleDrawer={toggleDrawer}
          sections={showSections()}
          showLogout={isAuthenticated}
        />
      </Drawer>
    </Box>
  );
};

export const MainNavbar = ({ AppBarProps, ToolbarProps }) => {
  const { data: session } = useSession();

  return (
    <AppBar sx={{ justifyContent: "center"}}>
      <Toolbar sx={ToolbarProps}>
        <MainNavbarDesktop session={session} />
        <MainNavbarMobile session={session} />
      </Toolbar>
    </AppBar>
  );
};
