"use client";

import { useState } from "react";
import { useSnackbar } from "notistack";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { Add, ArrowDropDown } from "@mui/icons-material";
import { fetchAllProducts } from "../../../../api/products";
import useServerPagination from "../../../../hooks/admin/useServerPagination";
import { useUpdateProduct } from "../../../../hooks/admin/useUpdateProduct";
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
  // Modal
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Crear (menú + dialogs)
  const [createMode, setCreateMode] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const { data, loading, error, paginationModel, setPaginationModel, reload } = useServerPagination(
    fetchAllProducts,
    { initialPageSize: 100 }
  );

  const { update, saving } = useUpdateProduct();

  const handleOpenEdit = (row) => {
    setSelected(row);
    setIsModalOpen(true);
  };

  const chooseCreate = (mode) => {
    setCreateMode(mode);
    setMenuAnchor(null);
  };

  const handleEditProduct = async (payload) => {
    try {
      await update(selected.id, payload);
      enqueueSnackbar("Producto actualizado exitosamente", { variant: "success" });
      setIsModalOpen(false);
      reload();
    } catch (err) {
      if (err?.response?.status === 409) {
        enqueueSnackbar("El producto fue modificado por otro usuario. Recargando datos...", {
          variant: "warning",
        });
        setIsModalOpen(false);
        reload();
      } else {
        // El modal queda abierto para que el usuario reintente sin perder lo capturado.
        enqueueSnackbar(err?.message || "Error al actualizar producto", { variant: "error" });
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorUI onRetry={reload} message="No pudimos cargar los productos" />;

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
        rows={data?.products || []}
        columns={getProductColumns(handleOpenEdit)}
        rowCount={data?.count || 0}
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
        selected={selected}
        loading={saving}
      />

      <CreateProductDialog
        open={createMode === "individual"}
        onClose={() => setCreateMode(null)}
        onCreated={() => {
          setCreateMode(null);
          reload();
        }}
      />

      <BulkCsvDialog
        open={createMode === "csv"}
        onClose={() => {
          setCreateMode(null);
          reload();
        }}
      />
    </>
  );
};

export default ProductsPage;
