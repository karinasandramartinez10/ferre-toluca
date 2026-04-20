"use client";

import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { resolveColorHex, getContrastColor } from "../helpers";

const MotionBox = motion(Box);

export function ColorSelector({ colorOptions, selectedColor, onColorChange }) {
  // Único color
  if (colorOptions.length <= 1) {
    const only = colorOptions[0] || "";
    const bg = resolveColorHex(only);
    const fg = getContrastColor(bg);

    return (
      <Stack gap={0.5}>
        <Typography variant="body2" fontWeight={600}>
          Único color
        </Typography>
        <Box
          component="span"
          sx={{
            mt: 1,
            display: "inline-block",
            bgcolor: bg,
            color: fg,
            px: 2,
            py: 0.5,
            borderRadius: "16px",
            fontWeight: 600,
            fontSize: "1rem",
          }}
        >
          {only}
        </Box>
      </Stack>
    );
  }

  return (
    <Stack gap={1}>
      <Typography variant="body2" fontWeight={600}>
        Colores disponibles
      </Typography>
      <Box display="flex" gap={1} flexWrap="wrap" role="radiogroup" aria-label="Color del producto">
        {colorOptions.map((color) => {
          const bg = resolveColorHex(color);
          const isSel = color === selectedColor;

          const handleSelect = () => onColorChange(color);
          const handleKeyDown = (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleSelect();
            }
          };

          return (
            <Tooltip key={color} title={color} arrow placement="top">
              <MotionBox
                onClick={handleSelect}
                onKeyDown={handleKeyDown}
                role="radio"
                aria-checked={isSel}
                aria-label={color}
                component="span"
                tabIndex={0}
                sx={{
                  backgroundColor: bg,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "2px solid",
                  borderColor: isSel ? "primary.main" : "rgba(0,0,0,0.1)",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  outline: "none",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                  "&:focus-visible": {
                    boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}`,
                  },
                }}
                animate={{ scale: isSel ? 1.2 : 1 }}
                whileHover={{ scale: isSel ? 1.2 : 1.1 }}
                transition={{ type: "tween", duration: 0.15 }}
              />
            </Tooltip>
          );
        })}
      </Box>
    </Stack>
  );
}
