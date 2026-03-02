"use client";

import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";
import {
  getProductTypes,
  createProductType,
  updateProductType,
} from "../../../../api/productTypes";
import { getSubcategories } from "../../../../api/subcategories";
import { revalidateTypePage } from "../../../../actions/revalidate";
import ActionModal from "../../../../components/ActionModal";
import { toSlug } from "../../../../utils/cases";
import ProductTypesTable from "../../../../components/CrudAdminTable";
import { productTypesColumns } from "./columns";
import type { ProductType, Subcategory } from "../../../../types/catalog";
import type { GridPaginationModel } from "@mui/x-data-grid";

const ProductTypes = () => {
  const [rows, setRows] = useState<ProductType[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const { enqueueSnackbar } = useSnackbar();

  const fetchInitialData = useCallback(async () => {
    try {
      const data = await getProductTypes({
        page: paginationModel.page + 1,
        size: paginationModel.pageSize,
      });
      setRows(data.productTypes);
      setRowCount(data.count);
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  }, [paginationModel]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const data = await getSubcategories({ size: 1000 });
        setSubcategories(data.subcategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, []);

  const handleAddProductType = async (data: { name: string; subcategoryId: string }) => {
    try {
      setLoading(true);
      const response = await createProductType(data);
      if (response.status === 201) {
        const { productType } = response.data;
        const newProductType = {
          ...productType,
          id: productType.id,
        };

        setRows((prevRows) => [...prevRows, newProductType]);
        revalidateTypePage(toSlug(productType.name));
        enqueueSnackbar("Tipo de producto agregado exitosamente", {
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
    } catch {
      setLoading(false);
      enqueueSnackbar("Error creando el tipo de producto", {
        variant: "error",
      });
    }
  };

  const handleEditProductType = async (data: { name: string; subcategoryId: string }) => {
    try {
      setLoading(true);

      const body = {
        name: data.name,
        subcategoryId: data.subcategoryId,
      };

      const response = await updateProductType(selectedProductType!.id, body);

      if (response.status === 200) {
        const { productType } = response.data;
        const updatedProductType = {
          ...productType,
          id: productType.id,
        };
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedProductType!.id ? { ...row, ...updatedProductType } : row
          )
        );
        revalidateTypePage(toSlug(productType.name));
        enqueueSnackbar("Tipo de producto actualizado exitosamente", {
          variant: "success",
        });
        setLoading(false);
        setIsModalOpen(false);
      }
    } catch {
      setLoading(false);
      enqueueSnackbar("Error actualizando el tipo de producto", {
        variant: "error",
      });
    }
  };

  const openEditModal = (productType: ProductType) => {
    setSelectedProductType(productType);
    setMode("edit");
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedProductType(null);
    setMode("create");
    setIsModalOpen(true);
  };

  return (
    <>
      <ProductTypesTable
        rows={rows}
        columns={productTypesColumns}
        onEditClick={openEditModal}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowCount={rowCount}
        title="variante"
        handleClick={openAddModal}
      />
      <ActionModal
        title="Tipo de Producto"
        optionTitle="Selecciona la subcategoría a asociar"
        option="subcategoryId"
        options={subcategories}
        groupBy={(opt: Subcategory) => opt.category?.name || "Sin categoría"}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={mode === "create" ? handleAddProductType : handleEditProductType}
        mode={mode}
        selected={selectedProductType}
        loading={loading}
      />
    </>
  );
};

export default ProductTypes;
