"use client";

import React from "react";
import { Box, Chip } from "@mui/material";
import { toCapitalizeWords } from "../utils/cases";

/**
 * ProductDesignChip
 * Renders a reserved space with an optional design chip.
 * Always keeps layout height consistent by reserving the container space.
 */
export default function ProductDesignChip({ designName, containerSx, chipSx }) {
  return (
    <Box sx={{ padding: "0px 16px", ...containerSx }}>
      {designName ? (
        <Chip
          label={toCapitalizeWords(designName)}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontSize: "0.75rem", height: "24px", ...chipSx }}
        />
      ) : null}
    </Box>
  );
}
