import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getFilteredProducts } from "../../api/products";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes } from "../../constants/queryConfig";

/**
 * Hook para obtener productos con filtros combinados.
 *
 * @param {Object} filters - Filtros a aplicar.
 * @param {number} pageSize - Tamaño de página.
 * @returns {Object} - Productos, paginación, loading y error.
 */
export default function useFilteredProducts(filters = {}, pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  // Key estable para detectar cambios de filtros
  const filtersKey = JSON.stringify({
    brandIds: filters.brandIds || [],
    categoryIds: filters.categoryIds || [],
    subcategoryIds: filters.subcategoryIds || [],
    typeIds: filters.typeIds || [],
    modelIds: filters.modelIds || [],
    measureIds: filters.measureIds || [],
    secondaryMeasureIds: filters.secondaryMeasureIds || [],
    designIds: filters.designIds || [],
    qualifiers: filters.qualifiers || [],
    q: filters.q || "",
  });

  // Reset a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filtersKey]);

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.filteredProducts(filtersKey, currentPage, pageSize),
    queryFn: () =>
      getFilteredProducts({
        ...filters,
        page: currentPage,
        size: pageSize,
      }),
    placeholderData: keepPreviousData,
    staleTime: staleTimes.FREQUENT,
  });

  return {
    products: data?.products || [],
    count: data?.count || 0,
    totalPages: data?.totalPages || 0,
    loading: isLoading,
    error: error?.message || null,
    currentPage,
    setCurrentPage,
  };
}
