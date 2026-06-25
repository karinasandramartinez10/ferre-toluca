import { Chip, Stack, Tooltip } from "@mui/material";

const PromoBadges = ({ badges }) => {
  if (!badges?.length) return null;

  return (
    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
      {badges.map((badge) => (
        <Tooltip
          key={badge.promotionId}
          title={`${badge.description || badge.name} · el descuento se aplica al cotizar`}
          arrow
        >
          <Chip label={badge.label} size="small" color="secondary" sx={{ fontWeight: 700 }} />
        </Tooltip>
      ))}
    </Stack>
  );
};

export default PromoBadges;
