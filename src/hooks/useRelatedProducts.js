import { useQuery } from "@tanstack/react-query";
import { getRelatedProducts } from "../api/products";
import { queryKeys } from "../constants/queryKeys";
import { staleTimes, gcTimes } from "../constants/queryConfig";

export default function useRelatedProducts(productId, limit = 8) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.relatedProducts(productId, limit),
    queryFn: () => getRelatedProducts(productId, limit),
    enabled: !!productId,
    staleTime: staleTimes.STATIC,
    gcTime: gcTimes.LONG,
  });

  return {
    products: data?.data || [],
    reason: data?.reason,
    meta: data?.meta,
    isLoading,
  };
}
