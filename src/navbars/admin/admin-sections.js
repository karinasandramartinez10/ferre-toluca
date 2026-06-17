import { Storefront, Inventory, AddBusiness, Category, Groups } from "@mui/icons-material";

export const adminSections = [
  {
    title: null,
    items: [
      {
        icon: <Storefront />,
        text: "Cotizaciones",
        href: "/admin/quotes",
        visibleFor: ["admin", "superadmin"],
      },
      {
        icon: <Groups />,
        text: "Clientes",
        href: "/admin/clients",
        visibleFor: ["admin", "superadmin"],
      },
      {
        icon: <Inventory />,
        text: "Productos",
        href: "/admin/products",
        visibleFor: ["admin", "superadmin"],
      },
      {
        icon: <AddBusiness />,
        text: "Marcas",
        href: "/admin/brands",
        visibleFor: ["superadmin"],
      },
      {
        icon: <Category />,
        text: "Clasificación",
        href: "/admin/taxonomy",
        visibleFor: ["superadmin"],
      },
    ],
  },
];
