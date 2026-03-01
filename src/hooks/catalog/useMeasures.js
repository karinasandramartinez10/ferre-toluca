"use client";

import { useQuery } from "@tanstack/react-query";
import { getMeasures } from "../../api/measures";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes, gcTimes } from "../../constants/queryConfig";

export function useMeasures() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.measures,
    queryFn: getMeasures,
    staleTime: staleTimes.IMMUTABLE,
    gcTime: gcTimes.IMMUTABLE,
  });

  return {
    measures: data ?? [],
    loading: isLoading,
    error: error?.message || null,
  };
}
