"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubcategories } from "../../api/subcategories";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes, gcTimes } from "../../constants/queryConfig";

export function useSubcategories(categoryId?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.subcategoriesByCategory(categoryId),
    queryFn: () => getSubcategories({ categoryId }),
    enabled: !!categoryId,
    staleTime: staleTimes.STATIC,
    gcTime: gcTimes.LONG,
  });

  return {
    subcategories: data?.subcategories ?? [],
    loading: isLoading,
    error: error?.message || null,
  };
}
