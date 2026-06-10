"use client";

import { Chip, Tooltip } from "@mui/material";
import { LocalOfferOutlined } from "@mui/icons-material";

const PricesLegendChip = ({ compact = false }) => (
  <Tooltip title="Ya iniciaste sesión: estos son tus precios" arrow>
    <Chip
      icon={<LocalOfferOutlined sx={{ fontSize: 16 }} />}
      label={compact ? "Tus precios" : "Estos son tus precios"}
      size="small"
      sx={{
        color: "grey.light",
        bgcolor: "rgba(255, 255, 255, 0.16)",
        fontWeight: 600,
        "& .MuiChip-icon": { color: "grey.light" },
      }}
    />
  </Tooltip>
);

export default PricesLegendChip;
