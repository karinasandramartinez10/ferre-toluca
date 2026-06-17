"use client";

import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";
import { getCategories } from "../../../../api/category";
import {
  createSubcategory,
  getSubcategories,
  updateSubcategory,
} from "../../../../api/subcategories";
import { revalidateSubcategoryPage } from "../../../../actions/revalidate";
import { getApiErrorMessage } from "../../../../utils/apiError";
import ActionModal from "../../../../components/ActionModal";
import { toSlug, toCapitalizeWords } from "../../../../utils/cases";
import SubcategoriesTable from "../../../../components/CrudAdminTable";
import { subcategoriesColumns } from "./subcategoriesColumns";
import type { Category, Subcategory } from "../../../../types/catalog";
import type { GridPaginationModel } from "@mui/x-data-grid";

interface SubcategoriesProps {
  parentId?: string;
  parentName?: string;
  onDrill?: (row: Subcategory) => void;
}

const Subcategories = ({ parentId, parentName, onDrill }: SubcategoriesProps) => {
  const [rows, setRows] = useState<Subcategory[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const { enqueueSnackbar } = useSnackbar();

  const fetchInitialData = useCallback(async () => {
    try {
      const data = await getSubcategories({
        ...(parentId ? { categoryId: parentId } : {}),
        page: paginationModel.page + 1,
        size: paginationModel.pageSize,
      });
      setRows(data.subcategories);
      setRowCount(data.count);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  }, [paginationModel, parentId]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // El selector de categoría solo se usa en modo standalone (sin padre del contexto)
  useEffect(() => {
    if (parentId) return;
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories({ size: 1000 });
        setCategories(categoriesData.categories);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchCategories();
  }, [parentId]);

  const handleAddSubcategory = async (data: { name: string; categoryId?: string }) => {
    try {
      setLoading(true);

      const body = {
        name: data.name,
        categoryId: parentId ?? data.categoryId,
      };

      const response = await createSubcategory(body);

      if (response.status === 201) {
        const { subcategory } = response.data;
        const newSubcategory = {
          ...subcategory,
          id: subcategory.id,
        };

        setRows((prevRows) => [...prevRows, newSubcategory]);
        revalidateSubcategoryPage(toSlug(subcategory.name));
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
      if ((error as any)?.response?.status === 409) {
        enqueueSnackbar("Ya existe una subcategoría con ese nombre", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar(getApiErrorMessage(error) || "Error al crear subcategoría", {
          variant: "error",
        });
      }
    }
  };

  const handleEditSubcategory = async (data: { name: string; categoryId?: string }) => {
    try {
      setLoading(true);

      const body = {
        name: data.name,
        categoryId: parentId ?? data.categoryId,
      };

      const response = await updateSubcategory(selectedSubcategory!.id, body);

      if (response.status === 200) {
        const { subcategory } = response.data;
        const updatedSubcategory = {
          ...subcategory,
          id: subcategory.id,
        };

        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedSubcategory!.id ? { ...row, ...updatedSubcategory } : row
          )
        );
        revalidateSubcategoryPage(toSlug(subcategory.name));
        enqueueSnackbar("Subcategoría actualizada exitosamente", {
          variant: "success",
        });
        setLoading(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      setLoading(false);
      if ((error as any)?.response?.status === 409) {
        enqueueSnackbar("Ya existe una subcategoría con ese nombre", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar(getApiErrorMessage(error) || "Error al actualizar subcategoría", {
          variant: "error",
        });
      }
    }
  };

  const openEditModal = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setMode("edit");
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedSubcategory(null);
    setMode("create");
    setIsModalOpen(true);
  };

  const scopeName = parentName ? toCapitalizeWords(parentName) : "";

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
        onDrillClick={onDrill}
        drillLabel="Ver tipos"
        scopeLabel={parentName ? `Subcategorías de ${scopeName}` : undefined}
      />
      <ActionModal
        title="Subcategoría"
        {...(parentId
          ? {}
          : {
              optionTitle: "Selecciona la categoría a asociar",
              option: "categoryId",
              options: categories,
            })}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={mode === "create" ? handleAddSubcategory : handleEditSubcategory}
        mode={mode}
        selected={selectedSubcategory}
        loading={loading}
      />
    </>
  );
};

export default Subcategories;
