"use client";

import { useQuery } from "@tanstack/react-query";
import {
  adaptFiscalDtoToDomain,
  adaptFiscalListDtoToDomain,
} from "../../../app/(user)/user/profile/fiscal/adapters";
import {
  getUserFiscals,
  getDefaultUserFiscal,
} from "../../../api/userFiscals";
import { queryKeys } from "../../../constants/queryKeys";
import { staleTimes } from "../../../constants/queryConfig";

export function useUserFiscals() {
  const { data, isLoading: loading, error } = useQuery({
    queryKey: queryKeys.userFiscals,
    queryFn: async () => {
      const [list, def] = await Promise.all([
        getUserFiscals(),
        getDefaultUserFiscal(),
      ]);
      return {
        profiles: adaptFiscalListDtoToDomain(list),
        defaultProfile: adaptFiscalDtoToDomain(def),
      };
    },
    staleTime: staleTimes.DYNAMIC,
  });

  return {
    profiles: data?.profiles ?? [],
    defaultProfile: data?.defaultProfile ?? null,
    loading,
    error: error?.message || null,
  };
}

export default useUserFiscals;
