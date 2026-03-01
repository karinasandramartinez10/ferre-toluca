"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductTypes } from "../../api/productTypes";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes, gcTimes } from "../../constants/queryConfig";

export function useProductTypesBySubcategory(subcategoryId) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.productTypesBySubcategory(subcategoryId),
    queryFn: () => getProductTypes({ subcategoryId }),
    enabled: !!subcategoryId,
    staleTime: staleTimes.STATIC,
    gcTime: gcTimes.LONG,
  });

  return {
    productTypes: data?.productTypes ?? data?.data?.productTypes ?? [],
    loading: isLoading,
    error: error?.message || null,
  };
}
