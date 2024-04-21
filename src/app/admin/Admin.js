import { Grid, Typography } from "@mui/material";
import { Uploader } from "./Uploader";

export const Admin = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h1">Agregar producto</Typography>
      </Grid>
      <Grid item xs={12}>
        <Uploader />
      </Grid>
    </Grid>
  );
};
