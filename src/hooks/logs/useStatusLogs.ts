import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchStatusLogsForQuote, postStatusLogForQuote } from "../../api/admin/logs";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes, gcTimes } from "../../constants/queryConfig";
import type {
  AppendLogVars,
  CreateLogEntryPayload,
  QuoteId,
  StatusLogEntry,
} from "../../types/quote";

export function useStatusLogs(quoteId?: QuoteId) {
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading: loading } = useQuery<StatusLogEntry[]>({
    queryKey: queryKeys.statusLogs(quoteId!),
    queryFn: () => fetchStatusLogsForQuote(quoteId!),
    enabled: !!quoteId,
    staleTime: staleTimes.DYNAMIC,
    gcTime: gcTimes.SHORT,
  });

  const { mutateAsync: appendLog } = useMutation<unknown, Error, AppendLogVars>({
    mutationFn: ({ quoteId: qId, entry }) => postStatusLogForQuote(qId, entry),
    onSettled: (_data, _error, variables) => {
      if (variables) {
        queryClient.invalidateQueries({ queryKey: queryKeys.statusLogs(variables.quoteId) });
      }
    },
  });

  const append = (qId: QuoteId, entry: CreateLogEntryPayload) => appendLog({ quoteId: qId, entry });

  return {
    logs,
    loading,
    appendLog: append,
  };
}
