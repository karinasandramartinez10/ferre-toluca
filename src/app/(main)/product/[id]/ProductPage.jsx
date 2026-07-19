"use client";

import { Grid, Box, Stack, Alert, Chip, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useFavorites } from "../../../../hooks/favorites/useFavorites";
import { useProductPrice } from "../../../../hooks/useProductPrice";
import ConfirmDeleteFavorite from "./ConfirmDeleteFavorite";
import BreadcrumbsNavigation from "../../../../components/BreadcrumbsNavigation";
import { useOrderContext } from "../../../../context/order/useOrderContext";
import { getBreadcrumbsItems } from "./BreadcrumbsItems";
import ProductGallery from "./ProductGallery";
import { ProductOverview } from "./ProductOverview";
import { ProductAttributes } from "./ProductAttributes";
import { MainSpecs } from "./MainSpecs";
import { ProductActions } from "./ProductActions";
import { ProductFeatures } from "./ProductFeatures";
import { VariantSelector } from "./VariantSelector/VariantSelector";
import ProductPrice from "../../../../components/ProductPrice";
import PromoBadges from "../../../../components/PromoBadges";
import ProductStickyBar from "./ProductStickyBar";
import RelatedProducts from "./RelatedProducts";
import RecentlyViewed from "./RecentlyViewed";

const ProductPage = ({ product }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { data: session } = useSession();

  const role = session?.user?.role;

  const { addToOrder } = useOrderContext();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { price, priceList, discountPercentage, finalPrice, promotion, badges } = useProductPrice(
    product.id,
    product
  );
  const { enqueueSnackbar } = useSnackbar();
  const isUnavailable = product?.isAvailable === false;

  const notify = (msg, variant) => enqueueSnackbar(msg, { variant });

  const handleAdd = (quantity = 1) => {
    // El `product` viene del SSR (ISR-cacheado); usamos los campos vivos de useProductPrice
    // para que el carrito refleje el precio/promo actuales del tier del usuario.
    addToOrder(
      { ...product, price, priceList, discountPercentage, finalPrice, promotion, badges },
      quantity
    );
    notify(
      `${quantity > 1 ? quantity + " productos añadidos" : "Producto añadido"} al carrito`,
      "success"
    );
  };

  const handleToggleFav = async () => {
    if (isFavorite(product.id)) {
      setOpenDialog(true);
      return;
    }
    try {
      await toggleFavorite(product);
      notify("Producto añadido a favoritos", "success");
    } catch {
      notify("Error al actualizar favoritos", "error");
    }
  };

  const handleConfirm = async () => {
    try {
      await toggleFavorite(product);
      notify("Producto eliminado de favoritos", "success");
    } catch {
      notify("Error al actualizar favoritos", "error");
    } finally {
      setOpenDialog(false);
    }
  };

  const breadcrumbItems = useMemo(() => getBreadcrumbsItems(product), [product]);

  return (
    <Box width="100%" sx={{ pb: { xs: 12, md: 0 } }}>
      <Box sx={{ position: "relative", zIndex: 1, mb: 2 }}>
        <BreadcrumbsNavigation items={breadcrumbItems} />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <ProductGallery name={product.name} files={product.Files} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            <ProductOverview brand={product.brand?.name} name={product.name} />

            {isUnavailable && (
              <Alert severity="warning">Este producto no está disponible actualmente</Alert>
            )}

            {product.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {product.description}
              </Typography>
            )}

            <ProductPrice
              price={price}
              priceList={priceList}
              discountPercentage={discountPercentage}
              finalPrice={finalPrice}
              promotion={promotion}
              size="large"
              showDiscountPercentage
            />
            <PromoBadges badges={badges} />

            <ProductAttributes
              subCategory={product.subCategory?.name}
              model={product.productModel?.name}
              type={product.type?.name}
              design={product.design?.name}
            />

            <VariantSelector variants={product.variants} initialId={product.id} />

            {!isUnavailable && (
              <Chip
                icon={<CheckCircle fontSize="small" />}
                label="En stock"
                size="small"
                color="success"
                variant="outlined"
                sx={{ alignSelf: "flex-start", fontWeight: 600 }}
              />
            )}

            <ProductActions
              onAdd={handleAdd}
              onToggleFav={handleToggleFav}
              isFav={isFavorite(product.id)}
              showFav={role === "user"}
              disabled={isUnavailable}
            />
          </Stack>
        </Grid>
      </Grid>

      <ConfirmDeleteFavorite
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirm}
      />

      <ProductFeatures
        title="Descripción"
        description={product.description}
        specifications={product.specifications}
      />

      <MainSpecs
        code={product.code}
        color={product.color}
        measureValue={product.measureValue}
        measure={product.measure?.abbreviation}
        qualifier={product.qualifier}
        secondaryMeasureValue={product.secondaryMeasureValue}
        secondaryMeasure={product.secondaryMeasure?.abbreviation}
      />

      <RelatedProducts productId={product.id} />
      <RecentlyViewed productId={product.id} isAvailable={product.isAvailable} />

      <ProductStickyBar
        price={price}
        priceList={priceList}
        discountPercentage={discountPercentage}
        finalPrice={finalPrice}
        promotion={promotion}
        onAdd={handleAdd}
        disabled={isUnavailable}
      />
    </Box>
  );
};

export default ProductPage;
