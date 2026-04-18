import { Alert, Box, Typography } from "@mui/material";

const TotalRow = ({
  totalItems,
  orderTotal,
  isWholesale,
  anyLineQualifies,
  allLinesQualify,
  retailCount,
}) => {
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
      {isWholesale && allLinesQualify && (
        <Alert severity="success" sx={{ py: 0.5 }}>
          <Typography variant="caption">Precio mayoreo aplicado en todos los productos.</Typography>
        </Alert>
      )}
      {isWholesale && anyLineQualifies && !allLinesQualify && (
        <Alert severity="warning" sx={{ py: 0.5 }}>
          <Typography variant="caption">
            Mayoreo aplicado en algunos productos. {retailCount} producto
            {retailCount !== 1 ? "s" : ""} se
            {retailCount !== 1 ? " cobrarán" : " cobrará"} a precio de menudeo.
          </Typography>
        </Alert>
      )}
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
