"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toCapitalizeFirstLetter, toSlug } from "../../../../utils/cases";
import BreadcrumbsNavigation from "../../../../components/BreadcrumbsNavigation";
import useGroupedProducts from "../../../../hooks/grouped/useGroupedProducts";
import GroupedProductsList from "../../../../components/GroupedProductsList";

const BrandProductsPage = () => {
  const { name } = useParams();
  const searchParams = useSearchParams();
  const brandId = searchParams.get("id");
  const router = useRouter();

  const { groupedResult, loading, error, currentPage, setCurrentPage } =
    useGroupedProducts({ brandId, pageSize: 10 });

  const breadcrumbItems = [
    { label: "Inicio", path: "/" },
    {
      label: toCapitalizeFirstLetter(name),
      path: `/brands/${toSlug(name)}?id=${brandId}`,
    },
  ];

  return (
    <>
      <BreadcrumbsNavigation items={breadcrumbItems} />
      <GroupedProductsList
        title={`Productos ${toCapitalizeFirstLetter(name)}`}
        groupedResult={groupedResult}
        loading={loading}
        error={error}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onProductClick={(id) => router.push(`/product/${id}`)}
      />
    </>
  );
};

export default BrandProductsPage;
