"use client";

import BrandCarousel from "./BrandCarousel";
import Products from "./Products";

export const MainPage = ({ brands = [], products = [], session }) => {
  return (
    <>
      <BrandCarousel brands={brands} />
      {session?.user.role === "admin" ||
      session?.user.role === "superadmin" ? undefined : (
        <Products products={products} session={session} />
      )}
    </>
  );
};
