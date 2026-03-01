"use client";

import { useQuery } from "@tanstack/react-query";
import { getTaxRegimes } from "../../../api/taxRegimes";
import { getCfdiUses } from "../../../api/cfdiUses";
import { queryKeys } from "../../../constants/queryKeys";
import { staleTimes, gcTimes } from "../../../constants/queryConfig";

export function useFiscalCatalogs() {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: queryKeys.fiscalCatalogs,
    queryFn: async () => {
      const [regimes, uses] = await Promise.all([getTaxRegimes(), getCfdiUses()]);
      return { taxRegimes: regimes, cfdiUses: uses };
    },
    staleTime: staleTimes.IMMUTABLE,
    gcTime: gcTimes.IMMUTABLE,
  });

  return {
    taxRegimes: data?.taxRegimes ?? [],
    cfdiUses: data?.cfdiUses ?? [],
    loading,
    error: error?.message || null,
  };
}

export default useFiscalCatalogs;
