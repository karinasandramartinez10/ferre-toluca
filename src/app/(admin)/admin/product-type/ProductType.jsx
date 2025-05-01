"use client";

import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import {
  getProductTypes,
  createProductType,
  updateProductType,
} from "../../../../api/productTypes";
import ActionModal from "../../../../components/ActionModal";
import ProductTypesTable from "../../../../components/CrudAdminTable";
import { productTypesColumns } from "./columns";

const ProductTypes = () => {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [mode, setMode] = useState("create");

  const { enqueueSnackbar } = useSnackbar();

  const fetchInitialData = async () => {
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
  };
  useEffect(() => {
    fetchInitialData();
  }, [paginationModel]);

  const handleAddProductType = async (data) => {
    try {
      setLoading(true);
      const response = await createProductType(data);

      if (response.productType) {
        setRows((prevRows) => [...prevRows, response.productType]);
        enqueueSnackbar("Tipo de producto agregado exitosamente", {
          variant: "success",
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      enqueueSnackbar("Error creando el tipo de producto", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProductType = async (data) => {
    try {
      setLoading(true);
      const response = await updateProductType(selectedProductType.id, data);

      if (response.productType) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedProductType.id ? response.productType : row
          )
        );
        enqueueSnackbar("Tipo de producto actualizado exitosamente", {
          variant: "success",
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      enqueueSnackbar("Error actualizando el tipo de producto", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (productType) => {
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
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={
          mode === "create" ? handleAddProductType : handleEditProductType
        }
        mode={mode}
        selected={selectedProductType}
        loading={loading}
      />
    </>
  );
};

export default ProductTypes;
