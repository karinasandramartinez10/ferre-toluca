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
import { toCapitalizeFirstLetter } from "../../../../utils/cases";
import { postProduct } from "../../../../api/admin";
import { getBrands } from "../../../../api/brand";
import { getCategories } from "../../../../api/category";
import { getSubcategories } from "../../../../api/subcategories";
import { validateRows } from "./helpers";
import { ProductTable } from "./ProductTable";
import AddProductFields from "./AddProductFields";
import { getProductTypes } from "../../../../api/productTypes";

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
  subCategoryId: yup.string().required("La subcategoría es requerida"),
});

const initialRows = [
  {
    id: uuidv4(),
    name: "",
    description: "",
    code: "",
    specifications: "",
  },
];

const AddProduct = ({ user }) => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [types, setTypes] = useState([]);
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

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const brandsData = await getBrands();
        const categoriesData = await getCategories();
        const subcategoriesData = await getSubcategories();
        const typesData = await getProductTypes();
        setBrands(brandsData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setTypes(typesData);
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
    console.log(values);
    if (!validateRows(rows)) {
      enqueueSnackbar("Debes completar todos los campos de los productos", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
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
      if (values.hasType && values.typeId) {
        requestBody.append("typeId", values.typeId);
      }

      rows.forEach((product, index) => {
        requestBody.append(
          `products[${index}][name]`,
          product.name ? toCapitalizeFirstLetter(product.name.trim()) : ""
        );
        requestBody.append(
          `products[${index}][description]`,
          product.description
            ? toCapitalizeFirstLetter(product.description)
            : ""
        );
        requestBody.append(
          `products[${index}][code]`,
          product.code ? product.code.toUpperCase() : ""
        );
        requestBody.append(
          `products[${index}][specifications]`,
          product.specifications
            ? toCapitalizeFirstLetter(product.specifications)
            : ""
        );
        requestBody.append(
          `products[${index}][color]`,
          product.color ? toCapitalizeFirstLetter(product.color.trim()) : ""
        );
        requestBody.append(
          `products[${index}][size]`,
          product.size ? product.size : ""
        );
      });

      await postProduct(requestBody, user.access_token);
      enqueueSnackbar("Producto(s) añadido(s) exitósamente", {
        variant: "success",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      reset();
      handleRemoveFile();
      setRows(initialRows);
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

  const hasType = watch("hasType");

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
      <AddProductFields
        brands={brands}
        categories={categories}
        subcategories={subcategories}
        types={types}
        control={control}
        hasType={hasType}
      />

      <ProductTable
        rows={rows}
        setRows={setRows}
        rowModesModel={rowModesModel}
        setRowModesModel={setRowModesModel}
        handleDeleteClick={handleDeleteClick}
        processRowUpdate={processRowUpdate}
        handleRowModesModelChange={handleRowModesModelChange}
      />

      <Dropzone
        unregister={unregister}
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
          // disabled={!isValid}
          loading={loading}
          onClick={handleSubmit(onSubmit)}
        >
          Añadir Productos
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default AddProduct;
