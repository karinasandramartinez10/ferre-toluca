"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import { DataGrid } from "@mui/x-data-grid";
import { fetchAllProducts, updateProduct } from "../../../../api/products";
import { getProductColumns } from "./constants";
import ProductActionModal from "./ProductActionModal";
import { CustomNoRowsOverlay } from "../../../../components/CustomNoRows";
import { localeText } from "../../../../constants/x-datagrid/localeText";
import { CustomToolbar } from "../../../../components/DataGrid/CustomToolbar";
import { CustomFooter } from "../../../../components/DataGrid/CustomFooter";
import { Loading } from "../../../../components/Loading";
import { ErrorUI } from "../../../../components/Error";

const ProductsPage = () => {
  // Table and pagination
  const [data, setData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const firstLoad = useRef(true);

  // Modal
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const loadPage = useCallback(async (page1, size) => {
    setError(false);
    setLoading(true);
    try {
      const d = await fetchAllProducts(page1, size);
      setData({ ...d, page: page1, pageSize: size });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    loadPage(paginationModel.page + 1, paginationModel.pageSize);
  }, [paginationModel, loadPage]);

  const handleOpenEdit = (row) => {
    setSelected(row);
    setIsModalOpen(true);
  };

  const handleEditProduct = async (formData) => {
    try {
      setLoading(true);
      const resp = await updateProduct(selected.id, formData);
      if (resp.status === 200) {
        enqueueSnackbar("Producto actualizado exitosamente", {
          variant: "success",
        });
      }
      // recargar
      await loadPage(data.page, data.pageSize);
    } catch (e) {
      enqueueSnackbar("Error al actualizar producto", { variant: "error" });
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <ErrorUI
        onRetry={() => loadPage(initialData.page, initialData.pageSize)}
        message="No pudimos cargar los productos"
      />
    );

  return (
    <>
      <DataGrid
        localeText={localeText}
        rows={data.products}
        columns={getProductColumns(handleOpenEdit)}
        rowCount={data.count} //data.count
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
          },
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
        }}
        slots={{
          toolbar: CustomToolbar,
          noRowsOverlay: CustomNoRowsOverlay,
          footer: CustomFooter,
        }}
        slotProps={{
          columnMenu: {
            labelledby: "asd",
          },
        }}
      />
      <ProductActionModal
        title="Producto"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEditProduct}
        fetchData={() => loadPage(data.page, data.pageSize)}
        selected={selected}
        loading={loading}
      />
    </>
  );
};

export default ProductsPage;
