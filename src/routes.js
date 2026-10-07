/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 */

export const publicRoutes = [
  "/", // Ruta raíz
  "/checkout", // Checkout
  /^\/brands\/.*$/, // Ruta dinámica para marcas
  /^\/categories\/.*$/, // Ruta dinámica para categorías
  /^\/subcategories\/.*$/, // Ruta dinámica para subcategorías
  /^\/types\/.*$/, // Ruta dinámica para tipos de producto
  /^\/product\/.*$/, // Ruta dinámica para productos individuales
  "/faq", // Preguntas Frecuentes
  "/privacy-statement", // Aviso de Privacidad
  "/terms-conditions", // Términos y Condiciones
  "/cookies-policy", // Política de Cookies
  "/delivery-time", // Tiempos de entrega
  "/search", // Página de búsqueda
  "/all-products", // Todos los productos
  "/ofertas", // Página pública de ofertas/promociones
  "/contact", // Formulario de contacto
];

export const ADMIN_PREFIX = "/admin";

export const superAdminPrefixes = [
  "/admin/brands",
  "/admin/products",
  "/admin/taxonomy",
  "/admin/invitations",
];

export const USER_PREFIX = "/user";

export const isUnderPrefix = (pathname, prefix) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

/**
 * An array of routes that are used for authentication
 */
export const authRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  // "/auth/error",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
export const DEFAULT_ADMIN_LOGIN_REDIRECT = "/admin/quotes";

const matchesRoute = (pathname, route) =>
  typeof route === "string" ? pathname === route : route.test(pathname);

export const classifyRoute = (pathname) => {
  if (pathname.startsWith(apiAuthPrefix)) return "apiAuth";
  if (authRoutes.includes(pathname)) return "auth";
  if (isUnderPrefix(pathname, USER_PREFIX)) return "user";
  if (superAdminPrefixes.some((prefix) => isUnderPrefix(pathname, prefix))) return "superAdmin";
  if (isUnderPrefix(pathname, ADMIN_PREFIX)) return "admin";
  if (publicRoutes.some((route) => matchesRoute(pathname, route))) return "public";
  return "private";
};
