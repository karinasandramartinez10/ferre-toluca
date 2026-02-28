import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function formatMeasure(value, abbreviation) {
  if (!value) return "";
  return `${value} ${abbreviation || ""}`.trim();
}

function matchesPrimary(a, b) {
  return a.measureValue === b.measureValue && a.measure?.id === b.measure?.id;
}

function matchesSecondary(a, b) {
  return (
    a.secondaryMeasureValue === b.secondaryMeasureValue &&
    a.secondaryMeasure?.id === b.secondaryMeasure?.id
  );
}

/**
 * Builds labels for all variants in a single pass.
 *
 * 1. No primary measure → qualifier alone ("Chica", "Grande")
 * 2. All share the same primary, no secondary → qualifier alone
 * 3. All share the same primary, has secondary → "primary · secondary" (+ qualifier if needed)
 * 4. Different primaries → "primary" as base (+ secondary / qualifier to disambiguate)
 */
function buildVariantLabels(siblings, allSamePrimary) {
  return siblings.map((variant) => {
    const primary = formatMeasure(variant.measureValue, variant.measure?.abbreviation);

    if (!primary) return variant.qualifier || "";

    if (allSamePrimary) {
      if (variant.secondaryMeasureValue) {
        const secondary = formatMeasure(
          variant.secondaryMeasureValue,
          variant.secondaryMeasure?.abbreviation
        );
        let label = `${primary} · ${secondary}`;

        if (
          variant.qualifier &&
          siblings.some((s) => s !== variant && matchesSecondary(s, variant))
        ) {
          label += ` · ${variant.qualifier}`;
        }
        return label;
      }

      return variant.qualifier || primary;
    }

    let label = primary;

    if (variant.secondaryMeasureValue) {
      const secondary = formatMeasure(
        variant.secondaryMeasureValue,
        variant.secondaryMeasure?.abbreviation
      );
      label += ` · ${secondary}`;

      if (
        variant.qualifier &&
        siblings.some(
          (s) => s !== variant && matchesPrimary(s, variant) && matchesSecondary(s, variant)
        )
      ) {
        label += ` · ${variant.qualifier}`;
      }
    } else if (variant.qualifier) {
      label += ` · ${variant.qualifier}`;
    }

    return label;
  });
}

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

  const { variantOptions, variantLabel } = useMemo(() => {
    const allSamePrimary =
      filteredByColor.length <= 1 ||
      filteredByColor.every((s) => matchesPrimary(s, filteredByColor[0]));

    const labels = buildVariantLabels(filteredByColor, allSamePrimary);

    const options = filteredByColor.map((v, i) => ({
      id: v.id,
      label: labels[i],
    }));

    const hasPrimary = filteredByColor.some((v) => v.measureValue);
    const onlyQualifierDiffers =
      allSamePrimary && filteredByColor.some((v) => v.qualifier && !v.secondaryMeasureValue);

    const label = onlyQualifierDiffers
      ? "Variante"
      : hasPrimary
        ? selectedVariant?.measure?.name || filteredByColor[0]?.measure?.name || "Medida"
        : "Variante";

    return { variantOptions: options, variantLabel: label };
  }, [filteredByColor, selectedVariant]);

  const handleColorChange = (color) => {
    const withColor = variants.filter((v) => v.color === color);

    // Best: same primary + secondary measure
    const match =
      (selectedVariant &&
        (withColor.find(
          (v) => matchesPrimary(v, selectedVariant) && matchesSecondary(v, selectedVariant)
        ) ||
          // Fallback: same primary measure only
          withColor.find((v) => matchesPrimary(v, selectedVariant)))) ||
      // Last resort: first variant with that color
      withColor[0];

    if (match) router.push(`/product/${match.id}`);
  };

  const handleVariantChange = (newId) => {
    setSelectedVariantId(newId);
    router.push(`/product/${newId}`);
  };

  return {
    selectedColor,
    selectedVariantId,
    colorOptions,
    variantOptions,
    variantLabel,
    handleColorChange,
    handleVariantChange,
  };
}
