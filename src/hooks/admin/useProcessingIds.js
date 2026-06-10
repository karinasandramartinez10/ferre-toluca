import { useCallback, useState } from "react";

export default function useProcessingIds() {
  const [processingIds, setProcessingIds] = useState(new Set());

  const addProcessing = useCallback((id) => setProcessingIds((prev) => new Set(prev).add(id)), []);

  const removeProcessing = useCallback(
    (id) =>
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }),
    []
  );

  return { processingIds, addProcessing, removeProcessing };
}
