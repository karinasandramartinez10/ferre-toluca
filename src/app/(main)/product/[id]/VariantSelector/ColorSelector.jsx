import {
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { getContrastColor, resolveColorHex } from "../helpers";

export const ColorSelector = ({
  colorOptions,
  selectedColor,
  onColorChange,
}) => {
  if (colorOptions.length > 1) {
    return (
      <Stack gap={1} justifyContent="center">
        <Typography variant="body2" fontWeight={600}>
          También disponible en:
        </Typography>
        <FormControl size="small">
          <InputLabel id="variant-color-label">Color</InputLabel>
          <Select
            labelId="variant-color-label"
            value={selectedColor || ""}
            label="Color"
            onChange={(e) => onColorChange(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            {colorOptions.map((color) => (
              <MenuItem key={color} value={color}>
                {color}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    );
  }

  const label = colorOptions[0];
  const bg = resolveColorHex(label);
  const fg = getContrastColor(bg);

  return (
    <Stack gap={1.5}>
      <Typography variant="body2" fontWeight={600}>
        Único color
      </Typography>
      <Chip
        label={label}
        sx={{
          bgcolor: bg,
          color: fg,
          fontWeight: 600,
          borderRadius: "16px",
          px: 2,
          fontSize: "14px",
          "& .MuiChip-label": { textShadow: "1px 1px 2px rgba(0,0,0,0.2)" },
        }}
      />
    </Stack>
  );
};
