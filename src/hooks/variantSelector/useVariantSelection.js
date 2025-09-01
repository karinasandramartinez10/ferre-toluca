import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export function useVariantSelection(variants, initialId) {
  const router = useRouter();
  const [selectedVariantId, setSelectedVariantId] = useState(initialId);

  useEffect(() => {
    setSelectedVariantId(initialId);
  }, [initialId]);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) ?? variants[0],
    [variants, selectedVariantId]
  );

  const selectedColor = selectedVariant?.color;

  const colorOptions = useMemo(
    () => Array.from(new Set(variants.map((v) => v.color).filter(Boolean))),
    [variants]
  );

  const filteredByColor = useMemo(
    () => variants.filter((v) => v.color === selectedColor),
    [variants, selectedColor]
  );

  const measureOptions = useMemo(
    () =>
      filteredByColor.map((v) => ({
        id: v.id,
        label: `${v.measureValue} ${v.measure?.abbreviation || ""}`.trim(),
      })),
    [filteredByColor]
  );

  const measureLabel =
    selectedVariant?.measure?.name ||
    filteredByColor[0]?.measure?.name ||
    "Medida";

  const handleColorChange = (color) => {
    const first = variants.find((v) => v.color === color);
    if (first) router.push(`/product/${first.id}`);
  };

  const handleMeasureChange = (newId) => {
    setSelectedVariantId(newId);
    router.push(`/product/${newId}`);
  };

  return {
    selectedColor,
    selectedVariantId,
    colorOptions,
    measureOptions,
    measureLabel,
    handleColorChange,
    handleMeasureChange,
  };
}
