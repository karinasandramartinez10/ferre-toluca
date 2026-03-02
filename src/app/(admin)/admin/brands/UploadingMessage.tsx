import { Box, CircularProgress, Typography } from "@mui/material";

const UploadingMessage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={1}
      sx={{ py: 2 }}
    >
      <CircularProgress />
      <Typography variant="body1" color="textSecondary">
        Subiendo, por favor espere
      </Typography>
    </Box>
  );
};

export default UploadingMessage;
