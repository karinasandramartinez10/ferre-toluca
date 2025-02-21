import {
  AddBusiness,
  AddCircleOutline,
  Category,
  Home,
  Inventory,
  Menu,
  Storefront,
} from "@mui/icons-material";
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
        visibleFor: ["admin", "superadmin"],
      },
      {
        icon: <Storefront />,
        text: "Cotizaciones",
        href: `/admin/quotes`,
        visibleFor: ["admin"],
      },
      {
        text: "Ver todos los productos",
        href: "/all-products",
        icon: <Inventory sx={{ fontSize: 20 }} />,
        visibleFor: ["admin", "superadmin"],
      },
      {
        icon: <AddCircleOutline />,
        text: "Agregar Productos",
        href: `/admin/add-product`,
        visibleFor: ["superadmin"],
      },
      {
        icon: <AddBusiness />,
        text: "Marcas",
        href: "/admin/brands",
        visibleFor: ["superadmin"],
      },
      {
        text: "Categorías",
        href: "/admin/categories",
        icon: <Category />,
        visibleFor: ["superadmin"],
      },
      {
        text: "Subcategorías",
        href: "/admin/subcategories",
        icon: <Category />,
        visibleFor: ["superadmin"],
      },
      {
        text: "Tipos de producto",
        href: "/admin/product-type",
        icon: <Category sx={{ fontSize: 20 }} />,
        visibleFor: ["superadmin"],
      },
    ],
  },
];

const AdminNavbarMobile = ({ role }) => {
  const [openNavbar, setOpenNavbar] = useState(false);

  const filteredSections = useMemo(() => {
    return adminSections.map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.visibleFor || item.visibleFor.includes(role)
      ),
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
