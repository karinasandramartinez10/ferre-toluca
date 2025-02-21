"use client";

import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Button, Grid, Typography, Box, IconButton } from "@mui/material";
import Image from "next/image";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useOrder } from "../../../../hooks/order/useOrder";
import { useFavorites } from "../../../../hooks/favorites/useFavorites";
import ConfirmDeleteFavorite from "./ConfirmDeleteFavorite";

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
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {product?.brand?.name} - {product?.code}
          </Typography>
          <Typography variant="h6">Descripción</Typography>
          <Typography paragraph>{product.description}</Typography>
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
        </Grid>
      </Grid>

      <ConfirmDeleteFavorite
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmRemoveFavorite}
      />

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Descripción
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
