"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  toCapitalizeFirstLetter,
  transformCategoryPath,
} from "../../../../utils/cases";
import BreadcrumbsNavigation from "../../../../components/BreadcrumbsNavigation";
import { buildTypeBreadcrumbs } from "../../../../helpers/breadcrumbs";
import useGroupedProducts from "../../../../hooks/grouped/useGroupedProducts";
import GroupedProductsList from "../../../../components/GroupedProductsList";

const TypeProductsPage = () => {
  const { name } = useParams();
  const searchParams = useSearchParams();
  const typeId = searchParams.get("id");
  const router = useRouter();

  const decodedName = decodeURIComponent(name);
  const formattedName = transformCategoryPath(decodedName);

  const { groupedResult, loading, error, currentPage, setCurrentPage } =
    useGroupedProducts({ typeId, pageSize: 10 });

  const representativeProduct = useMemo(
    () => groupedResult?.products?.[0]?.variants?.[0] || undefined,
    [groupedResult]
  );
  const breadcrumbItems = useMemo(
    () => buildTypeBreadcrumbs(formattedName, representativeProduct),
    [formattedName, representativeProduct]
  );

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
  };

  return (
    <>
      <BreadcrumbsNavigation items={breadcrumbItems} />
      <GroupedProductsList
        title={toCapitalizeFirstLetter(formattedName)}
        groupedResult={groupedResult}
        loading={loading}
        error={error}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onProductClick={handleProductClick}
      />
    </>
  );
};

export default TypeProductsPage;
