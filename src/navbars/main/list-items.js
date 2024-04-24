import { Dashboard, LoginOutlined, Person } from "@mui/icons-material";

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
        href: `/admin`,
      },
    ],
  },
];

export const userSectionsMobile = [
  {
    title: "",
    items: [],
  },
];
