"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/category";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes, gcTimes } from "../../constants/queryConfig";

export function useCategories() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => getCategories({ size: 1000 }),
    staleTime: staleTimes.STATIC,
    gcTime: gcTimes.LONG,
  });

  return {
    categories: data?.categories ?? [],
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}
