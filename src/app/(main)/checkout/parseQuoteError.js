export const parseQuoteError = (error) => {
  const data = error?.data;

  if (data?.unavailableProducts) {
    const names = data.unavailableProducts.map((p) => p.name).join(", ");
    return `Productos no disponibles: ${names}. Quítalos del carrito para continuar.`;
  }

  if (data?.missingProductIds) {
    return `Algunos productos no fueron encontrados. Recarga la página e intenta de nuevo.`;
  }

  if (data?.productsWithoutWholesale) {
    return "Algunos productos no tienen precio de mayoreo configurado.";
  }

  return error?.message || "Hubo un error al procesar la orden";
};
