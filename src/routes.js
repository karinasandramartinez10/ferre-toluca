/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 */

export const publicRoutes = [
  "/", // Ruta raíz
  "/checkout", // Checkout
  /^\/brands\/.*$/, // Ruta dinámica para marcas
  /^\/categories\/.*$/, // Ruta dinámica para categorías
  /^\/product\/.*$/, // Ruta dinámica para productos individuales
  "/faq", // Preguntas Frecuentes
  "/privacy-statement", // Aviso de Privacidad
  "/terms-conditions", // Términos y Condiciones
  "/service-terms", // Términos del Servicio
  "/delivery-time", // Tiempos de entrega
  "/search", // Página de búsqueda
  "/all-products", // Todos los productos
];

/**
 * An array of routes that are used for admin
 */
export const adminRoutes = [
  // /^\/admin\/add-product/,
  // /^\/admin\/quotes\/.*/,
  "/admin/quotes",
];

export const superAdminRoutes = [
  /^\/admin\/add-product/,
  /^\/admin\/quotes\/.*/,
  "/admin/quotes",
  "/admin/brands",
];

/**
 * An array of routes that are used for user
 */
export const userRoutes = [
  "/favorites",
  '/history'
]

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
