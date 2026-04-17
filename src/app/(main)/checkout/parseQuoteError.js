/**
 * Parsea errores de la API de cotización y retorna un mensaje legible.
 * Maneja los 4 tipos de error del backend:
 * 1. Productos no disponibles
 * 2. Productos sin precio mayoreo
 * 3. Cantidad mínima no alcanzada
 * 4. Perfil fiscal no autorizado / otros
 */
export const parseQuoteError = (error) => {
  const data = error?.data;

  if (data?.unavailableProducts) {
    const names = data.unavailableProducts.map((p) => p.name).join(", ");
    return `Productos no disponibles: ${names}. Quítalos del carrito para continuar.`;
  }

  if (data?.productsWithoutWholesale) {
    return "Algunos productos no tienen precio de mayoreo. Cambia a modo menudeo o quítalos del carrito.";
  }

  if (data?.minQuantity) {
    return `Cantidad mínima para mayoreo: ${data.minQuantity} piezas. Tienes ${data.currentQuantity}.`;
  }

  return error?.message || "Hubo un error al procesar la orden";
};
