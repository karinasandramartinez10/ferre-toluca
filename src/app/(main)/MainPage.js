"use client";

import BrandCarousel from "./BrandCarousel";
import Products from "./Products";

export const MainPage = ({
  brands = [],
  products = [],
  session = { session },
}) => {
  return (
    <>
      <BrandCarousel brands={brands} />
      <Products products={products} session={session} />
    </>
  );
};
