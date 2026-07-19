"use client";

import { useState } from "react";
import { getProductsByQuery } from "../../api/products";
import type { ScopeOption } from "../../types/promotion";

export default function useProductSearch() {
  const [options, setOptions] = useState<ScopeOption[]>([]);
  const [searching, setSearching] = useState(false);

  const search = async (query: string) => {
    if (query.length < 3) return;
    setSearching(true);
    try {
      const res = await getProductsByQuery(query);
      setOptions(
        (res.products ?? []).map((p) => ({
          id: p.id,
          label: p.name,
          code: p.code,
          image: p.Files?.[0]?.path ?? null,
        }))
      );
    } catch {
      setOptions([]);
    } finally {
      setSearching(false);
    }
  };

  return { options, searching, search };
}
