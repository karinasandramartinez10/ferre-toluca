"use client";

import { Stack, Box } from "@mui/material";
import { useVariantSelection } from "../../../../../hooks/variantSelector/useVariantSelection";
import { ColorSelector } from "./ColorSelector";
import { MeasureSelector } from "./MeasureSelector";

export const VariantSelector = ({ variants = [], initialId }) => {
  const {
    selectedColor,
    selectedVariantId,
    colorOptions,
    measureOptions,
    measureLabel,
    handleColorChange,
    handleMeasureChange,
  } = useVariantSelection(variants, initialId);

  return (
    <Stack spacing={1} mt={2} mb={2}>
      <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
        <ColorSelector
          colorOptions={colorOptions}
          selectedColor={selectedColor}
          onColorChange={handleColorChange}
        />
        <MeasureSelector
          measureOptions={measureOptions}
          selectedVariantId={selectedVariantId}
          measureLabel={measureLabel}
          onMeasureChange={handleMeasureChange}
        />
      </Box>
    </Stack>
  );
};
