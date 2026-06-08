"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getProductById } from "../api/products";
import { queryKeys } from "../constants/queryKeys";
import { staleTimes, gcTimes } from "../constants/queryConfig";

/**
 * El detalle se renderiza server-side con cache (tier A). Para un usuario
 * logueado re-consultamos con su token para mostrar el precio de su tier,
 * sin perder el SSR/ISR del primer paint.
 */
export function useProductPrice(productId, initial) {
  const { data: session } = useSession();
  const enabled = !!session?.user;

  const { data } = useQuery({
    queryKey: queryKeys.productPrice(productId),
    queryFn: () => getProductById(productId),
    enabled,
    staleTime: staleTimes.FREQUENT,
    gcTime: gcTimes.SHORT,
  });

  const source = enabled && data?.price != null ? data : initial;

  return {
    price: source?.price,
    priceList: source?.priceList,
    discountPercentage: source?.discountPercentage,
    appliedTier: source?.appliedTier,
  };
}
