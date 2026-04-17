export const withPricingMode = (params, pricingMode) => {
  if (pricingMode) params.pricingMode = pricingMode;
  return params;
};
