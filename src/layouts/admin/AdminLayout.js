"use client";

import { Dashboard, Home, Menu, Storefront } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Drawer,
  Grid,
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
import { usePathname } from "next/navigation";
import NextLink from "next/link";
const drawerWidth = 200;

const listItems = [
  {
    text: "Inicio",
    pathname: "/",
    icon: <Home sx={{ fontSize: 20 }} />,
  },
  {
    text: "Panel",
    pathname: "/admin",
    icon: <Dashboard sx={{ fontSize: 20 }} />,
  },
  {
    text: "Cotizaciones",
    pathname: "/admin/quotes",
    icon: <Storefront sx={{ fontSize: 20 }} />,
  },
];

const getPageTitle = (pathname) => {
  if (pathname === "/admin") return "Agregar Producto";
  if (pathname === "/admin/quotes") return "Todas las cotizaciones";
  return;
};

const AdminDesktopLayout = ({ children, drawer, pathname }) => {
  return (
    <Box
      component="section"
      sx={{
        margin: "0 auto",
        maxWidth: "1280px",
        display: { xs: "none", md: "block" },
      }}
    >
      <nav></nav>
      <main
        style={{
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: drawerWidth,
          padding: "24px",
        }}
      >
        <Drawer
          variant="permanent"
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

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h1">{getPageTitle(pathname)}</Typography>
          </Grid>
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </main>
      <footer></footer>
    </Box>
  );
};

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
    <Box component="section" sx={{ display: { xs: "block", md: "none" } }}>
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
      <main
        style={{
          margin: "68px auto",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
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
    </Box>
  );
};

export const AdminLayout = ({ children }) => {
  const pathname = usePathname();

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
          <NextLink key={item.text} href={item.pathname}>
            <ListItem disablePadding>
              <ListItemButton
                sx={(theme) => ({
                  color:
                    pathname === item.pathname
                      ? "#FFF"
                      : theme.palette.primary.main,
                  borderRadius: 2,
                  alignItems: "flex-start",
                  gap: 1,
                  backgroundColor:
                    pathname === item.pathname
                      ? theme.palette.primary.hover
                      : "transparent",
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
          </NextLink>
        ))}
      </Stack>
    </List>
  );

  return (
    <>
      <AdminDesktopLayout pathname={pathname} drawer={drawer}>
        {children}
      </AdminDesktopLayout>
      ;<AdminMobileLayout drawer={drawer}>{children}</AdminMobileLayout>;
    </>
  );
};
