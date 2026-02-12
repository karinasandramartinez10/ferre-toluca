import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getFilterOptions } from "../../api/products";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes } from "../../constants/queryConfig";

const emptyOptions = {
  brands: [],
  categories: [],
  subcategories: [],
  types: [],
  models: [],
  measures: [],
  designs: [],
};

/**
 * Hook para obtener las opciones de filtros disponibles.
 * Las opciones se actualizan dinámicamente según los filtros actuales.
 *
 * @param {Object} currentFilters - Filtros actuales aplicados.
 * @returns {Object} - Opciones de filtros, loading y error.
 */
export default function useFilterOptions(currentFilters = {}) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.filterOptions(currentFilters),
    queryFn: () => getFilterOptions(currentFilters),
    placeholderData: keepPreviousData,
    staleTime: staleTimes.FREQUENT,
  });

  return {
    options: data || emptyOptions,
    loading: isLoading,
    error: error?.message || null,
  };
}
