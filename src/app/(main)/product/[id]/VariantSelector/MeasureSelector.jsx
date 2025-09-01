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

export const MeasureSelector = ({
  measureOptions,
  selectedVariantId,
  measureLabel,
  onMeasureChange,
}) => {
  if (measureOptions.length > 1) {
    return (
      <Stack gap={1}>
        <Typography variant="body2" fontWeight={600}>
          También disponible en:
        </Typography>
        <FormControl size="small">
          <InputLabel id="variant-measure-label">{measureLabel}</InputLabel>
          <Select
            labelId="variant-measure-label"
            value={selectedVariantId}
            label={measureLabel}
            onChange={(e) => onMeasureChange(Number(e.target.value))}
            sx={{ minWidth: 120 }}
          >
            {measureOptions.map(({ id, label }) => (
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
    <Stack width="auto" flex="1">
      <Box>
        <Typography variant="body2" fontWeight={600}>
          Única medida
        </Typography>

        <Chip
          label={measureOptions[0]?.label}
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
