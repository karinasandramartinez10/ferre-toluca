"use client";

import { LoadingButton } from "@mui/lab";
import { Box, Chip, Divider, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dropzone } from "../../../../components/Dropzone";
import type { PhotoPreview } from "../../../../types/ui";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { v4 as uuidv4 } from "uuid";
import { postProduct } from "../../../../api/admin";
import { getCategories } from "../../../../api/category";
import { getSubcategories } from "../../../../api/subcategories";
import { validateRows } from "./helpers";
import AddProductFields from "./AddProductFields";
import { getBrands } from "../../../../api/admin/brands";
import { useMeasures } from "../../../../hooks/catalog/useMeasures";
import { useProductModels } from "../../../../hooks/catalog/useProductModels";
import { useProductTypesBySubcategory } from "../../../../hooks/catalog/useProductTypesBySubcategory";
import { AddProductBanner } from "./AddProductBanner";
import CSVUploadButton from "./CSVUploadButton";
import { useCSVParser } from "./useCSVParser";
import type { Brand, Category, Subcategory, Measure } from "../../../../types/catalog";
import type { GridRowModesModel } from "@mui/x-data-grid";

const ProductTable = dynamic(() => import("./table/ProductTable").then((mod) => mod.ProductTable), {
  ssr: false,
});
const BulkCSVUpload = dynamic(() => import("./BulkCSVUpload"), {
  ssr: false,
});

interface ProductFormValues {
  brandId: string;
  categoryId: string;
  hasType: string;
  subCategoryId: string;
  typeId: string;
  image?: File;
}

interface ProductRow {
  id: string;
  name: string;
  description: string;
  code: string;
  specifications: string;
  modelId: string | null;
  modelName: string;
  measureId: string | null;
  measureValue: string;
  qualifier: string;
  secondaryMeasureId: string | null;
  secondaryMeasureValue: string;
  color?: string;
  isNew?: boolean;
}

const defaultFormValues: ProductFormValues = {
  brandId: "",
  categoryId: "",
  hasType: "no",
  subCategoryId: "",
  typeId: "",
};

const ProductSchema = yup.object().shape({
  brandId: yup.string().required("La marca es requerida"),
  categoryId: yup.string().required("La categoría es requerida"),
  hasType: yup.string().defined(),
  subCategoryId: yup.string().defined(),
  typeId: yup.string().defined(),
  image: yup.mixed<File>(),
});

const initialRows: ProductRow[] = [
  {
    id: uuidv4(),
    name: "",
    description: "",
    code: "",
    specifications: "",
    modelId: null,
    modelName: "",
    measureId: null,
    measureValue: "",
    qualifier: "",
    secondaryMeasureId: null,
    secondaryMeasureValue: "",
  },
];

