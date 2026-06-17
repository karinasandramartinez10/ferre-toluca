"use client";

import { useCallback, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { Add, ArrowDropDown } from "@mui/icons-material";
import { fetchAllProducts, updateProduct } from "../../../../api/products";
import { revalidateProduct } from "../../../../actions/revalidate";
import { getProductColumns } from "./constants";
import ProductActionModal from "./ProductActionModal";
import CreateProductDialog from "./CreateProductDialog";
import BulkCsvDialog from "./add-product/BulkCsvDialog";
import { CustomNoRowsOverlay } from "../../../../components/CustomNoRows";
import { localeText } from "../../../../constants/x-datagrid/localeText";
import { CustomToolbar } from "../../../../components/DataGrid/CustomToolbar";
import { CustomFooter } from "../../../../components/DataGrid/CustomFooter";
import { Loading } from "../../../../components/Loading";
import { ErrorUI } from "../../../../components/Error";

const ProductsPage = () => {
  // Table and pagination
  const [data, setData] = useState({
    products: [],
    count: 0,
    page: 0,
    pageSize: 100,
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Modal
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Crear (menú + dialogs)
  const [createMode, setCreateMode] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);

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
    loadPage(paginationModel.page + 1, paginationModel.pageSize);
  }, [paginationModel, loadPage]);

  const handleOpenEdit = (row) => {
    setSelected(row);
    setIsModalOpen(true);
  };

  const chooseCreate = (mode) => {
    setCreateMode(mode);
    setMenuAnchor(null);
  };

  const refetchList = () => loadPage(data.page, data.pageSize);

  const handleEditProduct = async (formData) => {
    try {
      setLoading(true);
      const resp = await updateProduct(selected.id, formData);
      if (resp.status === 200) {
        enqueueSnackbar("Producto actualizado exitosamente", {
          variant: "success",
        });
        revalidateProduct(selected.id);
      }
      await loadPage(data.page, data.pageSize);
    } catch (err) {
      if (err?.response?.status === 409) {
        enqueueSnackbar("El producto fue modificado por otro usuario. Recargando datos...", {
          variant: "warning",
        });
        await loadPage(data.page, data.pageSize);
      } else {
        enqueueSnackbar("Error al actualizar producto", { variant: "error" });
      }
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <ErrorUI
        onRetry={() => loadPage(paginationModel.page, paginationModel.pageSize)}
        message="No pudimos cargar los productos"
      />
    );

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          endIcon={<ArrowDropDown />}
          onClick={(e) => setMenuAnchor(e.currentTarget)}
        >
          Agregar productos
        </Button>
        <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
          <MenuItem onClick={() => chooseCreate("individual")}>Producto individual</MenuItem>
          <MenuItem onClick={() => chooseCreate("csv")}>Importar CSV</MenuItem>
        </Menu>
      </Box>

      <DataGrid
        localeText={localeText}
        density="compact"
        rows={Array.isArray(data.products) ? data.products : []}
        columns={getProductColumns(handleOpenEdit)}
        rowCount={Number.isFinite(data.count) ? data.count : 0}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50, 100]}
        disableRowSelectionOnClick
        sx={{
          height: 900,
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            fontSize: "0.8rem",
          },
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          "& .MuiDataGrid-row:nth-of-type(even)": {
            bgcolor: "grey.50",
          },
          "& .MuiDataGrid-panelContent": {
            fontSize: "0.8rem",
          },
          "& .MuiDataGrid-columnsManagementRow": {
            py: 0,
          },
          "& .MuiDataGrid-menuList .MuiMenuItem-root": {
            fontSize: "0.8rem",
            minHeight: 32,
          },
        }}
        slots={{
          toolbar: CustomToolbar,
          noRowsOverlay: CustomNoRowsOverlay,
          footer: CustomFooter,
        }}
        slotProps={{ noRowsOverlay: { message: "Aún no hay productos" } }}
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

      <CreateProductDialog
        open={createMode === "individual"}
        onClose={() => setCreateMode(null)}
        onCreated={() => {
          setCreateMode(null);
          refetchList();
        }}
      />

      <BulkCsvDialog
        open={createMode === "csv"}
        onClose={() => {
          setCreateMode(null);
          refetchList();
        }}
      />
    </>
  );
};

export default ProductsPage;
