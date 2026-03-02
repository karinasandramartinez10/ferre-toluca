"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrand, getBrands, updateBrand } from "../../../../api/admin/brands";
import BrandModal from "./BrandModal";
import { useSnackbar } from "notistack";
import { revalidateBrandPage } from "../../../../actions/revalidate";
import { getApiErrorMessage } from "../../../../utils/apiError";
import { toCamelCase, toCapitalizeFirstLetter } from "../../../../utils/cases";
import CrudAdminTable from "../../../../components/CrudAdminTable";
import { brandsColumns } from "./columns";
import type { Brand } from "../../../../types/catalog";
import type { ModalMode } from "../../../../types/ui";
import type { BrandFormData } from "./BrandModal";
import type { GridPaginationModel } from "@mui/x-data-grid";

const Brands = () => {
  const [rows, setRows] = useState<Brand[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [mode, setMode] = useState<ModalMode>("create");

  const { enqueueSnackbar } = useSnackbar();

  const fetchInitialData = useCallback(async () => {
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
  }, [paginationModel]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleAddBrand = async (data: BrandFormData) => {
    if (!data.image) {
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
      formData.append("image", data.image as Blob);

      const response = await createBrand(formData);
      if (response.status === 201) {
        const { brand, file } = response.data as {
          brand: Brand;
          file: { path: string };
        };
        const newBrand: Brand = {
          ...brand,
          id: brand.id,
          imageUrl: file.path,
        };

        setRows((prevRows) => [...prevRows, newBrand]);
        revalidateBrandPage(brand.codeName ?? "");
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
      if ((error as any)?.response?.status === 409) {
        enqueueSnackbar("Ya existe una marca con ese nombre", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar(getApiErrorMessage(error) || "Error al crear marca", {
          variant: "error",
        });
      }
    }
  };

  const handleEditBrand = async (data: BrandFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", toCapitalizeFirstLetter(data.name));
      formData.append("codeName", toCamelCase(data.name));
      if (data.image) {
        formData.append("image", data.image as Blob);
      }

      const response = await updateBrand(selectedBrand!.id, formData);

      if (response.status === 200) {
        const { brand, file } = response.data as {
          brand: Brand;
          file?: { path: string };
        };
        const updatedBrand: Brand = {
          ...brand,
          id: brand.id,
          imageUrl: file?.path || selectedBrand!.File?.path,
        };

        setRows((prevRows) =>
          prevRows.map((row) => (row.id === selectedBrand!.id ? { ...row, ...updatedBrand } : row))
        );
        revalidateBrandPage(brand.codeName ?? "");
        enqueueSnackbar("Marca actualizada exitósamente", {
          variant: "success",
        });
        setLoading(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      setLoading(false);
      if ((error as any)?.response?.status === 409) {
        enqueueSnackbar("Ya existe una marca con ese nombre", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar(getApiErrorMessage(error) || "Error al actualizar marca", {
          variant: "error",
        });
      }
    }
  };

  const openEditModal = (brand: any) => {
    setSelectedBrand(brand as Brand);
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
