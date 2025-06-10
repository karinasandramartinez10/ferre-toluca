"use client";

import { Grid, Box, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useFavorites } from "../../../../hooks/favorites/useFavorites";
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

const ProductPage = ({ product, role }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const { addToOrder } = useOrderContext();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { enqueueSnackbar } = useSnackbar();

  const notify = (msg, variant) => enqueueSnackbar(msg, { variant });

  const handleAdd = () => {
    addToOrder(product, 1);
    notify("Producto añadido al carrito", "success");
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

  return (
    <Box width="100%">
      <Box sx={{ position: "relative", zIndex: 1, mb: 2 }}>
        <BreadcrumbsNavigation items={getBreadcrumbsItems(product)} />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <ProductImage path={product.Files[0]?.path} name={product.name} />
        </Grid>
        <Grid item xs={12} md={8}>
          <ProductOverview
            brand={product.brand?.name}
            name={product.name}
            code={product.code}
          />
          <Box display="flex" width="100%" gap={2}>
            <ProductAttributes
              subCategory={product.subCategory?.name}
              model={product.productModel?.name}
              type={product.type?.name}
            />
          </Box>
          <VariantSelector variants={product.variants} initialId={product.id} />
          <Stack gap={2}>
            <ProductActions
              onAdd={handleAdd}
              onToggleFav={handleToggleFav}
              isFav={isFavorite(product.id)}
              showFav={role === "user"}
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
        title="Acerca de este producto"
        description={product.description}
      />

      {product.specifications && (
        <ProductFeatures
          title="Características"
          description={product.specifications}
        />
      )}

      <MainSpecs
        color={product.color}
        measureValue={product.measureValue}
        measure={product.measure.abbreviation}
      />
    </Box>
  );
};

export default ProductPage;
