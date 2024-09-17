"use client";

import { Loading } from "../../components/Loading";
import { ErrorUI } from "../../components/Error";
import BrandCarousel from "./BrandCarousel";

export const MainPage = ({ session, brands }) => {
  if (!brands) return <Loading />;
  if (brands.length === 0) return <ErrorUI main />;

  return <BrandCarousel brands={brands} />;
};