const AddProduct = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<PhotoPreview | null>(null);
  const [rows, setRows] = useState<ProductRow[]>(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
    setValue,
    unregister,
    reset,
  } = useForm({
    resolver: yupResolver(ProductSchema),
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  const brandId = watch("brandId");
  const categoryId = watch("categoryId");
  const subCategoryId = watch("subCategoryId");
  const hasType = watch("hasType");

  const { enqueueSnackbar } = useSnackbar();

  const { transformCSVToRows } = useCSVParser();

  const { measures } = useMeasures();
  const { productModels } = useProductModels(brandId);
  const { productTypes: types } = useProductTypesBySubcategory(subCategoryId);

  useEffect(() => {
    if (!brandId) return;
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        modelName: "",
        modelId: null,
      }))
    );
  }, [brandId]);

  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      setValue("subCategoryId", "");
      setValue("typeId", "");
      return;
    }

    const fetchSubcategories = async () => {
      try {
        const res = await getSubcategories({ categoryId });
        setSubcategories(res.subcategories);
        setValue("subCategoryId", "");
        setValue("typeId", "");
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  useEffect(() => {
    setValue("typeId", "");
  }, [subCategoryId, setValue]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          getBrands({ size: 1000 }),
          getCategories({ size: 1000 }),
        ]);
        setBrands(brandsData.brands);
        setCategories(categoriesData.categories);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleRemoveFile = () => {
    unregister("image");
    URL.revokeObjectURL(photo?.preview ?? "");
    setPhoto(null);
  };

  const handleDeleteClick = (id: string) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const onSubmit = async (values: ProductFormValues) => {
    if (!validateRows(rows)) {
      enqueueSnackbar("Debes completar al menos el nombre, codigo, descripción, valor y unidad", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      return;
    }

    setLoading(true);
    try {
      const requestBody = new FormData();
      if (values.image) {
        requestBody.append("image", values.image);
      }
      requestBody.append("brandId", values.brandId);
      requestBody.append("categoryId", values.categoryId);
      requestBody.append("subCategoryId", values.subCategoryId);
      if (values.hasType === "yes" && values.typeId) {
        requestBody.append("typeId", values.typeId);
      }

      rows.forEach((product, index) => {
        requestBody.append(`products[${index}][name]`, product.name ? product.name.trim() : "");
        requestBody.append(
          `products[${index}][description]`,
          product.description ? product.description.trim() : ""
        );
        requestBody.append(
          `products[${index}][code]`,
          product.code ? product.code.toUpperCase() : ""
        );
        requestBody.append(
          `products[${index}][specifications]`,
          product.specifications ? product.specifications.trim() : ""
        );
        requestBody.append(`products[${index}][color]`, product.color ? product.color.trim() : "");
        requestBody.append(
          `products[${index}][qualifier]`,
          product.qualifier ? product.qualifier.trim() : ""
        );
        requestBody.append(
          `products[${index}][secondaryMeasureValue]`,
          product.secondaryMeasureValue || ""
        );
        if (product.secondaryMeasureId) {
          requestBody.append(`products[${index}][secondaryMeasureId]`, product.secondaryMeasureId);
        }

        if (product.modelId) {
          requestBody.append(`products[${index}][modelId]`, product.modelId);
        } else if (product.modelName) {
          requestBody.append(`products[${index}][modelName]`, product.modelName.trim());
        }

        requestBody.append(`products[${index}][measureId]`, product.measureId || "");
        requestBody.append(`products[${index}][measureValue]`, product.measureValue || "");
      });

      await postProduct(requestBody);
      enqueueSnackbar("Producto(s) añadido(s) exitósamente", {
        variant: "success",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      reset(defaultFormValues);
      handleRemoveFile();
      setRows(initialRows);
      setRowModesModel({});
      setSubcategories([]);
      setLoading(false);

      return;
    } catch (error) {
      console.log(error);
      setLoading(false);
      enqueueSnackbar("Hubo un error al agregar el producto", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      return;
    }
  };

  const processRowUpdate = (newRow: ProductRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Lote con misma marca y categoría" sx={{ textTransform: "none" }} />
        <Tab
          label="Importar CSV (marcas y categorías independientes)"
          sx={{ textTransform: "none" }}
        />
      </Tabs>

      {activeTab === 0 && (
        <Stack spacing={3} sx={{ width: "100%" }}>
          <AddProductBanner variant="batch" />

          {/* Paso 1 — Datos generales */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Chip label="1" size="small" color="primary" sx={{ fontWeight: 700, minWidth: 28 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Datos generales del lote
              </Typography>
            </Stack>
            <AddProductFields
              brands={brands}
              categories={categories}
              subcategories={subcategories}
              types={types}
              control={control}
              hasType={hasType}
            />
          </Paper>

          {/* Paso 2 — Productos */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Chip label="2" size="small" color="primary" sx={{ fontWeight: 700, minWidth: 28 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Productos
              </Typography>
            </Stack>

            <CSVUploadButton
              onCSVParsed={(parsedData: unknown[]) => {
                const {
                  rows: parsedRows,
                  errors,
                  acceptedAbbreviations,
                } = transformCSVToRows(parsedData, measures as Measure[]);

                if (errors.length > 0) {
                  const message = errors
                    .map(
                      (err: { index: number; value: string }) =>
                        `Fila ${err.index + 2}: "${err.value}" no es una unidad válida.`
                    )
                    .join("\n");

                  enqueueSnackbar(
                    `${message}\nUnidades aceptadas: ${acceptedAbbreviations.join(", ")}`,
                    {
                      variant: "error",
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: "top", horizontal: "right" },
                    }
                  );
                  return;
                }
                setRows(parsedRows);
              }}
            />

            <Box sx={{ mt: 2 }}>
              <ProductTable
                rows={rows}
                setRows={setRows}
                rowModesModel={rowModesModel}
                setRowModesModel={setRowModesModel}
                handleDeleteClick={handleDeleteClick}
                processRowUpdate={processRowUpdate}
                handleRowModesModelChange={handleRowModesModelChange}
                measures={measures}
                productModels={productModels}
              />
            </Box>
          </Paper>

          {/* Paso 3 — Imagen */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Chip label="3" size="small" color="primary" sx={{ fontWeight: 700, minWidth: 28 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Imagen del lote
              </Typography>
            </Stack>
            <Dropzone
              preview
              setValue={setValue}
              photo={photo}
              setPhoto={setPhoto}
              onRemove={handleRemoveFile}
            />
          </Paper>

          {/* Acciones */}
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <LoadingButton
              loading={loading}
              disabled={loading || !isValid}
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              size="large"
            >
              Añadir Productos
            </LoadingButton>
          </Box>
        </Stack>
      )}

      {activeTab === 1 && (
        <Stack spacing={3} sx={{ width: "100%" }}>
          <AddProductBanner variant="csv" />
          <BulkCSVUpload />
        </Stack>
      )}
    </Box>
  );
};

export default AddProduct;
