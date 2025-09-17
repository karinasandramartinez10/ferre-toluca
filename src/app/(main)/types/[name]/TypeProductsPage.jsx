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

const TypeProductsPage = () => {
  const { name } = useParams();
  const searchParams = useSearchParams();
  const typeId = searchParams.get("id");
  const router = useRouter();

  const decodedName = decodeURIComponent(name);
  const formattedName = transformCategoryPath(decodedName);

  const { groupedResult, loading, error, currentPage, setCurrentPage } =
    useGroupedProducts({ typeId, pageSize: 10 });

  const representativeProduct =
    groupedResult?.products?.[0]?.variants?.[0] || undefined;
  const parentSubcategoryName = representativeProduct?.subCategory?.name;
  const parentSubcategoryId = representativeProduct?.subCategory?.id;

  const breadcrumbItems = [
    { label: "Inicio", path: "/" },
    ...(parentSubcategoryName
      ? [
          {
            label: toCapitalizeWords(parentSubcategoryName),
            path: `/subcategories/${toSlug(parentSubcategoryName)}?id=${parentSubcategoryId}`,
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

export default TypeProductsPage;


