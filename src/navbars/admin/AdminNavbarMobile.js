import { AddCircleOutline, Home, Menu, Storefront } from "@mui/icons-material";
import { Box, Drawer, IconButton } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { useMemo, useState } from "react";
import { BurgerMenu } from "../../components/BurgerMenu";

export const adminSections = [
  {
    title: "Administrador",
    items: [
      {
        text: "Inicio",
        href: "/",
        icon: <Home />,
      },
      {
        icon: <AddCircleOutline />,
        text: "Panel",
        href: `/admin/add-product`,
      },
      {
        icon: <Storefront />,
        text: "Cotizaciones",
        href: `/admin/quotes`,
      },
    ],
  },
];

const AdminNavbarMobile = ({ role }) => {
  const [openNavbar, setOpenNavbar] = useState(false);

  const filteredSections = useMemo(() => {
    return adminSections.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.href === "/admin/add-product" && role !== "superadmin") {
          return false;
        }
        return true;
      }),
    }));
  }, [role]);

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
      <NextLink href="/">
        <Image
          src={"/images/texcoco_logo2.svg"}
          alt="ferreteria texcoco"
          width="90"
          height="60"
        />
      </NextLink>
      <IconButton
        size="large"
        edge="start"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        color="primary"
      >
        <Menu />
      </IconButton>
      <Drawer anchor="top" open={openNavbar} onClose={toggleDrawer(false)}>
        <BurgerMenu
          src={"/images/texcoco_logo2.svg"}
          toggleDrawer={toggleDrawer}
          sections={filteredSections}
        />
      </Drawer>
    </Box>
  );
};

export default AdminNavbarMobile;
