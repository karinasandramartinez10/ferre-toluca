"use client";

import React from "react";
import { Box, Chip } from "@mui/material";
import { toCapitalizeWords } from "../utils/cases";

export default function ProductDesignChip({ designName, typeName, containerSx, chipSx }) {
  const parts = [typeName, designName].filter(Boolean).map(toCapitalizeWords);

  if (parts.length === 0) return <Box sx={{ padding: "0px 16px", ...containerSx }} />;

  return (
    <Box sx={{ padding: "0px 16px", ...containerSx }}>
      <Chip
        label={parts.join(" · ")}
        size="small"
        color="primary"
        variant="outlined"
        sx={{ fontSize: "0.75rem", height: "24px", ...chipSx }}
      />
    </Box>
  );
}
