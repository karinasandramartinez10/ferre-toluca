"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { Box, Button, Card, CardActionArea, Stack, Tooltip, Typography } from "@mui/material";
import { getActivePromotions } from "../api/promotions";
import { queryKeys } from "../constants/queryKeys";
import { staleTimes, gcTimes } from "../constants/queryConfig";
import { SCOPE_KIND_LABELS } from "../constants/promotions";
import { toCapitalizeWords } from "../utils/cases";

const SCOPE_ROUTE = {
  brand: "brands",
  category: "categories",
  subcategory: "subcategories",
  type: "types",
};

const slugify = (text) => encodeURIComponent((text || "").toLowerCase().replace(/\s+/g, "-"));

// Los listados resuelven por ?id; el slug es cosmético.
const scopeHref = (promo) =>
  promo.scopeType === "product"
    ? `/product/${promo.scopeId}`
    : `/${SCOPE_ROUTE[promo.scopeType]}/${slugify(promo.scopeName)}?id=${promo.scopeId}`;

const ActivePromotionsBanner = ({ showViewAll = true }) => {
  const { data: promotions = [] } = useQuery({
    queryKey: queryKeys.activePromotions,
    queryFn: getActivePromotions,
    staleTime: staleTimes.FREQUENT,
    gcTime: gcTimes.SHORT,
  });

  if (!promotions.length) return null;

  return (
    <Box
      sx={{
        width: "100vw",
        position: "relative",
        left: "calc(-50vw + 50%)",
        pt: 2,
      }}
    >
      <Box sx={{ maxWidth: "1440px", mx: "auto", px: { xs: 3, xl: 0 } }}>
        <Box
          sx={{
            bgcolor: "secondary.main",
            borderRadius: "12px",
            px: { xs: 2, md: 4 },
            py: 3,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.5}
            sx={{ mb: 2 }}
          >
            <Typography
              component="h2"
              variant="h1"
              sx={{
                color: "text.primary",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                fontFamily: "var(--font-montserrat)",
              }}
            >
              Promociones del mes
            </Typography>
            {showViewAll && (
              <Button
                component={Link}
                href="/ofertas"
                variant="contained"
                color="primary"
                sx={{ flexShrink: 0, fontWeight: 700 }}
              >
                Ver todas las ofertas
              </Button>
            )}
          </Stack>

          <Stack direction="row" spacing={2} alignItems="stretch">
            <Box sx={{ display: "flex", gap: 1.5, overflowX: "auto", pb: 1, flex: 1, minWidth: 0 }}>
              {promotions.map((promo) => {
                const isPercentage = promo.type === "percentage";
                return (
                  <Card
                    key={promo.id}
                    sx={{
                      width: 240,
                      minHeight: 150,
                      flexShrink: 0,
                      borderRadius: "12px",
                      borderLeft: (theme) =>
                        `4px solid ${
                          isPercentage ? theme.palette.primary.main : theme.palette.green.main
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
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            noWrap
                            color="text.primary"
                          >
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
              })}
            </Box>
            {/* PNG transparente (recortado) → flota sobre el dorado. next/image lo optimiza
                y lo sirve en WebP aunque el original pese de más. */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                flexShrink: 0,
                position: "relative",
                width: 260,
                height: 180,
              }}
            >
              <Image
                src="/images/promo-banner.png"
                alt="Productos en promoción"
                fill
                sizes="260px"
                style={{ objectFit: "contain" }}
              />
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default ActivePromotionsBanner;
