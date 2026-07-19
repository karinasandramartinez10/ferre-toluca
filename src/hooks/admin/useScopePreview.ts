"use client";

import { useQuery } from "@tanstack/react-query";
import { getScopePreview } from "../../api/promotions";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes, gcTimes } from "../../constants/queryConfig";
import type { ScopePreviewProduct } from "../../types/promotion";

// Precios vigentes por tier de un producto — contexto para el precio por volumen absoluto.
export default function useScopePreview(productId?: number | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.scopePreview(productId),
    queryFn: () => getScopePreview({ productId: productId as number }),
    enabled: !!productId,
    staleTime: staleTimes.FREQUENT,
    gcTime: gcTimes.SHORT,
  });

  const product: ScopePreviewProduct | null = data?.products?.[0] ?? null;
  return { product, loading: isLoading, error: isError };
}
