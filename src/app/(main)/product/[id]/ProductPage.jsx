"use client";

import { Grid, Box, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useFavorites } from "../../../../hooks/favorites/useFavorites";
import { usePricingMode } from "../../../../context/pricing/usePricingMode";
import ConfirmDeleteFavorite from "./ConfirmDeleteFavorite";
import BreadcrumbsNavigation from "../../../../components/BreadcrumbsNavigation";
import { useOrderContext } from "../../../../context/order/useOrderContext";
import { getBreadcrumbsItems } from "./BreadcrumbsItems";
import ProductImage from "./ProductImage";
import { ProductOverview } from "./ProductOverview";
import { ProductAttributes } from "./ProductAttributes";
import { MainSpecs } from "./MainSpecs";
import { ProductActions } from "./ProductActions";
import { ProductFeatures } from "./ProductFeatures";
import { VariantSelector } from "./VariantSelector/VariantSelector";
import ProductPrice from "../../../../components/ProductPrice";
import { Alert } from "@mui/material";

const ProductPage = ({ product }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { data: session } = useSession();

  const role = session?.user?.role;

  const { addToOrder } = useOrderContext();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { pricingMode } = usePricingMode();
  const { enqueueSnackbar } = useSnackbar();
  const isUnavailable = product?.isAvailable === false;

  const notify = (msg, variant) => enqueueSnackbar(msg, { variant });

  const handleAdd = (quantity = 1) => {
    addToOrder(product, quantity);
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
    <Box width="100%">
      <Box sx={{ position: "relative", zIndex: 1, mb: 2 }}>
        <BreadcrumbsNavigation items={breadcrumbItems} />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <ProductImage name={product.name} publicId={product.Files?.[0]?.publicId} />
        </Grid>
        <Grid item xs={12} md={8}>
          <ProductOverview brand={product.brand?.name} name={product.name} code={product.code} />
          {isUnavailable && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Este producto no está disponible actualmente
            </Alert>
          )}
          <Box sx={{ mb: 2 }}>
            <ProductPrice
              retailPrice={product.retailPrice}
              wholesalePrice={product.wholesalePrice}
              pricingMode={pricingMode}
            />
          </Box>
          <Box display="flex" width="100%" gap={2}>
            <ProductAttributes
              subCategory={product.subCategory?.name}
              model={product.productModel?.name}
              type={product.type?.name}
              design={product.design?.name}
            />
          </Box>
          <VariantSelector variants={product.variants} initialId={product.id} />
          <Stack gap={2} mt={2}>
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

      <ProductFeatures title="Acerca de este producto" description={product.description} />

      {product.specifications && (
        <ProductFeatures title="Características" description={product.specifications} />
      )}

      <MainSpecs
        color={product.color}
        measureValue={product.measureValue}
        measure={product.measure?.abbreviation}
        qualifier={product.qualifier}
        secondaryMeasureValue={product.secondaryMeasureValue}
        secondaryMeasure={product.secondaryMeasure?.abbreviation}
      />
    </Box>
  );
};

export default ProductPage;
