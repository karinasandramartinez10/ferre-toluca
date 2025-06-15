import { Stack, Typography } from "@mui/material";

const InfoRow = ({ icon, label, value }) => (
  <Stack direction="row" alignItems="center" gap={1} mb={1}>
    {icon}
    <Typography variant="body1">
      <strong>{label}:</strong> {value}
    </Typography>
  </Stack>
);

export default InfoRow;
