import {
  AdminPanelSettings,
  FactCheck,
  Favorite,
  LocalOffer,
  LoginOutlined,
  Person,
  Receipt,
} from "@mui/icons-material";

export const noAuthSectionsMobile = [
  {
    items: [
      {
        icon: <LocalOffer />,
        text: "Ofertas",
        href: "/ofertas",
      },
      {
        icon: <LoginOutlined />,
        text: "Iniciar sesión",
        href: "/auth/login",
      },
      {
        icon: <Person />,
        text: "Contáctanos",
        href: "/contact",
      },
    ],
  },
];

export const adminSectionsMobile = [
  {
    title: "Administrador",
    items: [
      {
        icon: <AdminPanelSettings />,
        text: "Panel de administrador",
        href: `/admin/products`,
      },
    ],
  },
];

export const userSectionsMobile = [
  {
    items: [
      {
        icon: <LocalOffer />,
        text: "Ofertas",
        href: "/ofertas",
      },
      {
        icon: <FactCheck />,
        text: "Datos de facturación",
        href: `/user/profile/fiscal`,
      },
      {
        icon: <Receipt />,
        text: "Historial de cotizaciones",
        href: `/user/profile/history`,
      },
      {
        icon: <Favorite />,
        text: "Favoritos",
        href: `/user/profile/favorites`,
      },
    ],
  },
];
