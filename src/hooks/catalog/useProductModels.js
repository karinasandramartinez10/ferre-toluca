"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductModels } from "../../api/productModels";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes, gcTimes } from "../../constants/queryConfig";

export function useProductModels(brandId) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.productModels(brandId),
    queryFn: () => getProductModels(brandId),
    enabled: !!brandId,
    staleTime: staleTimes.STATIC,
    gcTime: gcTimes.LONG,
  });

  return {
    productModels: data ?? [],
    loading: isLoading,
    error: error?.message || null,
  };
}
