"use client";

import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Popover,
  Toolbar,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BurgerMenu } from "../../components/BurgerMenu";
import { Menu, Person } from "@mui/icons-material";
import { logout } from "../../actions/logout";
import Cart from "../../components/Cart";
import { userSectionsMobile } from "../main/list-items";

const UserNavbarDesktop = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
          <Image
            src={"/images/texcoco_logo2.svg"}
            alt="ferreteria texcoco"
            width="120"
            height="90"
          />
        </Link>
      </Box>
      <Box sx={{ display: { xs: "none", md: "block" } }}></Box>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton color="grey.main" onClick={handlePopoverOpen}>
          <Person />
        </IconButton>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box sx={{ p: 2 }}>
            <>
              <Button
                onClick={Logout}
                color="error"
                fullWidth
                variant="outlined"
              >
                Cerrar sesión
              </Button>
            </>
          </Box>
        </Popover>
        <Cart />
      </Box>
    </Box>
  );
};

const UserNavbarMobile = () => {
  const [openNavbar, setOpenNavbar] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpenNavbar(open);
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
        <Cart />
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
          sections={userSectionsMobile}
          showLogout
        />
      </Drawer>
    </Box>
  );
};

export const UserNavbar = () => {
  return (
    <AppBar sx={{ justifyContent: "center" }}>
      <Toolbar>
        <UserNavbarDesktop />
        <UserNavbarMobile />
      </Toolbar>
    </AppBar>
  );
};
