import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useVariantSelection(variants, initialId) {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState();
  const [selectedVariantId, setSelectedVariantId] = useState(initialId);

  useEffect(() => {
    const init = variants.find((v) => v.id === initialId);
    setSelectedColor(init?.color);
    setSelectedVariantId(initialId);
  }, [initialId, variants]);

  const colorOptions = Array.from(
    new Set(variants.map((v) => v.color).filter(Boolean))
  );

  const filtered = variants.filter((v) => v.color === selectedColor);
  const measureOptions = filtered.map((v) => ({
    id: v.id,
    label: `${v.measureValue} ${v.measure?.abbreviation || ""}`.trim(),
  }));

  const measureLabel = filtered[0]?.measure?.name || "Medida";

  const handleColorChange = (color) => {
    setSelectedColor(color);
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
