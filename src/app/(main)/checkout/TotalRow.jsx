import { Box, Typography } from "@mui/material";

const TotalRow = ({ totalItems, orderTotal }) => {
  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        bgcolor: "grey.50",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Total de piezas
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {totalItems}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: 1,
          borderTop: "1px solid #ddd",
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Total
        </Typography>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          color={orderTotal ? "primary.main" : "warning.main"}
        >
          {orderTotal || "Por confirmar"}
        </Typography>
      </Box>
    </Box>
  );
};

export default TotalRow;
