"use client";

import { Suspense, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { toCapitalizeFirstLetter } from "../../../../utils/cases";
import BreadcrumbsNavigation from "../../../../components/BreadcrumbsNavigation";
import { buildBrandBreadcrumbs } from "../../../../helpers/breadcrumbs";
import { ProductsWithFilters } from "../../../../components/filters";
import { Loading } from "../../../../components/Loading";

const BrandProductsPageContent = () => {
  const { name } = useParams();
  const searchParams = useSearchParams();
  const brandId = searchParams.get("id");

  const breadcrumbItems = useMemo(
    () => buildBrandBreadcrumbs(name, brandId),
    [name, brandId]
  );

  const fixedFilters = useMemo(
    () => ({ brandIds: brandId ? [Number(brandId)] : [] }),
    [brandId]
  );

  return (
    <>
      <BreadcrumbsNavigation items={breadcrumbItems} />
      <ProductsWithFilters
        title={`Productos ${toCapitalizeFirstLetter(name)}`}
        fixedFilters={fixedFilters}
        pageSize={10}
      />
    </>
  );
};

const BrandProductsPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <BrandProductsPageContent />
    </Suspense>
  );
};

export default BrandProductsPage;
