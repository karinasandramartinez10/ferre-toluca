import {
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
} from "@mui/material";

export const VariantOptionSelector = ({
  variantOptions,
  selectedVariantId,
  variantLabel,
  onVariantChange,
}) => {
  if (variantOptions.length > 1) {
    return (
      <Stack gap={1}>
        <Typography variant="body2" fontWeight={600}>
          También disponible en:
        </Typography>
        <FormControl size="small">
          <InputLabel id="variant-measure-label">{variantLabel}</InputLabel>
          <Select
            labelId="variant-measure-label"
            value={selectedVariantId}
            label={variantLabel}
            onChange={(e) => onVariantChange(Number(e.target.value))}
            sx={{ minWidth: 120 }}
          >
            {variantOptions.map(({ id, label }) => (
              <MenuItem key={id} value={id}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    );
  }

  return (
    <Stack width="auto">
      <Box>
        <Typography variant="body2" fontWeight={600}>
          Única variante
        </Typography>

        <Chip
          label={variantOptions[0]?.label}
          variant="outlined"
          sx={{
            mt: 1.4,
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: "16px",
            px: 2,
          }}
        />
      </Box>
    </Stack>
  );
};
