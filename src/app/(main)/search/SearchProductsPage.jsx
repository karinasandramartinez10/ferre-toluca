"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductsWithFilters } from "../../../components/filters";
import { Loading } from "../../../components/Loading";

const SearchProductsPageContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const fixedFilters = useMemo(
    () => ({ q: query }),
    [query]
  );

  return (
    <ProductsWithFilters
      title={`Resultados para "${query}"`}
      fixedFilters={fixedFilters}
      pageSize={10}
    />
  );
};

const SearchProductsPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <SearchProductsPageContent />
    </Suspense>
  );
};

export default SearchProductsPage;
