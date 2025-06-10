"use client";

import BrandCarousel from "./BrandCarousel";
import Products from "./Products";

export const MainPage = ({ brands = [], products = [], session }) => {
  //TODO: quitar session auth y manejarlo use client

  const representativeProducts = Array.isArray(products)
    ? products.map((group) => group.variants[0])
    : [];

  return (
    <>
      <BrandCarousel brands={brands} />
      {session?.user.role === "admin" ||
      session?.user.role === "superadmin" ? undefined : (
        <Products products={representativeProducts} session={session} />
      )}
    </>
  );
};
