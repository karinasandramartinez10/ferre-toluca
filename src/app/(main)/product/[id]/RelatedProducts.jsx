"use client";

import useRelatedProducts from "../../../../hooks/useRelatedProducts";
import ProductCarousel from "./ProductCarousel";

const RelatedProducts = ({ productId }) => {
  const { products, isLoading } = useRelatedProducts(productId);

  return (
    <ProductCarousel
      title="También te puede interesar"
      products={products}
      isLoading={isLoading}
      sourceId={productId}
      reason="similar"
    />
  );
};

export default RelatedProducts;
