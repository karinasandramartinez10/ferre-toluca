import { Grid, Stack, Typography } from "@mui/material";

const InfoRow = ({ icon, label, value }) => (
  <Grid item xs={12} md={6}>
    <Stack direction="row" alignItems="center" gap={1}>
      {icon}
      <Typography variant="body1">
        <strong>{label}:</strong> {value}
      </Typography>
    </Stack>
  </Grid>
);

export default InfoRow;
