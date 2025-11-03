"use client";

import { Box, Drawer, IconButton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BurgerMenu } from "../../components/BurgerMenu";
import { Menu } from "@mui/icons-material";
import Cart from "../../components/Cart";
import NotificationsBell from "../../components/NotificationsBell";
import { userSectionsMobile } from "../main/list-items";

export const UserNavbarMobile = () => {
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
          src={"/images/texcocowhite.svg"}
          alt="ferreteria texcoco"
          width="90"
          height="60"
        />
      </Link>

      <Box display="flex" alignItems="center">
        <Cart />
        <NotificationsBell />
        <IconButton
          edge="start"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          sx={(theme) => ({
            color: theme.palette.grey.light,
            marginLeft: "auto",
          })}
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
