const formatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

/**
 * Formatea un precio como moneda MXN.
 * Retorna null SOLO si el valor es null/undefined/vacío.
 * Un precio de $0.00 se muestra como tal (no "Consultar precio").
 * @param {string|number|null|undefined} value
 * @returns {string|null} Precio formateado o null si no hay precio.
 */
export const formatPrice = (value) => {
  if (value == null || value === "") return null;
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num === 0) return null;
  return formatter.format(num);
};

/**
 * Formatea un precio para columnas de DataGrid admin.
 * Retorna "—" para null y "$0.00" para cero.
 * @param {string|number|null|undefined} value
 * @returns {string}
 */
export const formatPriceColumn = (value) => {
  if (value == null) return "—";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "—";
  return formatter.format(num);
};
