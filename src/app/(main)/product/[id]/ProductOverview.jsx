import { Typography } from "@mui/material";
import { toCapitalizeWords } from "../../../../utils/cases";

export const ProductOverview = ({ brand, name }) => (
  <>
    <Typography variant="body2" color="primary.main">
      {toCapitalizeWords(brand)}
    </Typography>
    <Typography variant="h4">{name}</Typography>
  </>
);
