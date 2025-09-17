"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  toCapitalizeFirstLetter,
  toCapitalizeWords,
  toSlug,
  transformCategoryPath,
} from "../../../../utils/cases";
import BreadcrumbsNavigation from "../../../../components/BreadcrumbsNavigation";
import useGroupedProducts from "../../../../hooks/grouped/useGroupedProducts";
import GroupedProductsList from "../../../../components/GroupedProductsList";

const SubcategoriesPage = () => {
  const { name } = useParams();
  const searchParams = useSearchParams();
  const subcategoryId = searchParams.get("id");
  const router = useRouter();

  const decodedName = decodeURIComponent(name);
  const formattedName = transformCategoryPath(decodedName);
  const { groupedResult, loading, error, currentPage, setCurrentPage } =
    useGroupedProducts({ subcategoryId, pageSize: 10 });

  const representativeProduct =
    groupedResult?.products?.[0]?.variants?.[0] || undefined;
  const parentCategoryName = representativeProduct?.category?.name;
  const parentCategoryId = representativeProduct?.category?.id;

  const breadcrumbItems = [
    { label: "Inicio", path: "/" },
    ...(parentCategoryName
      ? [
          {
            label: toCapitalizeWords(parentCategoryName),
            path: `/categories/${toSlug(parentCategoryName)}?id=${parentCategoryId}`,
          },
        ]
      : []),
    { label: toCapitalizeFirstLetter(formattedName) },
  ];

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

export default SubcategoriesPage;
