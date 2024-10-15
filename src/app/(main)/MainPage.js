"use client";

import { Loading } from "../../components/Loading";
import { ErrorUI } from "../../components/Error";
import BrandCarousel from "./BrandCarousel";
import Products from "./Products";

export const MainPage = ({ brands, products }) => {
  if (!brands || !products) return <Loading />;
  if (brands.length === 0 || products.length === 0) return <ErrorUI main />;

  return (
    <>
      <BrandCarousel brands={brands} />
      <Products products={products} />
    </>
  );
};
