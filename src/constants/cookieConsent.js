export const CONSENT_COOKIE = "cookie_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 365;

export const COOKIE_CATEGORIES = [
  {
    key: "essential",
    label: "Esenciales",
    description:
      "Necesarias para que el sitio funcione: sesión, carrito y seguridad. Siempre activas.",
    locked: true,
  },
  {
    key: "analytics",
    label: "Analíticas",
    description: "Nos ayudan a entender de forma anónima cómo usas el sitio para mejorarlo.",
    locked: false,
  },
  {
    key: "marketing",
    label: "Marketing",
    description: "Permiten mostrarte ofertas y contenido más relevantes.",
    locked: false,
  },
];

export const OPTIONAL_CATEGORIES = COOKIE_CATEGORIES.filter((c) => !c.locked).map((c) => c.key);
