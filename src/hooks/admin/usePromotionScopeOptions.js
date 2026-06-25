"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMenuTree } from "../../api/products";
import { getBrands } from "../../api/brands";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes, gcTimes } from "../../constants/queryConfig";

const EMPTY = [];

export default function usePromotionScopeOptions() {
  const { data: tree = EMPTY } = useQuery({
    queryKey: queryKeys.menuTree,
    queryFn: getMenuTree,
    staleTime: staleTimes.STATIC,
    gcTime: gcTimes.LONG,
  });

  const { data: brands = EMPTY } = useQuery({
    queryKey: queryKeys.brands,
    queryFn: getBrands,
    staleTime: staleTimes.STATIC,
    gcTime: gcTimes.LONG,
  });

  const options = useMemo(
    () => ({
      brand: brands.map((b) => ({ id: b.id, label: b.name })),
      category: tree.map((c) => ({ id: c.id, label: c.name })),
      subcategory: tree.flatMap((c) =>
        (c.subcategories ?? []).map((s) => ({ id: s.id, label: `${c.name} › ${s.name}` }))
      ),
      type: tree.flatMap((c) =>
        (c.subcategories ?? []).flatMap((s) =>
          (s.types ?? []).map((t) => ({ id: t.id, label: `${s.name} › ${t.name}` }))
        )
      ),
    }),
    [tree, brands]
  );

  const getScopeLabel = useCallback(
    (kind, id) => options[kind]?.find((o) => o.id === id)?.label ?? `#${id}`,
    [options]
  );

  return { options, getScopeLabel };
}
