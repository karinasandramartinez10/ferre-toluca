/**
 * Tiempos de stale por categoría de dato.
 *
 * STATIC: Datos que rara vez cambian (catálogos, menú de navegación).
 * DYNAMIC: Datos que cambian con acciones del usuario pero no en tiempo real.
 * FREQUENT: Datos que cambian frecuentemente o dependen de filtros del momento.
 */
const minutes = (n) => n * 60 * 1000;

export const staleTimes = {
  STATIC: minutes(10),
  DYNAMIC: minutes(5),
  FREQUENT: minutes(2),
};

export const gcTimes = {
  LONG: minutes(30),
  SHORT: minutes(10),
};
