import { Box, Stack, Typography } from "@mui/material";
import { toCapitalizeFirstLetter } from "../../../../utils/cases";

export const ProductAttributes = ({ subCategory, model, type }) => (
  <Stack direction="row" spacing={2}>
    {subCategory && (
      <Box sx={{ bgcolor: "grey.100", borderRadius: 1 }}>
        <Typography variant="body2" color="textSecondary">
          Subcategoría
        </Typography>
        <Typography variant="body">
          {toCapitalizeFirstLetter(subCategory)}
        </Typography>
      </Box>
    )}
    {type && (
      <Box sx={{ bgcolor: "grey.100", borderRadius: 1 }}>
        <Typography variant="body2" color="textSecondary">
          Tipo
        </Typography>
        <Typography variant="body">{toCapitalizeFirstLetter(type)}</Typography>
      </Box>
    )}
    {model && (
      <Box sx={{ bgcolor: "grey.100", borderRadius: 1 }}>
        <Typography variant="body2" color="textSecondary">
          Modelo
        </Typography>
        <Typography variant="body">{toCapitalizeFirstLetter(model)}</Typography>
      </Box>
    )}
  </Stack>
);

export default ProductAttributes;
