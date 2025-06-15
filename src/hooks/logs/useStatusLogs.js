import { useState, useCallback } from "react";
import {
  fetchStatusLogsForQuote,
  postStatusLogForQuote,
} from "../../api/admin/logs";

export function useStatusLogs() {
  const [logsMap, setLogsMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  // 1) Cargar logs de una cotización
  const fetchLogs = useCallback(async (quoteId) => {
    setLoadingMap((m) => ({ ...m, [quoteId]: true }));
    try {
      const resp = await fetchStatusLogsForQuote(quoteId);
      setLogsMap((m) => ({ ...m, [quoteId]: resp }));
    } catch {
      setLogsMap((m) => ({ ...m, [quoteId]: [] }));
    } finally {
      setLoadingMap((m) => ({ ...m, [quoteId]: false }));
    }
  }, []);

  const appendLog = useCallback(async (quoteId, entry) => {
    const newLog = await postStatusLogForQuote(quoteId, entry);
    setLogsMap((m) => {
      const prev = m[quoteId] || [];
      return { ...m, [quoteId]: [newLog, ...prev] };
    });
  }, []);

  return {
    logsMap,
    loadingMap,
    fetchLogs,
    appendLog,
  };
}
