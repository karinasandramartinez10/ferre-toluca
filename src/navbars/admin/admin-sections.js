import {
  Storefront,
  ContactMail,
  MailOutline,
  Inventory,
  AddBusiness,
  Category,
  Settings,
} from "@mui/icons-material";

export const adminSections = [
  {
    title: "Ventas",
    items: [
      {
        icon: <Storefront />,
        text: "Cotizaciones",
        href: "/admin/quotes",
        visibleFor: ["admin", "superadmin"],
      },
    ],
  },
  {
    title: "Clientes",
    items: [
      {
        icon: <ContactMail />,
        text: "Solicitudes",
        href: "/admin/contact-requests",
        visibleFor: ["admin", "superadmin"],
      },
      {
        icon: <MailOutline />,
        text: "Invitaciones",
        href: "/admin/invitations",
        visibleFor: ["superadmin"],
      },
    ],
  },
  {
    title: "Catálogo",
    items: [
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
  {
    title: "Configuración",
    items: [
      {
        icon: <Settings />,
        text: "Ajustes",
        href: "/admin/settings",
        visibleFor: ["superadmin"],
      },
    ],
  },
];
