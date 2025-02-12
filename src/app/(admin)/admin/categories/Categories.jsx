"use client";

import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../../../api/category";
import ActionModal from "../../../../components/ActionModal";
import DeleteConfirmationDialog from "../../../../components/DeleteConfirmationDialog";
import CategoriesTable from "./CategoriesTable";

const Categories = () => {
  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mode, setMode] = useState("create");

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categoriesData = await getCategories();
        setRows(categoriesData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleAddCategory = async (data) => {
    try {
      setLoading(true);

      const body = {
        name: data.name,
      };

      const response = await createCategory(body);
      if (response.status === 201) {
        const { category } = response.data;
        const newCategory = {
          ...category,
          id: category.id,
        };

        setRows((prevRows) => [...prevRows, newCategory]);
        enqueueSnackbar("Categoría agregada exitósamente", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
        setLoading(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error creating category:", error);
    }
  };

  const handleEditCategory = async (data) => {
    try {
      setLoading(true);

      const body = {
        name: data.name,
      };

      const response = await updateCategory(selectedCategory.id, body);

      if (response.status === 200) {
        const { category } = response.data;
        const updatedCategory = {
          ...category,
          id: category.id,
        };

        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedCategory.id
              ? { ...row, ...updatedCategory }
              : row
          )
        );
        enqueueSnackbar("Categoría actualizada exitósamente", {
          variant: "success",
        });
        setLoading(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error actualizando la categoría", error.message);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      setLoading(true);
      await deleteCategory(selectedCategory.id);
      setRows((prevRows) =>
        prevRows.filter((row) => row.id !== selectedCategory.id)
      );
      enqueueSnackbar("Categoría eliminada exitósamente", {
        variant: "success",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      setLoading(false);
      setIsDialogOpen(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Hubo un error al eliminar la categoría", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setMode("edit");
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedCategory(null);
    setMode("create");
    setIsModalOpen(true);
  };

  const openDeleteDialog = (category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  return (
    <Grid container width="100%" gap={2} flexDirection="row">
      <Grid item xs={12}>
        <Stack>
          <Typography variant="h1">Categorías</Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{ color: "#838383", fontWeight: 500 }}
              variant="body"
            >
              Agrega, edita o elimina categorías
            </Typography>
            <Button onClick={openAddModal}>Agregar</Button>
          </Box>
        </Stack>
      </Grid>
      <CategoriesTable
        rows={rows}
        onEditClick={openEditModal}
        onDeleteClick={openDeleteDialog}
      />
      <ActionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={mode === "create" ? handleAddCategory : handleEditCategory}
        mode={mode}
        selected={selectedCategory}
        loading={loading}
      />
      <DeleteConfirmationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDeleteCategory}
        loading={loading}
        title="Eliminar Categoría"
        description={`¿Estás seguro de que quieres eliminar la categoría "${selectedCategory?.name}"? Esta acción no se puede deshacer.`}
      />
    </Grid>
  );
};

export default Categories;
