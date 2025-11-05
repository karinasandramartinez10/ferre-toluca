import {
  Home,
  Favorite,
  ReceiptLong,
  RequestQuote,
} from "@mui/icons-material";

export const userDrawerItems = [
  {
    text: "Inicio",
    pathname: "/",
    icon: <Home sx={{ fontSize: 20 }} />,
    visibleFor: ["admin", "superadmin"],
  },
  {
    text: "Datos de facturación",
    pathname: "/user/profile/fiscal",
    icon: <RequestQuote sx={{ fontSize: 20 }} />,
    visibleFor: ["user"],
  },
  {
    text: "Historial",
    pathname: "/user/profile/history",
    icon: <ReceiptLong sx={{ fontSize: 20 }} />,
    isDynamic: true,
    visibleFor: ["user"],
  },
  {
    text: "Favoritos",
    pathname: "/user/profile/favorites",
    icon: <Favorite sx={{ fontSize: 20 }} />,
    visibleFor: ["user"],
  },
];
