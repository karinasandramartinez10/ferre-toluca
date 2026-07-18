import { Box, Chip, Tooltip, Typography } from "@mui/material";
import { LocalOffer } from "@mui/icons-material";

interface PromoCountBadgeProps {
  promos?: string[];
}

// Señal de presencia de promo(s) activa(s) en un scope. El detalle va en el Tooltip.
const PromoCountBadge = ({ promos }: PromoCountBadgeProps) => {
  if (!promos?.length) return null;
  return (
    <Tooltip
      arrow
      title={
        <Box>
          <Typography variant="caption" fontWeight={700} display="block">
            {promos.length} promo{promos.length > 1 ? "s" : ""} activa{promos.length > 1 ? "s" : ""}
          </Typography>
          {promos.map((p, i) => (
            <Typography key={i} variant="caption" display="block">
              • {p}
            </Typography>
          ))}
        </Box>
      }
    >
      <Chip
        icon={<LocalOffer sx={{ fontSize: 14 }} />}
        label={promos.length}
        size="small"
        color="secondary"
        sx={{ flexShrink: 0, height: 20, fontWeight: 700 }}
      />
    </Tooltip>
  );
};

export default PromoCountBadge;
