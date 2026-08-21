"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSnackbar } from "notistack";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { Add, ArrowDropDown } from "@mui/icons-material";
import { fetchAllProducts, searchAllProducts } from "../../../../api/products";
import useServerPagination from "../../../../hooks/admin/useServerPagination";
import { useUpdateProduct } from "../../../../hooks/admin/useUpdateProduct";
import { useDebounce } from "../../../../hooks/use-debounce";
import { getProductColumns } from "./constants";
import ProductSearchField from "./ProductSearchField";
import { CustomNoRowsOverlay } from "../../../../components/CustomNoRows";
import { localeText } from "../../../../constants/x-datagrid/localeText";
import { CustomToolbar } from "../../../../components/DataGrid/CustomToolbar";
import { CustomFooter } from "../../../../components/DataGrid/CustomFooter";
import { ErrorUI } from "../../../../components/Error";

// Los tres diálogos sólo se abren bajo demanda; en estático arrastraban al chunk
// inicial de la ruta todo el flujo de CSV, papaparse incluido. next/dynamic sólo
// descarga el chunk cuando el componente llega a renderizarse, así que abajo se
// montan hasta la primera apertura (y se quedan montados, para no perder la
// transición de cierre).
const ProductActionModal = dynamic(() => import("./ProductActionModal"), { ssr: false });
const CreateProductDialog = dynamic(() => import("./CreateProductDialog"), { ssr: false });
const BulkCsvDialog = dynamic(() => import("./add-product/BulkCsvDialog"), { ssr: false });

const MIN_SEARCH_LENGTH = 3;
const SEARCH_DEBOUNCE_MS = 500;

const ProductsPage = () => {
  // Modal
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Crear (menú + dialogs)
  const [createMode, setCreateMode] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);

  // Búsqueda
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);
  const trimmedSearch = debouncedSearch.trim();
  const query = trimmedSearch.length >= MIN_SEARCH_LENGTH ? trimmedSearch : "";

  const { enqueueSnackbar } = useSnackbar();

  const fetchProducts = useCallback(
    (page, size, search) =>
      search ? searchAllProducts(page, size, search) : fetchAllProducts(page, size),
    []
  );

  const { data, loading, error, paginationModel, setPaginationModel, reload } = useServerPagination(
    fetchProducts,
    { initialPageSize: 25, query }
  );

  const { update, saving } = useUpdateProduct();

  // Marca qué diálogos ya se abrieron alguna vez, para montarlos sólo entonces.
  const [openedOnce, setOpenedOnce] = useState({});
  const markOpened = useCallback(
    (key) => setOpenedOnce((prev) => (prev[key] ? prev : { ...prev, [key]: true })),
    []
  );

  const handleOpenEdit = useCallback(
    (row) => {
      setSelected(row);
      markOpened("edit");
      setIsModalOpen(true);
    },
    [markOpened]
  );

  const columns = useMemo(() => getProductColumns(handleOpenEdit), [handleOpenEdit]);

  const chooseCreate = (mode) => {
    markOpened(mode);
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

  if (error) return <ErrorUI onRetry={reload} message="No pudimos cargar los productos" />;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 2,
        }}
      >
        <ProductSearchField
          value={searchInput}
          onChange={setSearchInput}
          onClear={() => setSearchInput("")}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          endIcon={<ArrowDropDown />}
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          sx={{ flexShrink: 0 }}
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
        columns={columns}
        loading={loading}
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
        slotProps={{
          // La búsqueda real es server-side y vive arriba del grid; el quick filter
          // de MUI sólo filtra la página ya cargada y confundía con dos buscadores.
          toolbar: { showQuickFilter: false },
          noRowsOverlay: {
            message: query ? `Sin resultados para "${query}"` : "Aún no hay productos",
          },
        }}
      />
      {openedOnce.edit && (
        <ProductActionModal
          title="Producto"
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleEditProduct}
          selected={selected}
          loading={saving}
        />
      )}

      {openedOnce.individual && (
        <CreateProductDialog
          open={createMode === "individual"}
          onClose={() => setCreateMode(null)}
          onCreated={() => {
            setCreateMode(null);
            reload();
          }}
        />
      )}

      {openedOnce.csv && (
        <BulkCsvDialog
          open={createMode === "csv"}
          onClose={() => {
            setCreateMode(null);
            reload();
          }}
        />
      )}
    </>
  );
};

export default ProductsPage;
