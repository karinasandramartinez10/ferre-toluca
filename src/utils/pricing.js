export const computeLinePricing = (cart, thresholds) => {
  const { minTotal, minSameProduct } = thresholds;
  const cartTotal = cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartQualifies = minTotal > 0 && cartTotal >= minTotal;

  return cart.map((line) => {
    const wp = line.product.wholesalePrice;
    const hasWholesale = wp != null && Number(wp) > 0;
    const lineQualifies = cartQualifies || (minSameProduct > 0 && line.quantity >= minSameProduct);
    const useWholesale = lineQualifies && hasWholesale;

    return {
      ...line,
      priceType: useWholesale ? "wholesale" : "retail",
      unitPrice: useWholesale ? wp : line.product.retailPrice,
      hasWholesale,
      missingForLineWholesale:
        hasWholesale && !lineQualifies ? Math.max(0, minSameProduct - line.quantity) : 0,
    };
  });
};

export const computeCartWholesaleGap = (cart, thresholds) => {
  const { minTotal } = thresholds;
  if (minTotal <= 0) return 0;
  const cartTotal = cart.reduce((sum, line) => sum + line.quantity, 0);
  return Math.max(0, minTotal - cartTotal);
};
