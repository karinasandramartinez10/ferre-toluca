import {
  Storefront,
  ContactMail,
  MailOutline,
  Inventory,
  AddBusiness,
  Category,
  Settings,
} from "@mui/icons-material";

export const drawerGroups = [
  {
    label: "Ventas",
    items: [
      {
        text: "Cotizaciones",
        pathname: "/admin/quotes",
        icon: <Storefront sx={{ fontSize: 20 }} />,
        isDynamic: true,
        visibleFor: ["admin", "superadmin"],
        badgeType: "quotes",
      },
    ],
  },
  {
    label: "Clientes",
    items: [
      {
        text: "Solicitudes",
        pathname: "/admin/contact-requests",
        icon: <ContactMail sx={{ fontSize: 20 }} />,
        visibleFor: ["admin", "superadmin"],
        badgeType: "contact-requests",
      },
      {
        text: "Invitaciones",
        pathname: "/admin/invitations",
        icon: <MailOutline sx={{ fontSize: 20 }} />,
        visibleFor: ["superadmin"],
      },
    ],
  },
  {
    label: "Catálogo",
    items: [
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
  {
    label: "Configuración",
    items: [
      {
        text: "Ajustes",
        pathname: "/admin/settings",
        icon: <Settings sx={{ fontSize: 20 }} />,
        visibleFor: ["superadmin"],
      },
    ],
  },
];
