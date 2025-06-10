"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  toCapitalizeFirstLetter,
  toSlug,
  transformCategoryPath,
} from "../../../../utils/cases";
import BreadcrumbsNavigation from "../../../../components/BreadcrumbsNavigation";
import useGroupedProducts from "../../../../hooks/grouped/useGroupedProducts";
import GroupedProductsList from "../../../../components/GroupedProductsList";

const CategoryProductsPage = () => {
  const { name } = useParams();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id");
  const router = useRouter();

  const decodedName = decodeURIComponent(name);
  const formattedName = transformCategoryPath(decodedName);

  const breadcrumbItems = [
    { label: "Inicio", path: "/" },
    {
      label: toCapitalizeFirstLetter(formattedName),
      path: `/categories/${toSlug(formattedName)}?id=${categoryId}`,
    },
  ];

  const { groupedResult, loading, error, currentPage, setCurrentPage } =
    useGroupedProducts({ categoryId, pageSize: 10 });

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

export default CategoryProductsPage;
