"use client";

import { Stack, Box } from "@mui/material";
import { useVariantSelection } from "../../../../../hooks/variantSelector/useVariantSelection";
import { ColorSelector } from "./ColorSelector";
import { VariantOptionSelector } from "./MeasureSelector";

export const VariantSelector = ({ variants = [], initialId }) => {
  const {
    selectedColor,
    selectedVariantId,
    colorOptions,
    variantOptions,
    variantLabel,
    handleColorChange,
    handleVariantChange,
  } = useVariantSelection(variants, initialId);

  return (
    <Stack spacing={1} mt={2} mb={2}>
      <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
        <ColorSelector
          colorOptions={colorOptions}
          selectedColor={selectedColor}
          onColorChange={handleColorChange}
        />
        <VariantOptionSelector
          variantOptions={variantOptions}
          selectedVariantId={selectedVariantId}
          variantLabel={variantLabel}
          onVariantChange={handleVariantChange}
        />
      </Box>
    </Stack>
  );
};
