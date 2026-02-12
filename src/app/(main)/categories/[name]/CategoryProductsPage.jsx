"use client";

import { Suspense, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  toCapitalizeFirstLetter,
  transformCategoryPath,
} from "../../../../utils/cases";
import BreadcrumbsNavigation from "../../../../components/BreadcrumbsNavigation";
import { buildCategoryBreadcrumbs } from "../../../../helpers/breadcrumbs";
import { ProductsWithFilters } from "../../../../components/filters";
import { Loading } from "../../../../components/Loading";

const CategoryProductsPageContent = () => {
  const { name } = useParams();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id");

  const decodedName = decodeURIComponent(name);
  const formattedName = transformCategoryPath(decodedName);

  const breadcrumbItems = useMemo(
    () => buildCategoryBreadcrumbs(formattedName, categoryId),
    [formattedName, categoryId]
  );

  const fixedFilters = useMemo(
    () => ({ categoryIds: categoryId ? [Number(categoryId)] : [] }),
    [categoryId]
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

const CategoryProductsPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CategoryProductsPageContent />
    </Suspense>
  );
};

export default CategoryProductsPage;
