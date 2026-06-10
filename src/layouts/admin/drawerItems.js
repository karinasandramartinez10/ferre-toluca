import { Storefront, Groups, Inventory, AddBusiness, Category } from "@mui/icons-material";

export const drawerGroups = [
  {
    label: null,
    items: [
      {
        text: "Cotizaciones",
        pathname: "/admin/quotes",
        icon: <Storefront sx={{ fontSize: 20 }} />,
        isDynamic: true,
        visibleFor: ["admin", "superadmin"],
        badgeType: "quotes",
      },
      {
        text: "Clientes",
        pathname: "/admin/clients",
        icon: <Groups sx={{ fontSize: 20 }} />,
        visibleFor: ["admin", "superadmin"],
        badgeType: "contact-requests",
      },
      {
        text: "Productos",
        pathname: "/admin/products",
        icon: <Inventory sx={{ fontSize: 20 }} />,
        visibleFor: ["admin", "superadmin"],
      },
      {
        text: "Marcas",
        pathname: "/admin/brands",
        icon: <AddBusiness sx={{ fontSize: 20 }} />,
        visibleFor: ["superadmin"],
      },
      {
        text: "Clasificación",
        pathname: "/admin/taxonomy",
        icon: <Category sx={{ fontSize: 20 }} />,
        visibleFor: ["superadmin"],
      },
    ],
  },
];
