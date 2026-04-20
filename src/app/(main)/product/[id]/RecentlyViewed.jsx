"use client";

import useRecentlyViewed from "../../../../hooks/useRecentlyViewed";
import ProductCarousel from "./ProductCarousel";

const RecentlyViewed = ({ productId, isAvailable }) => {
  const { products, isLoading } = useRecentlyViewed(productId, isAvailable);

  return (
    <ProductCarousel
      title="Lo que viste recientemente"
      products={products}
      isLoading={isLoading}
      sourceId={productId}
      reason="recently_viewed"
    />
  );
};

export default RecentlyViewed;
