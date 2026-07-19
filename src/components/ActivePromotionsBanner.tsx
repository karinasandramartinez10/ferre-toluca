"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { getActivePromotions } from "../api/promotions";
import { queryKeys } from "../constants/queryKeys";
import { staleTimes, gcTimes } from "../constants/queryConfig";
import useHorizontalScroll from "../hooks/useHorizontalScroll";
import PromoDealCard from "./PromoDealCard";
import FullBleedSection from "./layout/FullBleedSection";

interface ActivePromotionsBannerProps {
  showViewAll?: boolean;
}

const arrowSx = (side: "left" | "right") => ({
  position: "absolute" as const,
  top: "50%",
  [side]: 4,
  transform: "translateY(-50%)",
  zIndex: 2,
  width: 36,
  height: 36,
  bgcolor: "background.paper",
  color: "primary.main",
  boxShadow: 2,
  "&:hover": { bgcolor: "background.paper", color: "primary.hover" },
});

const ActivePromotionsBanner = ({ showViewAll = true }: ActivePromotionsBannerProps) => {
  const { data: session } = useSession();
  // El BE filtra por tier del token → re-fetch al cambiar de sesión (login/logout).
  const { data: promotions = [] } = useQuery({
    queryKey: [...queryKeys.activePromotions, session?.user?.id ?? "guest"],
    queryFn: getActivePromotions,
    staleTime: staleTimes.FREQUENT,
    gcTime: gcTimes.SHORT,
  });
  const { ref, canScrollLeft, canScrollRight, scrollByDir } = useHorizontalScroll();

  if (!promotions.length) return null;

  return (
    <FullBleedSection outerSx={{ pt: 2 }}>
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
          <Box sx={{ position: "relative", flex: 1, minWidth: 0 }}>
            {canScrollLeft && (
              <IconButton
                aria-label="Anterior"
                size="small"
                onClick={() => scrollByDir(-1)}
                sx={arrowSx("left")}
              >
                <ArrowBackIosNew fontSize="small" />
              </IconButton>
            )}
            <Box
              ref={ref}
              sx={{
                display: "flex",
                gap: 1.5,
                overflowX: "auto",
                pb: 1,
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {promotions.map((promo) => (
                <PromoDealCard key={promo.id} promo={promo} />
              ))}
            </Box>
            {canScrollRight && (
              <IconButton
                aria-label="Siguiente"
                size="small"
                onClick={() => scrollByDir(1)}
                sx={arrowSx("right")}
              >
                <ArrowForwardIos fontSize="small" />
              </IconButton>
            )}
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
    </FullBleedSection>
  );
};

export default ActivePromotionsBanner;
