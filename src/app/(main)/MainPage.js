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
      {session.user.role === "user" && (
        <Products products={products} session={session} />
      )}
    </>
  );
};
