"use client";

import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "../../../../api/category";
import ActionModal from "../../../../components/ActionModal";
import CategoriesTable from "../../../../components/CrudAdminTable";
import { categoriesColumns } from "./columns";

const Categories = () => {
  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <>
      <CategoriesTable
        rows={rows}
        columns={categoriesColumns}
        onEditClick={openEditModal}
      />
      <ActionModal
        title="Categoría"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={mode === "create" ? handleAddCategory : handleEditCategory}
        mode={mode}
        selected={selectedCategory}
        loading={loading}
      />
    </>
  );
};

export default Categories;
