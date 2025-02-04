import { Dashboard, Favorite, LoginOutlined, Person, Receipt } from "@mui/icons-material";

export const noAuthSectionsMobile = [
  {
    items: [
      {
        icon: <Person />,
        text: "Crear cuenta",
        href: `/auth/signup`,
      },
      {
        icon: <LoginOutlined />,
        text: "Iniciar sesión",
        href: "/auth/login",
      },
    ],
  },
];

export const adminSectionsMobile = [
  {
    title: "Administrador",
    items: [
      {
        icon: <Dashboard />,
        text: "Panel",
        href: `/admin/add-product`,
      },
    ],
  },
];

export const userSectionsMobile = [
  {
    items: [
      {
        icon: <Favorite />,
        text: "Favoritos",
        href: `/favorites`,
      },
      {
        icon: <Receipt />,
        text: "Historial de órdenes",
        href: `/history`,
      },
    ],
  },
];
