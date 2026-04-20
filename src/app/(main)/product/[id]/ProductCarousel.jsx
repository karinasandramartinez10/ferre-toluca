"use client";

import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ProductCard } from "../../../../components/ProductCard";
import { trackRelatedClick } from "../../../../api/events";

const cardWrapperSx = {
  flex: "0 0 auto",
  width: { xs: "75%", sm: "45%", md: "30%", lg: "24%" },
  scrollSnapAlign: "start",
};

const scrollContainerSx = {
  display: "flex",
  gap: 2,
  overflowX: "auto",
  scrollSnapType: "x mandatory",
  pb: 1,
  scrollbarWidth: "thin",
  "&::-webkit-scrollbar": { height: 6 },
  "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "divider",
    borderRadius: 3,
  },
};

const CarouselSkeleton = ({ count = 4 }) =>
  Array.from({ length: count }).map((_, i) => (
    <Box key={i} sx={cardWrapperSx}>
      <Skeleton variant="rectangular" height={432} sx={{ borderRadius: 1.5 }} />
    </Box>
  ));

const ProductCarousel = ({ title, products, isLoading, sourceId, reason }) => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [products.length, isLoading]);

  if (!isLoading && (!products || products.length === 0)) return null;

  const handleClick = (event, targetId, position) => {
    if (event.target.closest("button")) return;
    trackRelatedClick({ sourceId, targetId, reason, position });
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild;
    const amount = firstCard ? firstCard.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <Box mt={4}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h5">{title}</Typography>
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            aria-label="Anterior"
            onClick={() => scroll(-1)}
            disabled={isLoading || !canScrollLeft}
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <ChevronLeft fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label="Siguiente"
            onClick={() => scroll(1)}
            disabled={isLoading || !canScrollRight}
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <ChevronRight fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
      <Box sx={{ borderBottom: "2px solid #e53935", width: "80px", mb: 2 }} />
      <Box ref={scrollRef} sx={scrollContainerSx}>
        {isLoading ? (
          <CarouselSkeleton count={4} />
        ) : (
          products.map((product, idx) => (
            <Box
              key={product.id}
              sx={cardWrapperSx}
              onClick={(event) => handleClick(event, product.id, idx)}
            >
              <ProductCard product={product} onViewMore={(id) => router.push(`/product/${id}`)} />
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default ProductCarousel;
