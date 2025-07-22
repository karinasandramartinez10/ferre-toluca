"use client";
import dynamic from "next/dynamic";
import {
  AppBar,
  Box,
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
import Cart from "../../components/Cart";
import NotificationsBell from "../../components/NotificationsBell";
import { MainNavbarDesktop } from "./MainNavbarDesktop";

const SearchInput = dynamic(() => import("../../components/Search"), { ssr: false });

const MainNavbarMobile = ({ session }) => {
  const [openNavbar, setOpenNavbar] = useState(false);
  const isAuthenticated = !!session?.user;
  const isAdmin =
    session?.user?.role === "admin" || session?.user?.role === "superadmin";

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
        <Image
          src={"/images/texcoco_logo2.svg"}
          alt="ferreteria texcoco"
          width="90"
          height="60"
        />
      </Link>

      <Box display="flex" alignItems="center" gap={1}>
        <SearchInput />
        {!isAdmin && <Cart />}
        <NotificationsBell />
        <IconButton
          size="large"
          edge="start"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          color="primary"
        >
          <Menu />
        </IconButton>
      </Box>

      <Drawer anchor="top" open={openNavbar} onClose={toggleDrawer(false)}>
        <BurgerMenu
          src={"/images/texcoco_logo2.svg"}
          toggleDrawer={toggleDrawer}
          sections={showSections()}
          showLogout={isAuthenticated}
        />
      </Drawer>
    </Box>
  );
};

export const MainNavbar = ({ ToolbarProps }) => {
  const { data: session } = useSession();

  return (
    <AppBar sx={{ justifyContent: "center" }}>
      <Toolbar sx={ToolbarProps}>
        <MainNavbarDesktop session={session} />
        <MainNavbarMobile session={session} />
      </Toolbar>
    </AppBar>
  );
};
