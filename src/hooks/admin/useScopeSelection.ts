import { useCallback, useState } from "react";
import type { PromotionScopeType, ScopeSelection } from "../../types/promotion";

export default function useScopeSelection() {
  const [selection, setSelection] = useState<ScopeSelection[]>([]);

  const isSelected = useCallback(
    (kind: PromotionScopeType, id: number) => selection.some((s) => s.kind === kind && s.id === id),
    [selection]
  );

  const toggle = useCallback(
    (item: ScopeSelection) =>
      setSelection((prev) =>
        prev.some((s) => s.kind === item.kind && s.id === item.id)
          ? prev.filter((s) => !(s.kind === item.kind && s.id === item.id))
          : [...prev, item]
      ),
    []
  );

  const remove = useCallback(
    (kind: PromotionScopeType, id: number) =>
      setSelection((prev) => prev.filter((s) => !(s.kind === kind && s.id === id))),
    []
  );

  const clear = useCallback(() => setSelection([]), []);

  return { selection, isSelected, toggle, remove, clear };
}
