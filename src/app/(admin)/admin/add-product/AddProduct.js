"use client";

import { LoadingButton } from "@mui/lab";
import { Grid } from "@mui/material";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dropzone } from "../../../../components/Dropzone";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { v4 as uuidv4 } from "uuid";
import { postProduct } from "../../../../api/admin";
import { getCategories } from "../../../../api/category";
import { getSubcategories } from "../../../../api/subcategories";
import { validateRows } from "./helpers";
import AddProductFields from "./AddProductFields";
import { getProductTypes } from "../../../../api/productTypes";
import { getBrands } from "../../../../api/admin/brands";
import { getMeasures } from "../../../../api/measures";
import { getProductModels } from "../../../../api/productModels";
import { ProductTable } from "./table/ProductTable";
import { AddProductBanner } from "./AddProductBanner";
import CSVUploadButton from "./CSVUploadButton";
import { useCSVParser } from "./useCSVParser";

const defaultFormValues = {
  brandId: "",
  categoryId: "",
  hasType: "no",
  subCategoryId: "",
  typeId: "",
};

const ProductSchema = yup.object().shape({
  brandId: yup.string().required("La marca es requerida"),
  categoryId: yup.string().required("La categoría es requerida"),
});

const initialRows = [
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
  },
];

const AddProduct = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [productModels, setProductModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState({});

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
    setValue,
    unregister,
    register,
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

  useEffect(() => {
    const fetchModelsByBrand = async () => {
      if (!brandId) {
        // Limpia los modelos cuando no hay marca seleccionada
        setProductModels([]);
        return;
      }
      try {
        const models = await getProductModels(brandId);
        setProductModels(models);

        // Limpia los modelos previos si cambió de marca
        setRows((prevRows) =>
          prevRows.map((row) => ({
            ...row,
            modelName: "",
            modelId: null,
          }))
        );
      } catch (err) {
        console.error("Error fetching models by brand:", err);
      }
    };

    fetchModelsByBrand();
  }, [brandId]);

  useEffect(() => {
    if (!categoryId) {
      // Limpia dependencias cuando no hay categoría seleccionada
      setSubcategories([]);
      setTypes([]);
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
        setTypes([]);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  useEffect(() => {
    if (!subCategoryId || subCategoryId === "") {
      // Limpia tipos si no hay subcategoría
      setTypes([]);
      setValue("typeId", "");
      return;
    }

    const fetchTypes = async () => {
      try {
        const res = await getProductTypes({ subcategoryId: subCategoryId });
        setTypes(res.productTypes || res.data.productTypes || []);
        setValue("typeId", "");
      } catch (err) {
        console.error("Error fetching product types:", err);
      }
    };

    fetchTypes();
  }, [subCategoryId]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [brandsData, categoriesData, measuresData] = await Promise.all([
          getBrands(),
          getCategories(),
          getMeasures(),
          getProductModels(),
        ]);
        setBrands(brandsData.brands);
        setCategories(categoriesData.categories);
        setMeasures(measuresData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleRemoveFile = () => {
    unregister("image");
    URL.revokeObjectURL(photo?.preview);
    setPhoto(null);
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const onSubmit = async (values) => {
    if (!validateRows(rows)) {
      enqueueSnackbar(
        "Debes completar al menos el nombre, codigo, descripción, valor y unidad",
        {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        }
      );
      return;
    }

    if (!values.image || values.image.length === 0) {
      enqueueSnackbar("Debes agregar una imagen", {
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
      requestBody.append("image", values.image);
      requestBody.append("brandId", values.brandId);
      requestBody.append("categoryId", values.categoryId);
      requestBody.append("subCategoryId", values.subCategoryId);
      if (values.hasType === "yes" && values.typeId) {
        requestBody.append("typeId", values.typeId);
      }

      rows.forEach((product, index) => {
        requestBody.append(
          `products[${index}][name]`,
          product.name ? product.name.trim() : ""
        );
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
        requestBody.append(
          `products[${index}][color]`,
          product.color ? product.color.trim() : ""
        );
        requestBody.append(
          `products[${index}][size]`,
          product.size ? product.size : ""
        );

        if (product.modelId) {
          requestBody.append(`products[${index}][modelId]`, product.modelId);
        } else if (product.modelName) {
          requestBody.append(
            `products[${index}][modelName]`,
            product.modelName.trim()
          );
        }

        requestBody.append(
          `products[${index}][measureId]`,
          product.measureId || ""
        );
        requestBody.append(
          `products[${index}][measureValue]`,
          product.measureValue || ""
        );
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
      setTypes([]);
      setProductModels([]);
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

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <Grid
      container
      width="100%"
      gap={2}
      flexDirection="row"
      sx={{
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "center", sm: "flex-start" },
      }}
    >
      <AddProductBanner />
      <AddProductFields
        brands={brands}
        categories={categories}
        subcategories={subcategories}
        types={types}
        control={control}
        hasType={hasType}
      />

      <CSVUploadButton
        onCSVParsed={(parsedData) => {
          const {
            rows: parsedRows,
            errors,
            acceptedAbbreviations,
          } = transformCSVToRows(parsedData, measures);

          if (errors.length > 0) {
            const message = errors
              .map(
                (err) =>
                  `Fila ${err.index + 2}: "${
                    err.value
                  }" no es una unidad válida.`
              )
              .join("\n");

            enqueueSnackbar(
              `${message}\nUnidades aceptadas: ${acceptedAbbreviations.join(
                ", "
              )}`,
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

      <Dropzone
        register={register}
        preview
        setValue={setValue}
        text="Arrastra o escoge un archivo"
        photo={photo}
        setPhoto={setPhoto}
        onRemove={handleRemoveFile}
      />

      <Grid item xs={12} textAlign="end">
        <LoadingButton
          loading={loading}
          disabled={loading || !isValid}
          onClick={handleSubmit(onSubmit)}
          variant="contained"
        >
          Añadir Productos
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default AddProduct;
