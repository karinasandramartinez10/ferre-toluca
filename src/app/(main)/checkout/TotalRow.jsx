import { Alert, Box, Typography } from "@mui/material";
import { PRICING_LABELS } from "../../../constants/pricing";

const TotalRow = ({ totalItems, orderTotal, pricingMode, wholesaleMinQty }) => {
  const isWholesale = pricingMode === "wholesale";
  const belowMin = isWholesale && wholesaleMinQty > 0 && totalItems < wholesaleMinQty;

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
          Modo de precio
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {PRICING_LABELS[pricingMode]}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Total de piezas
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {totalItems}
        </Typography>
      </Box>
      {isWholesale && wholesaleMinQty > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Mínimo mayoreo
          </Typography>
          <Typography
            variant="body2"
            fontWeight={600}
            color={belowMin ? "error.main" : "success.main"}
          >
            {wholesaleMinQty} piezas
          </Typography>
        </Box>
      )}
      {belowMin && (
        <Alert severity="warning" sx={{ py: 0.5 }}>
          Te faltan {wholesaleMinQty - totalItems} pieza
          {wholesaleMinQty - totalItems !== 1 ? "s" : ""} para alcanzar el mínimo de mayoreo.
        </Alert>
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
