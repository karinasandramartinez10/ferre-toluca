import { Box, CircularProgress, Typography } from "@mui/material";

const TotalRow = ({ totalItems, orderTotal, savings, loading }) => {
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
      {savings && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" color="green.main">
            Ahorro por promociones
          </Typography>
          <Typography variant="body2" fontWeight={700} color="green.main">
            −{savings}
          </Typography>
        </Box>
      )}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {loading && <CircularProgress size={14} thickness={5} />}
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color={orderTotal ? "primary.main" : "warning.main"}
            sx={{ opacity: loading ? 0.5 : 1, transition: "opacity 0.15s ease" }}
          >
            {orderTotal || "Por confirmar"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TotalRow;
