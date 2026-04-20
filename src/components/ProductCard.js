"use client";

import {
  Box,
  Button,
  Card,
  CardActions,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import { useOrderContext } from "../context/order/useOrderContext";
import { usePricingMode } from "../context/pricing/usePricingMode";
import { useFavorites } from "../hooks/favorites/useFavorites";
import { CloudinaryImage } from "./CloudinaryImage";
import { toCapitalizeWords } from "../utils/cases";
import ProductPrice from "./ProductPrice";

export const ProductCard = ({ product, showBtns = true }) => {
  const { data: session } = useSession();
  const { addToOrder } = useOrderContext();
  const { pricingMode } = usePricingMode();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { enqueueSnackbar } = useSnackbar();

  const isUnavailable = product?.isAvailable === false;
  const canFavorite = session?.user?.role === "user";
  const discount = pricingMode === "wholesale" ? (product?.discountPercentage ?? null) : null;
  const isFav = isFavorite(product.id);
  const imagePublicId = product?.Files?.[0]?.publicId;
  const productHref = `/product/${product.id}`;

  const handleAddToOrder = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToOrder(product, 1);
  };

  const handleToggleFav = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await toggleFavorite(product);
      enqueueSnackbar(isFav ? "Producto eliminado de favoritos" : "Producto añadido a favoritos", {
        variant: "success",
      });
    } catch {
      enqueueSnackbar("Error al actualizar favoritos", { variant: "error" });
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        padding: "8px",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
        "&:hover:not(:has([data-fav-button]:hover))": {
          transform: "translateY(-2px)",
          boxShadow: 3,
          borderColor: "primary.main",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          bgcolor: "grey.50",
          borderRadius: 1,
          overflow: "hidden",
          mb: 1,
        }}
      >
        <Box
          component={Link}
          href={productHref}
          sx={{
            position: "absolute",
            inset: 0,
            display: "block",
            filter: isUnavailable ? "grayscale(1)" : "none",
            opacity: isUnavailable ? 0.55 : 1,
          }}
          aria-label={product.name}
        >
          <CloudinaryImage
            publicId={imagePublicId}
            alt={product.name}
            fill
            crop="fit"
            quality="auto"
            sizes="(max-width: 600px) 75vw, (max-width: 960px) 45vw, 330px"
            style={{ objectFit: "contain" }}
          />
        </Box>

        {discount && !isUnavailable && (
          <Chip
            label={`-${discount}%`}
            size="small"
            color="primary"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              fontWeight: 700,
              borderRadius: 1,
            }}
          />
        )}

        {isUnavailable && (
          <Chip
            label="Agotado"
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              bgcolor: "error.main",
              color: "common.white",
              fontWeight: 700,
              borderRadius: 1,
            }}
          />
        )}

        {canFavorite && (
          <IconButton
            size="small"
            aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
            onClick={handleToggleFav}
            data-fav-button
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "background.paper",
              boxShadow: 1,
              transition: "box-shadow 0.15s ease",
              "&:hover": {
                bgcolor: "background.paper",
                boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
              },
            }}
          >
            {isFav ? (
              <Favorite fontSize="small" color="error" />
            ) : (
              <FavoriteBorder fontSize="small" />
            )}
          </IconButton>
        )}
      </Box>

      <Box
        component={Link}
        href={productHref}
        sx={{ display: "block", color: "inherit", textDecoration: "none", flexGrow: 1 }}
      >
        <Typography
          variant="caption"
          color="primary.main"
          sx={{
            display: "block",
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {toCapitalizeWords(product?.brand?.name)}
        </Typography>

        <Tooltip title={toCapitalizeWords(product?.name)}>
          <Typography
            variant="subtitle2"
            color="text.primary"
            sx={{
              fontWeight: 600,
              mt: 0.25,
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "2.6em",
            }}
          >
            {toCapitalizeWords(product?.name)}
          </Typography>
        </Tooltip>

        <ProductPrice
          retailPrice={product?.retailPrice}
          wholesalePrice={product?.wholesalePrice}
          pricingMode={pricingMode}
          size="small"
        />
      </Box>

      {showBtns && (
        <CardActions sx={{ mt: 1, px: 0 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddToOrder}
            disabled={isUnavailable}
          >
            {isUnavailable ? "No disponible" : "Añadir a la orden"}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
