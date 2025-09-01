import { Box, Typography } from "@mui/material";
import { toCapitalizeFirstLetter } from "../../../../utils/cases";

export const ProductFeatures = ({ description, title }) => (
  <Box mt={4}>
    <Typography variant="h5" gutterBottom>
      {title}
    </Typography>
    <Box sx={{ borderBottom: "2px solid #e53935", width: "80px", mb: 2 }} />
    <Typography variant="body1">
      {toCapitalizeFirstLetter(description)}
    </Typography>
  </Box>
);
