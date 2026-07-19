import Link from "next/link";
import { Box, Card, CardActionArea, Stack, Tooltip, Typography } from "@mui/material";
import { SCOPE_KIND_LABELS } from "../constants/promotions";
import { toCapitalizeWords } from "../utils/cases";
import type { ActivePromotion } from "../types/promotion";

const SCOPE_ROUTE: Record<string, string> = {
  brand: "brands",
  category: "categories",
  subcategory: "subcategories",
  type: "types",
};

const slugify = (text: string) =>
  encodeURIComponent((text || "").toLowerCase().replace(/\s+/g, "-"));

// Los listados resuelven por ?id; el slug es cosmético.
const scopeHref = (promo: ActivePromotion) =>
  promo.scopeType === "product"
    ? `/product/${promo.scopeId}`
    : `/${SCOPE_ROUTE[promo.scopeType]}/${slugify(promo.scopeName)}?id=${promo.scopeId}`;

interface PromoDealCardProps {
  promo: ActivePromotion;
}

const PromoDealCard = ({ promo }: PromoDealCardProps) => {
  const isPercentage = promo.type === "percentage";
  return (
    <Card
      sx={{
        width: 240,
        minHeight: 150,
        flexShrink: 0,
        borderRadius: "12px",
        borderLeft: (theme) =>
          `4px solid ${
            isPercentage ? theme.palette.primary.main : (theme.palette as any).green.main
          }`,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": { transform: "translateY(-3px)", boxShadow: 4 },
      }}
    >
      <CardActionArea
        component={Link}
        href={scopeHref(promo)}
        sx={{
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {isPercentage ? (
          <Stack direction="row" alignItems="baseline" spacing={0.5}>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "2.75rem",
                lineHeight: 1.1,
                color: "primary.main",
              }}
            >
              {promo.discountPercentage}%
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                letterSpacing: 1,
                color: "primary.main",
              }}
            >
              Descuento
            </Typography>
          </Stack>
        ) : (
          <Tooltip title={promo.description || promo.label} arrow>
            <Typography
              sx={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "1rem",
                lineHeight: 1.25,
                color: "green.main",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {promo.description || promo.label}
            </Typography>
          </Tooltip>
        )}
        <Box sx={{ mt: "auto", pt: 1.5, maxWidth: "100%" }}>
          <Tooltip title={toCapitalizeWords(promo.scopeName)} arrow>
            <Typography variant="subtitle2" fontWeight={700} noWrap color="text.primary">
              {toCapitalizeWords(promo.scopeName)}
            </Typography>
          </Tooltip>
          <Typography variant="caption" color="text.secondary">
            {toCapitalizeWords(SCOPE_KIND_LABELS[promo.scopeType])}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default PromoDealCard;
