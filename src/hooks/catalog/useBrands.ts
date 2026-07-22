"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrands } from "../../api/brands";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes, gcTimes } from "../../constants/queryConfig";

export function useBrands() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.brands,
    queryFn: getBrands,
    staleTime: staleTimes.STATIC,
    gcTime: gcTimes.LONG,
  });

  return {
    brands: data ?? [],
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}
