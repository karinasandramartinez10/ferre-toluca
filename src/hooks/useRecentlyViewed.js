import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBatchProducts } from "../api/products";
import { queryKeys } from "../constants/queryKeys";
import { staleTimes, gcTimes } from "../constants/queryConfig";
import {
  getRecentlyViewed,
  pushRecentlyViewed,
  removeRecentlyViewed,
} from "../utils/recentlyViewed";

export default function useRecentlyViewed(currentProductId, isAvailable) {
  useEffect(() => {
    if (isAvailable === false) return;
    pushRecentlyViewed(currentProductId);
  }, [currentProductId, isAvailable]);

  const ids = useMemo(() => {
    return getRecentlyViewed().filter((id) => id !== currentProductId);
  }, [currentProductId]);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.batchProducts(ids),
    queryFn: () => getBatchProducts(ids),
    enabled: ids.length > 0,
    staleTime: staleTimes.FREQUENT,
    gcTime: gcTimes.SHORT,
  });

  useEffect(() => {
    const missing = data?.meta?.missingIds;
    if (missing?.length) removeRecentlyViewed(missing);
  }, [data]);

  return {
    products: data?.data || [],
    meta: data?.meta,
    isLoading: ids.length > 0 && isLoading,
  };
}
