"use client";

import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";
import { getCategories } from "../../../../api/category";
import {
  createSubcategory,
  getSubcategories,
  updateSubcategory,
} from "../../../../api/subcategories";
import ActionModal from "../../../../components/ActionModal";
import SubcategoriesTable from "../../../../components/CrudAdminTable";
import { subcategoriesColumns } from "./columns";

const Subcategories = () => {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [mode, setMode] = useState("create");

  const { enqueueSnackbar } = useSnackbar();

  const fetchInitialData = useCallback(async () => {
    try {
      const data = await getSubcategories({
        page: paginationModel.page + 1,
        size: paginationModel.pageSize,
      });
      setRows(data.subcategories);
      setRowCount(data.count);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  }, [paginationModel])

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData.categories);
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
    <>
      <SubcategoriesTable
        rows={rows}
        columns={subcategoriesColumns}
        onEditClick={openEditModal}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowCount={rowCount}
        title="subcategoría"
        handleClick={openAddModal}
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
    </>
  );
};

export default Subcategories;
