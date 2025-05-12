"use client";

import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import {
  getProductTypes,
  createProductType,
  updateProductType,
} from "../../../../api/productTypes";
import { getSubcategories } from "../../../../api/subcategories";
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
  const [subcategories, setSubcategories] = useState([]);
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

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const data = await getSubcategories();
        setSubcategories(data.subcategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, []);

  const handleAddProductType = async (data) => {
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
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Error creando el tipo de producto", {
        variant: "error",
      });
    }
  };

  const handleEditProductType = async (data) => {
    try {
      setLoading(true);

      const body = {
        name: data.name,
        subcategoryId: data.subcategoryId,
      };

      console.log("23", body);

      const response = await updateProductType(selectedProductType.id, body);

      if (response.status === 200) {
        const { productType } = response.data;
        const updatedProductType = {
          ...productType,
          id: productType.id,
        };
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedProductType.id
              ? { ...row, ...updatedProductType }
              : row
          )
        );
        enqueueSnackbar("Tipo de producto actualizado exitosamente", {
          variant: "success",
        });
        setLoading(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Error actualizando el tipo de producto", {
        variant: "error",
      });
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
        optionTitle="Selecciona la subcategoría a asociar"
        option="subcategoryId"
        options={subcategories}
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
