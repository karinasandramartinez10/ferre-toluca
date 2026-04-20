import { Box, Typography } from "@mui/material";
import { toCapitalizeFirstLetter } from "../../../../utils/cases";

export const ProductFeatures = ({ description, specifications, title }) => {
  if (!description && !specifications) return null;

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ borderBottom: "2px solid #e53935", width: "80px", mb: 2 }} />
      {description && (
        <Typography variant="body1" sx={{ mb: specifications ? 2 : 0 }}>
          {toCapitalizeFirstLetter(description)}
        </Typography>
      )}
      {specifications && (
        <Typography variant="body1">{toCapitalizeFirstLetter(specifications)}</Typography>
      )}
    </Box>
  );
};
