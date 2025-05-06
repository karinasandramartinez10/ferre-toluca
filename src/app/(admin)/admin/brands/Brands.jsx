"use client";

import { useEffect, useState } from "react";
import {
  createBrand,
  getBrands,
  updateBrand,
} from "../../../../api/admin/brands";
import BrandModal from "./BrandModal";
import { useSnackbar } from "notistack";
import { toCamelCase, toCapitalizeFirstLetter } from "../../../../utils/cases";
import CrudAdminTable from "../../../../components/CrudAdminTable";
import { brandsColumns } from "./columns";

const Brands = () => {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [mode, setMode] = useState("create");

  const { enqueueSnackbar } = useSnackbar();

  const fetchInitialData = async () => {
    try {
      const data = await getBrands({
        page: paginationModel.page + 1,
        size: paginationModel.pageSize,
      });
      setRows(data.brands);
      setRowCount(data.count);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [paginationModel]);

  const handleAddBrand = async (data) => {
    if (!data.image || data.image.length === 0) {
      enqueueSnackbar("Debes agregar una imagen", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", toCapitalizeFirstLetter(data.name));
      formData.append("codeName", toCamelCase(data.name));
      formData.append("image", data.image);

      const response = await createBrand(formData);
      if (response.status === 201) {
        const { brand, file } = response.data;
        const newBrand = {
          ...brand,
          id: brand.id,
          imageUrl: file.path,
        };

        setRows((prevRows) => [...prevRows, newBrand]);
        enqueueSnackbar("Marca agregada exitósamente", {
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
      console.error("Error creating brand:", error);
    }
  };

  const handleEditBrand = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", toCapitalizeFirstLetter(data.name));
      formData.append("codeName", toCamelCase(data.name));
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await updateBrand(
        selectedBrand.id,
        formData,
      );

      if (response.status === 200) {
        const { brand, file } = response.data;
        const updatedBrand = {
          ...brand,
          id: brand.id,
          imageUrl: file?.path || selectedBrand.File?.path, // Mantén la imagen anterior si no se actualizó.
        };

        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedBrand.id ? { ...row, ...updatedBrand } : row
          )
        );
        enqueueSnackbar("Marca actualizada exitósamente", {
          variant: "success",
        });
        setLoading(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error actualizando la marca", error.message);
    }
  };

  const openEditModal = (brand) => {
    setSelectedBrand(brand);
    setMode("edit");
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedBrand(null);
    setMode("create");
    setIsModalOpen(true);
  };

  return (
    <>
      <CrudAdminTable
        rows={rows}
        columns={brandsColumns}
        onEditClick={openEditModal}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowCount={rowCount}
        title="marca"
        handleClick={openAddModal}
      />
      <BrandModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={mode === "create" ? handleAddBrand : handleEditBrand}
        mode={mode}
        selectedBrand={selectedBrand}
        loading={loading}
      />
    </>
  );
};

export default Brands;
