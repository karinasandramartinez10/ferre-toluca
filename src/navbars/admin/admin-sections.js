import {
  AddBusiness,
  AddCircleOutline,
  Category,
  Home,
  Inventory,
  Storefront,
} from "@mui/icons-material";

export const adminSections = [
    {
      title: "Administrador",
      items: [
        {
          text: "Inicio",
          href: "/",
          icon: <Home />,
          visibleFor: ["admin", "superadmin"],
        },
        {
          icon: <Storefront />,
          text: "Cotizaciones",
          href: `/admin/quotes`,
          visibleFor: ["admin", "superadmin"],
        },
        {
          icon: <AddCircleOutline />,
          text: "Agregar Productos",
          href: `/admin/add-product`,
          visibleFor: ["superadmin"],
        },
        {
          text: "Ver productos",
          href: "/admin/products",
          icon: <Inventory sx={{ fontSize: 20 }} />,
          visibleFor: ["admin", "superadmin"],
        },
        {
          icon: <AddBusiness />,
          text: "Marcas",
          href: "/admin/brands",
          visibleFor: ["superadmin"],
        },
        {
          text: "Categorías",
          href: "/admin/categories",
          icon: <Category />,
          visibleFor: ["superadmin"],
        },
        {
          text: "Subcategorías",
          href: "/admin/subcategories",
          icon: <Category />,
          visibleFor: ["superadmin"],
        },
        {
          text: "Variantes de Producto",
          href: "/admin/product-type",
          icon: <Category sx={{ fontSize: 20 }} />,
          visibleFor: ["superadmin"],
        },
      ],
    },
  ];