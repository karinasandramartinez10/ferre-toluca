"use client";

import { useCallback, useEffect, useState } from "react";

import {
  adaptFiscalDtoToDomain,
  adaptFiscalListDtoToDomain,
} from "../../../app/(user)/user/profile/fiscal/adapters";
import {
  getUserFiscals,
  getDefaultUserFiscal,
} from "../../../api/userFiscals";

export function useUserFiscals() {
  const [profiles, setProfiles] = useState([]);
  const [defaultProfile, setDefaultProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const [list, def] = await Promise.all([
        getUserFiscals({ signal }),
        getDefaultUserFiscal({ signal }),
      ]);
      if (signal?.aborted) return;
      setProfiles(adaptFiscalListDtoToDomain(list));
      setDefaultProfile(adaptFiscalDtoToDomain(def));
    } catch (e) {
      if (e?.code === "ERR_CANCELED") return;
      setError(e);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { profiles, defaultProfile, loading, error, refetch: load };
}

export default useUserFiscals;
