"use client";

import type { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { updateQuote } from "../../api/quote";
import { queryKeys } from "../../constants/queryKeys";
import type { Quote, UpdateQuoteStatusVars } from "../../types/quote";

export function useUpdateQuoteStatus(quoteId: string) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<AxiosResponse, AxiosError, UpdateQuoteStatusVars>({
    mutationFn: ({ status, updatedAt }) => updateQuote(quoteId, { status, updatedAt }),

    onSuccess: (resp, variables) => {
      queryClient.setQueryData<Quote>(queryKeys.quote(quoteId), (old) =>
        old
          ? {
              ...old,
              status: variables.status as Quote["status"],
              updatedAt: resp.data?.data?.updatedAt ?? old.updatedAt,
            }
          : old
      );
      enqueueSnackbar("Estado actualizado", { variant: "success" });
    },

    onError: async (err) => {
      if (err?.response?.status === 409) {
        enqueueSnackbar("La cotización fue modificada por otro usuario. Recargando datos...", {
          variant: "warning",
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.quote(quoteId),
        });
      } else {
        enqueueSnackbar("Error al actualizar estado", { variant: "error" });
      }
    },
  });
}
