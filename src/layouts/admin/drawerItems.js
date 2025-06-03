import {
  AddBusiness,
  AddCircleOutline,
  Home,
  Storefront,
  Category,
  Inventory,
} from "@mui/icons-material";

export const drawerItems = [
  {
    text: "Inicio",
    pathname: "/",
    icon: <Home sx={{ fontSize: 20 }} />,
    visibleFor: ["admin", "superadmin"],
  },
  {
    text: "Cotizaciones",
    pathname: "/admin/quotes",
    icon: <Storefront sx={{ fontSize: 20 }} />,
    isDynamic: true,
    visibleFor: ["admin", "superadmin"],
  },
  {
    text: "Agregar Productos",
    pathname: "/admin/add-product",
    icon: <AddCircleOutline sx={{ fontSize: 20 }} />,
    visibleFor: ["superadmin"],
  },
  {
    text: "Ver productos",
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
    text: "Categorías",
    pathname: "/admin/categories",
    icon: <Category sx={{ fontSize: 20 }} />,
    visibleFor: ["superadmin"],
  },
  {
    text: "Subcategorías",
    pathname: "/admin/subcategories",
    icon: <Category sx={{ fontSize: 20 }} />,
    visibleFor: ["superadmin"],
  },
  {
    text: "Variantes de Producto",
    pathname: "/admin/product-type",
    icon: <Category sx={{ fontSize: 20 }} />,
    visibleFor: ["superadmin"],
  },
];
