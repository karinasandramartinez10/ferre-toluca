"use client";

import { Suspense } from "react";
import { ProductsWithFilters } from "../../../components/filters";
import { Loading } from "../../../components/Loading";

const AllProductsPageContent = () => {
  return (
    <ProductsWithFilters
      title="Todos los productos"
      fixedFilters={{}}
      pageSize={10}
    />
  );
};

const AllProductsPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <AllProductsPageContent />
    </Suspense>
  );
};

export default AllProductsPage;
