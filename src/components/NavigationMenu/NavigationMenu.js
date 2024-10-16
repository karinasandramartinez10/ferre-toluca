"use client";

import { Box } from "@mui/material";
import { useState } from "react";
import DropdownAllCategories from "./DropdownAllCategories";
import NavigationLinks from "./NavigationLinks";
import DrawerMenu from "./Drawer";

export default function NavigationMenu({ categories }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenDropdown(!openDropdown);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setOpenDropdown(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const mainCategories = categories.slice(0,3)

  return (
    <Box
      component="section"
      sx={{
        paddingTop: { xs: "60px", sm: "66px" },
        paddingX: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Desktop */}
        <DropdownAllCategories
          anchorEl={anchorEl}
          categories={categories}
          open={openDropdown}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
        />

        {/* Desktop Links */}
        <NavigationLinks mainCategories={mainCategories} />

        {/* Mobile */}
        <DrawerMenu
          drawerOpen={drawerOpen}
          onToggle={toggleDrawer}
          categories={categories}
        />
      </Box>
    </Box>
  );
}
