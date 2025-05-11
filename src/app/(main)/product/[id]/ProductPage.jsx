"use client";

import { Favorite, FavoriteBorder } from "@mui/icons-material";
import {
  Button,
  Grid,
  Typography,
  Box,
  IconButton,
  Stack,
  List,
  ListItem,
} from "@mui/material";
import Image from "next/image";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useOrder } from "../../../../hooks/order/useOrder";
import { useFavorites } from "../../../../hooks/favorites/useFavorites";
import ConfirmDeleteFavorite from "./ConfirmDeleteFavorite";
import BreadcrumbsNavigation from "../../../../components/BreadcrumbsNavigation";
import { toSlug } from "../../../../utils/cases";

const ProductPage = ({ product, role }) => {
  const [quantity] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);

  const { addToOrder } = useOrder();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { enqueueSnackbar } = useSnackbar();

  const showNotification = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  const handleAddToOrder = () => {
    addToOrder(product, quantity);
  };

  const breadcrumbItems = [
    { label: "Inicio", path: "/" },
    product.category && {
      label: product.category.name,
      path: `/categories/${toSlug(product.category.name)}?id=${
        product.category.id
      }`,
    },
    /*     product.subCategory && {
      label: product.subCategory.name,
      path: `/subcategories/${toSlug(product.subCategory.name)}?id=${
        product.subCategory.id
      }`,
    }, */
    product.brand && {
      label: product.brand.name,
      path: `/brands/${toSlug(product.brand.name)}?id=${product.brand.id}`,
    },
    /*     product.type && {
      label: product.type.name,
      path: `/types/${toSlug(product.type.name)}?id=${product.type.id}`,
    }, */
    { label: product.name }, // Último ítem sin `path`
  ].filter(Boolean);

  const handleToggleFavorite = async () => {
    if (isFavorite(product.id)) {
      setOpenDialog(true);
      return;
    }

    try {
      await toggleFavorite(product);
      showNotification("Producto añadido a favoritos", "success");
    } catch (error) {
      showNotification("Error al actualizar favoritos", "error");
    }
  };

  const handleConfirmRemoveFavorite = async () => {
    try {
      await toggleFavorite(product);
      showNotification("Producto eliminado de favoritos", "success");
    } catch (error) {
      showNotification("Error al actualizar favoritos", "error");
    } finally {
      setOpenDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const showUserBtns = role === "user";

  return (
    <Box width="100%">
      <Box sx={{ position: "relative", zIndex: 1, mb: 2 }}>
        <BreadcrumbsNavigation items={breadcrumbItems} />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4} lg={5}>
          <Box
            sx={{
              width: "100%",
              height: 250,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "12px",
              overflow: "hidden",
              maxWidth: { sm: "100%", md: 300 }, // Full en móviles, 300px en tablet/desktop
            }}
          >
            <Image
              src={product.Files[0]?.path || "/fallback-image.jpg"}
              alt={product.name}
              width={300}
              height={250}
              style={{
                objectFit: "contain",
                borderRadius: "12px",
                width: "100%", // Para que se adapte en móviles
                height: "100%",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={8} lg={7}>
          <Typography variant="body2" color="primary.main">
            {product?.brand?.name}
          </Typography>
          <Typography variant="h4">{product.name}</Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            SKU {product?.code}
          </Typography>

          <Box display="flex" width="100%" gap={2}>
            <Stack>
              <Typography variant="body2" fontWeight={600}>
                Subcategoría
              </Typography>
              {product.productModel?.name && (
                <Typography variant="body2" fontWeight={600}>
                  Modelo
                </Typography>
              )}
              {product?.type?.name && (
                <Typography variant="body2" fontWeight={600}>
                  Tipo
                </Typography>
              )}
            </Stack>
            <Stack>
              <Typography variant="body">
                {product?.subCategory?.name}
              </Typography>
              {product.productModel?.name && (
                <Typography variant="body">
                  {product.productModel?.name}
                </Typography>
              )}
              {product?.type?.name && (
                <Typography variant="body">{product?.type?.name}</Typography>
              )}
            </Stack>
          </Box>

          <Stack gap={2}>
            {(product.color || product.size) && (
              <Box
                sx={{
                  backgroundColor: "grey.light",
                  padding: 1,
                  borderRadius: 1,
                }}
                marginTop={1}
              >
                <Typography variant="body2" fontWeight={600}>
                  Especificaciones principales
                </Typography>
                <Stack>
                  <List>
                    {product.color && (
                      <ListItem
                        disableGutters
                        disablePadding
                        sx={{ fontSize: "14px", gap: 0.5 }}
                      >
                        <Typography variant="body3" fontWeight={600}>
                          Color:
                        </Typography>
                        <Typography variant="body3">
                          {product?.color}
                        </Typography>
                      </ListItem>
                    )}
                    {product.size && (
                      <ListItem
                        disableGutters
                        disablePadding
                        sx={{ fontSize: "14px", gap: 0.5 }}
                      >
                        <Typography variant="body3" fontWeight={600}>
                          Tamaño:
                        </Typography>
                        <Typography variant="body3">{product?.size}</Typography>
                      </ListItem>
                    )}
                  </List>
                </Stack>
              </Box>
            )}

            <Box display="flex" gap={1} alignItems="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToOrder}
              >
                Añadir a la orden
              </Button>
              {showUserBtns && (
                <IconButton
                  onClick={handleToggleFavorite}
                  color={isFavorite(product.id) ? "error" : "default"}
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "8px",
                    "&:hover": {
                      backgroundColor: "rgba(255, 0, 0, 0.1)",
                    },
                  }}
                >
                  {isFavorite(product.id) ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              )}
            </Box>
          </Stack>
        </Grid>
      </Grid>

      <ConfirmDeleteFavorite
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmRemoveFavorite}
      />

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Acerca de este producto
        </Typography>
        <Box sx={{ borderBottom: "2px solid #e53935", width: "80px", mb: 2 }} />
        <Typography variant="body1">{product.description}</Typography>
      </Box>

      {product.specifications && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Características
          </Typography>
          <Box
            sx={{ borderBottom: "2px solid #e53935", width: "80px", mb: 2 }}
          />
          <Typography variant="body1">{product.specifications}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductPage;
