"use client";

import { useEffect, useState } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { DataGrid } from "@mui/x-data-grid";
import { fetchAllProducts, updateProduct } from "../../../../api/products";
import { getBrands } from "../../../../api/admin/brands";
import { getCategories } from "../../../../api/category";
import { getSubcategories } from "../../../../api/subcategories";
import { getProductTypes } from "../../../../api/productTypes";
import { getProductColumns } from "./constants";
import ProductActionModal from "./ProductActionModal";
import { CustomNoRowsOverlay } from "../../../../components/CustomNoRows";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [types, setTypes] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    setLoading(true);
    const { products, count } = await fetchAllProducts(
      paginationModel.page + 1,
      paginationModel.pageSize
    );
    setLoading(false);
    setProducts([...products]);
    setTotalPages(count || 0);
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        setBrands(await getBrands());
        setCategories(await getCategories());
        setSubcategories(await getSubcategories());
        setTypes(await getProductTypes());
      } catch (error) {
        console.error("Error fetching references:", error);
      }
    };

    fetchReferences();
  }, []);

  const handleOpenEdit = (product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const handleEditProduct = async (data) => {
    try {
      setLoading(true);
      const response = await updateProduct(editProduct.id, data);
      if (response.status === 200) {
        enqueueSnackbar("Producto actualizado exitosamente", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error actualizando el producto", error);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <Grid container width="100%" gap={2} flexDirection="row">
      <Grid item xs={12}>
        <Stack>
          <Typography variant="h1">Productos</Typography>
          <Typography sx={{ color: "#838383", fontWeight: 500 }} variant="body">
            Gestiona los productos disponibles
          </Typography>
        </Stack>
      </Grid>
      <Box sx={{ height: 700, width: "100%" }}>
        <DataGrid
          rows={products}
          columns={getProductColumns(handleOpenEdit)}
          rowCount={totalPages}
          paginationMode="server"
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
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
            noRowsOverlay: CustomNoRowsOverlay,
          }}
        />
      </Box>
      <ProductActionModal
        title="Producto"
        optionTitle="Selecciona una categoría asociada"
        option="categoryId"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEditProduct}
        fetchData={fetchData}
        mode="edit"
        selected={editProduct}
        loading={loading}
        brands={brands}
        categories={categories}
        subcategories={subcategories}
        types={types}
      />
    </Grid>
  );
};

export default ProductsPage;
