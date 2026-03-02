"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchQuoteById } from "../../api/quote";
import { queryKeys } from "../../constants/queryKeys";
import type { Quote } from "../../types/quote";

export function useQuote(quoteId: string) {
  return useQuery<Quote>({
    queryKey: queryKeys.quote(quoteId),
    queryFn: () => fetchQuoteById(quoteId),
    enabled: !!quoteId,
  });
}
