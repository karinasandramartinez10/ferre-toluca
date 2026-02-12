"use client";

import { Suspense, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  toCapitalizeFirstLetter,
  transformCategoryPath,
} from "../../../../utils/cases";
import BreadcrumbsNavigation from "../../../../components/BreadcrumbsNavigation";
import { buildTypeBreadcrumbs } from "../../../../helpers/breadcrumbs";
import { ProductsWithFilters } from "../../../../components/filters";
import { Loading } from "../../../../components/Loading";
import { useFilteredProducts } from "../../../../hooks/filters";

const TypeProductsPageContent = () => {
  const { name } = useParams();
  const searchParams = useSearchParams();
  const typeId = searchParams.get("id");

  const decodedName = decodeURIComponent(name);
  const formattedName = transformCategoryPath(decodedName);

  const fixedFilters = useMemo(
    () => ({ typeIds: typeId ? [Number(typeId)] : [] }),
    [typeId]
  );

  // Obtener un producto representativo para los breadcrumbs
  const { products } = useFilteredProducts(fixedFilters, 1);
  const representativeProduct = products?.[0]?.variants?.[0] || undefined;

  const breadcrumbItems = useMemo(
    () => buildTypeBreadcrumbs(formattedName, representativeProduct),
    [formattedName, representativeProduct]
  );

  return (
    <>
      <BreadcrumbsNavigation items={breadcrumbItems} />
      <ProductsWithFilters
        title={toCapitalizeFirstLetter(formattedName)}
        fixedFilters={fixedFilters}
        pageSize={10}
      />
    </>
  );
};

const TypeProductsPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <TypeProductsPageContent />
    </Suspense>
  );
};

export default TypeProductsPage;
