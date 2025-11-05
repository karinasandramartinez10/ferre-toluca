"use client";

import { useCallback, useEffect, useState } from "react";
import { getTaxRegimes } from "../../../api/taxRegimes";
import { getCfdiUses } from "../../../api/cfdiUses";

export function useFiscalCatalogs() {
  const [taxRegimes, setTaxRegimes] = useState([]);
  const [cfdiUses, setCfdiUses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async (signal) => {
    const [regimes, uses] = await Promise.all([
      getTaxRegimes({ signal }),
      getCfdiUses({ signal }),
    ]);
    return { regimes, uses };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { regimes, uses } = await fetchAll(undefined);
      setTaxRegimes(regimes);
      setCfdiUses(uses);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const { regimes, uses } = await fetchAll(controller.signal);
        setTaxRegimes(regimes);
        setCfdiUses(uses);
      } catch (e) {
        if (e.code !== "ERR_CANCELED") setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => controller.abort();
  }, [fetchAll]);

  return { taxRegimes, cfdiUses, loading, error, refetch: load };
}

export default useFiscalCatalogs;
