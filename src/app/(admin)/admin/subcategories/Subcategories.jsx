"use client";

import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { getCategories } from "../../../../api/category";
import {
  createSubcategory,
  getSubcategories,
  updateSubcategory,
} from "../../../../api/subcategories";
import ActionModal from "../../../../components/ActionModal";
import SubcategoriesTable from "../../../../components/CrudAdminTable";

const Subcategories = () => {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [mode, setMode] = useState("create");

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const subcategoriesData = await getSubcategories();
        setRows(subcategoriesData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleAddSubcategory = async (data) => {
    try {
      setLoading(true);

      const body = {
        name: data.name,
        categoryId: data.categoryId,
      };

      const response = await createSubcategory(body);
      if (response.status === 201) {
        const { subcategory } = response.data;
        const newSubcategory = {
          ...subcategory,
          id: subcategory.id,
        };

        setRows((prevRows) => [...prevRows, newSubcategory]);
        enqueueSnackbar("Subcategoría agregada exitósamente", {
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

  const handleEditSubcategory = async (data) => {
    try {
      setLoading(true);

      const body = {
        name: data.name,
        categoryId: data.categoryId,
      };

      const response = await updateSubcategory(selectedSubcategory.id, body);

      if (response.status === 200) {
        const { subcategory } = response.data;
        const updatedSubcategory = {
          ...subcategory,
          id: subcategory.id,
        };

        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedSubcategory.id
              ? { ...row, ...updatedSubcategory }
              : row
          )
        );
        enqueueSnackbar("Subcategoría actualizada exitosamente", {
          variant: "success",
        });
        setLoading(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error actualizando la subcategoría", error.message);
    }
  };

  const openEditModal = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setMode("edit");
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedSubcategory(null);
    setMode("create");
    setIsModalOpen(true);
  };

  return (
    <Grid container width="100%" gap={2} flexDirection="row">
      <Grid item xs={12}>
        <Stack>
          <Typography variant="h1">Subcategorías</Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{ color: "#838383", fontWeight: 500 }}
              variant="body"
            >
              Agrega o edita subcategorías
            </Typography>
            <Button onClick={openAddModal}>Agregar</Button>
          </Box>
        </Stack>
      </Grid>
      <SubcategoriesTable
        rows={rows}
        columns={[
          { field: "name", headerName: "Nombre", flex: 1 },
          {
            field: "category",
            headerName: "Categoría Asociada",
            renderCell: (params) =>
              params.row.category?.name || "Sin categoría",
            flex: 1,
          },
        ]}
        onEditClick={openEditModal}
      />
      <ActionModal
        title="Subcategoría"
        optionTitle="Selecciona la categoría a asociar"
        option="categoryId"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={
          mode === "create" ? handleAddSubcategory : handleEditSubcategory
        }
        mode={mode}
        selected={selectedSubcategory}
        loading={loading}
        options={categories}
      />
    </Grid>
  );
};

export default Subcategories;
