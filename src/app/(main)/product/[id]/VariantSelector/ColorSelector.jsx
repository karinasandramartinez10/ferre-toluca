"use client";

import { Box, Stack, Typography } from "@mui/material";
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
      <Box display="flex" gap={1} flexWrap="wrap">
        {colorOptions.map((color) => {
          const bg = resolveColorHex(color);
          const isSel = color === selectedColor;

          const bgStyles = {
            backgroundColor: bg,
          };

          // Borde de 2px fijo, sólo cambia de color
          const borderColor = isSel ? "#000" : "rgba(0,0,0,0.1)";

          return (
            <MotionBox
              key={color}
              onClick={() => onColorChange(color)}
              title={color}
              component="span"
              tabIndex={0}
              sx={{
                ...bgStyles,
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: `2px solid ${borderColor}`,
                boxSizing: "border-box",
                cursor: "pointer",
                outline: "none",
                transition: "transform 0.2s ease, border-color 0.2s ease",
                "&:focus": {
                  boxShadow: `0 0 0 3px ${borderColor}`,
                },
              }}
              animate={{ scale: isSel ? 1.3 : 1 }}
              whileHover={{ scale: isSel ? 1.3 : 1.1 }}
              transition={{ type: "tween", duration: 0.15 }}
            />
          );
        })}
      </Box>
    </Stack>
  );
}
