"use client";

import BrandCarousel from "./BrandCarousel";
import Products from "./Products";

export const MainPage = ({ brands = [], products }) => {
  return (
    <>
      <BrandCarousel brands={brands} />
      <Products products={products} />
    </>
  );
};
