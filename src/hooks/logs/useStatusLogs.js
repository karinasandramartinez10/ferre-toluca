import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchStatusLogsForQuote,
  postStatusLogForQuote,
} from "../../api/admin/logs";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes } from "../../constants/queryConfig";

/**
 * Hook para logs de status de una cotización.
 *
 * @param {string|number} [quoteId] - ID de la cotización. Si se pasa, auto-fetch logs.
 */
export function useStatusLogs(quoteId) {
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading: loading } = useQuery({
    queryKey: queryKeys.statusLogs(quoteId),
    queryFn: () => fetchStatusLogsForQuote(quoteId),
    enabled: !!quoteId,
    staleTime: staleTimes.DYNAMIC,
  });

  const { mutateAsync: appendLog } = useMutation({
    mutationFn: ({ quoteId: qId, entry }) => postStatusLogForQuote(qId, entry),
    onSettled: (_data, _error, { quoteId: qId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.statusLogs(qId) });
    },
  });

  // Wrapper para mantener la interfaz: appendLog(quoteId, entry)
  const append = (qId, entry) => appendLog({ quoteId: qId, entry });

  return {
    logs,
    loading,
    appendLog: append,
  };
}
