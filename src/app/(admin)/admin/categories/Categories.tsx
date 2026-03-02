"use client";

import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { createCategory, getCategories, updateCategory } from "../../../../api/category";
import { revalidateCategoryPage } from "../../../../actions/revalidate";
import { getApiErrorMessage } from "../../../../utils/apiError";
import ActionModal from "../../../../components/ActionModal";
import CategoriesTable from "../../../../components/CrudAdminTable";
import { categoriesColumns } from "./columns";
import type { Category } from "../../../../types/catalog";
import type { ModalMode } from "../../../../types/ui";
import type { GridPaginationModel } from "@mui/x-data-grid";

const Categories = () => {
  const [rows, setRows] = useState<Category[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [mode, setMode] = useState<ModalMode>("create");

  const { enqueueSnackbar } = useSnackbar();

  const fetchInitialData = useCallback(async () => {
    try {
      const data = await getCategories({
        page: paginationModel.page + 1,
        size: paginationModel.pageSize,
      });
      setRows(data.categories);
      setRowCount(data.count);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  }, [paginationModel]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleAddCategory = async (data: Record<string, unknown>) => {
    try {
      setLoading(true);

      const body = {
        name: data.name as string,
      };

      const response = await createCategory(body);
      if (response.status === 201) {
        const { category } = response.data as { category: Category };
        const newCategory = {
          ...category,
          id: category.id,
        };

        setRows((prevRows) => [...prevRows, newCategory]);
        revalidateCategoryPage(category.path ?? "");
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
      if ((error as any)?.response?.status === 409) {
        enqueueSnackbar("Ya existe una categoría con ese nombre", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar(getApiErrorMessage(error) || "Error al crear categoría", {
          variant: "error",
        });
      }
    }
  };

  const handleEditCategory = async (data: Record<string, unknown>) => {
    try {
      setLoading(true);

      const body = {
        name: data.name as string,
      };

      const response = await updateCategory(selectedCategory!.id, body);

      if (response.status === 200) {
        const { category } = response.data as { category: Category };
        const updatedCategory = {
          ...category,
          id: category.id,
        };

        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedCategory!.id ? { ...row, ...updatedCategory } : row
          )
        );
        revalidateCategoryPage(category.path ?? "");
        enqueueSnackbar("Categoría actualizada exitósamente", {
          variant: "success",
        });
        setLoading(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      setLoading(false);
      if ((error as any)?.response?.status === 409) {
        enqueueSnackbar("Ya existe una categoría con ese nombre", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar(getApiErrorMessage(error) || "Error al actualizar categoría", {
          variant: "error",
        });
      }
    }
  };

  const openEditModal = (category: any) => {
    setSelectedCategory(category as Category);
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
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowCount={rowCount}
        title="categoría"
        handleClick={openAddModal}
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
