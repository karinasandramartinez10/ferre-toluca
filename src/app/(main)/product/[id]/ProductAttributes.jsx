import { Stack, Typography, Chip } from "@mui/material";
import { toCapitalizeFirstLetter } from "../../../../utils/cases";

export const ProductAttributes = ({ subCategory, model, type }) => {
  const items = [
    { label: "Subcategoría", value: subCategory },
    { label: "Tipo", value: type },
    { label: "Modelo", value: model },
  ].filter((i) => i.value);

  if (items.length === 0) return null;

  const renderLabel = (label, value) => (
    <span>
      <Typography
        component="span"
        variant="caption1"
        color="text.secondary"
        sx={{ mr: 0.5 }}
      >
        {label}:
      </Typography>
      <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>
        {toCapitalizeFirstLetter(value)}
      </Typography>
    </span>
  );

  return (
    <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
      {items.map(({ label, value }) => (
        <Chip
          key={label}
          size="small"
          variant="outlined"
          label={renderLabel(label, value)}
          sx={{
            bgcolor: "grey.light",
            borderColor: "grey.light",
            padding: "0px 4px",
            height: "28px",
            '&:hover': {
              bgcolor: 'grey.hover',
              borderColor: 'grey.hover',
            },
            "& .MuiChip-label": {
              display: "inline-block",
              whiteSpace: "nowrap",
              maxWidth: 220,
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          }}
        />
      ))}
    </Stack>
  );
};
