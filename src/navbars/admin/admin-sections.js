import {
  Storefront,
  ContactMail,
  MailOutline,
  Inventory,
  AddBusiness,
  Category,
  Groups,
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
        icon: <Groups />,
        text: "Tipos de cliente",
        href: "/admin/clients",
        visibleFor: ["admin", "superadmin"],
      },
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
];
