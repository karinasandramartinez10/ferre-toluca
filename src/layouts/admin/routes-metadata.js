export const PAGE_METADATA = {
  "/admin/products": {
    title: "Productos",
    subtitle:
      "Consulta, edita y agrega productos. Gestiona precios, disponibilidad e importa por lote o CSV.",
  },
  "/admin/quotes": {
    title: "Cotizaciones",
    subtitle:
      "Gestiona las cotizaciones de los clientes. Revisa pendientes y consulta el historial de enviadas.",
  },
  "/admin/brands": {
    title: "Marcas",
    subtitle:
      "Gestiona las marcas disponibles en la tienda. Puedes crear nuevas o editar las existentes",
  },
  "/admin/taxonomy": {
    title: "Clasificación",
    subtitle: "Gestiona categorías, subcategorías y tipos de producto para organizar tu catálogo.",
  },
  "/admin/invitations": {
    title: "Invitaciones",
    subtitle: "Envía invitaciones de registro a nuevos clientes y gestiona su estado.",
  },
  "/admin/contact-requests": {
    title: "Solicitudes de contacto",
    subtitle:
      "Revisa las solicitudes de contacto de visitantes interesados. Coordina y envía invitaciones.",
  },
  "/admin/clients": {
    title: "Clientes",
    subtitle:
      "Gestiona el ciclo de vida de tus clientes: solicitudes, invitaciones y clasificación por tipo de precio.",
  },
  "/user/profile/fiscal": {
    title: "Datos de facturación",
    subtitle: "Administra tus datos de facturación para emitir facturas y agilizar tus compras.",
  },
  "/user/profile/history": {
    title: "Historial de cotizaciones",
    subtitle: "Revisa tus cotizaciones anteriores y sigue el proceso de compra.",
  },
  "/user/profile/favorites": {
    title: "Favoritos",
    subtitle: "Revisa tus productos favoritos.",
  },
};

export const getPageMetadata = (pathname) => {
  if (pathname.startsWith("/admin/quotes/")) {
    return {
      title: "Detalles de la cotización",
      subtitle:
        "Revisa y da seguimiento a la solicitud del cliente. Usa los botones de contacto y marca la cotización como leída una vez atendida.",
    };
  }

  if (pathname.startsWith("/user/profile/history/")) {
    return {
      title: "Detalles de la cotización",
      subtitle: "Revisa los detalles de la cotización.",
    };
  }

  return PAGE_METADATA[pathname] || { title: "", subtitle: "" };
};
