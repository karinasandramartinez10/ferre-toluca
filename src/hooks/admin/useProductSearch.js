"use client";

import { useState } from "react";
import { getProductsByQuery } from "../../api/products";

export default function useProductSearch() {
  const [options, setOptions] = useState([]);
  const [searching, setSearching] = useState(false);

  const search = async (query) => {
    if (query.length < 3) return;
    setSearching(true);
    try {
      const res = await getProductsByQuery(query);
      setOptions((res.products ?? []).map((p) => ({ id: p.id, label: p.name })));
    } catch {
      setOptions([]);
    } finally {
      setSearching(false);
    }
  };

  return { options, searching, search };
}
