"use client";

import BrandCarousel from "./BrandCarousel";
import Products from "./Products";
import ActivePromotionsBanner from "../../components/ActivePromotionsBanner";

export const MainPage = ({ brands = [], products = [], session }) => {
  //TODO: quitar session auth y manejarlo use client

  const representativeProducts = Array.isArray(products)
    ? products.map((group) => group.variants[0])
    : [];

  const isAdmin = session?.user.role === "admin" || session?.user.role === "superadmin";

  return (
    <>
      {!isAdmin && <ActivePromotionsBanner />}
      <BrandCarousel brands={brands} />
      {!isAdmin && <Products products={representativeProducts} session={session} />}
    </>
  );
};
