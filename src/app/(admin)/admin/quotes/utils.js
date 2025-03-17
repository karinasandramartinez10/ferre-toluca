export const calculateTotalQuantity = (products) => {
  return products?.reduce(
    (acc, product) => acc + (product?.QuoteProduct?.quantity || 0),
    0
  );
};
