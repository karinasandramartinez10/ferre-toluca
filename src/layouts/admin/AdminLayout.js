"use client";

import { Dashboard, Home, Menu, Storefront } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import useResponsive from "../../hooks/use-responsive";

const drawerWidth = 200;

const listItems = [
  {
    text: "Inicio",
    icon: <Home sx={{ fontSize: 20 }} />,
  },
  {
    text: "Panel",
    icon: <Dashboard sx={{ fontSize: 20 }} />,
  },
  {
    text: "Órdenes",
    icon: <Storefront sx={{ fontSize: 20 }} />,
  },
];

const AdminDesktopLayout = ({ children, drawer }) => (
  <section>
    <aside>
      <Drawer
        variant="permanent"
        //   open={open}
        // onClose={() => setOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>
    </aside>
    <main
      style={{
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      }}
    >
      {children}
    </main>
  </section>
);

const AdminMobileLayout = ({ children, drawer }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <section>
      <nav>
        <AppBar position="fixed">
          <Toolbar sx={{ minHeight: "56px !important" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <Menu />
            </IconButton>
          </Toolbar>
        </AppBar>
      </nav>
      <main style={{ margin: "68px auto" }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {children}
      </main>
    </section>
  );
};

export const AdminLayout = ({ children }) => {
  const isDesktop = useResponsive("up", "md");

  const drawer = (
    <List sx={{ padding: 2, borderRadius: 1 }}>
      <Box width="100%" padding={2}>
        <Image
          src={"/pexels-tools.jpg"} //TODO: change for company logo
          alt="Picture of the author"
          width={140}
          height={50}
          quality={100}
          style={{
            objectFit: "cover",
          }}
        />
      </Box>
      <Stack gap={1}>
        {listItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={(theme) => ({
                color: theme.palette.primary.main,
                borderRadius: 2,
                alignItems: "flex-start",
                gap: 1,
                "&:hover": {
                  color: "#FFF",
                  backgroundColor: theme.palette.primary.hover,
                  transition: "background-color 0.3s ease",
                },
              })}
            >
              {item.icon}
              {item.text}
            </ListItemButton>
          </ListItem>
        ))}
      </Stack>
    </List>
  );

  if (isDesktop) {
    return <AdminDesktopLayout drawer={drawer}>{children}</AdminDesktopLayout>;
  } else {
    return <AdminMobileLayout drawer={drawer}>{children}</AdminMobileLayout>;
  }
};
