"use client";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dropzone } from "../../../../components/Dropzone";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import { Add, Delete } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { toCapitalizeFirstLetter } from "../../../../utils/cases";
import { postProduct } from "../../../../api/admin";
import { getBrands } from "../../../../api/brand";
import { validateRows } from "./helpers";

const defaultFormValues = {
  brandId: "",
  category: "",
  hasSubCategory: "no",
  subCategory: "",
};

const ProductSchema = yup.object().shape({
  brandId: yup.string().required("La marca es requerida"),
  category: yup.string().required("La categoría es requerida"),
});

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = uuidv4();
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        name: "",
        description: "",
        code: "",
        specifications: "",
        color: "",
        size: "",
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button
        sx={{ marginBottom: "8px" }}
        color="primary"
        startIcon={<Add />}
        onClick={handleClick}
      >
        Agregar
      </Button>
    </GridToolbarContainer>
  );
}

const AddProduct = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [rows, setRows] = useState([
    {
      id: uuidv4(),
      name: "",
      description: "",
      code: "",
      specifications: "",
    },
  ]);
  const [rowModesModel, setRowModesModel] = useState({});

  const { data } = useSession();

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
    const fetchBrands = async () => {
      try {
        const brandsData = await getBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
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
    // console.log(values);

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
      requestBody.append("category", values.category);
      requestBody.append("subCategory", values.subCategory);
      rows.forEach((product, index) => {
        requestBody.append(
          `products[${index}][name]`,
          toCapitalizeFirstLetter(product.name.trim())
        );
        requestBody.append(
          `products[${index}][description]`,
          toCapitalizeFirstLetter(product.description.trim())
        );
        requestBody.append(
          `products[${index}][code]`,
          product.code.toUpperCase()
        );
        requestBody.append(
          `products[${index}][specifications]`,
          toCapitalizeFirstLetter(product.specifications.trim())
        );
        requestBody.append(
          `products[${index}][color]`,
          toCapitalizeFirstLetter(product.color.trim())
        );
        requestBody.append(`products[${index}][size]`, product.size.trim());
      });

      console.log(requestBody);

      await postProduct(requestBody, data.user.access_token);
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

  const hasSubCategory = watch("hasSubCategory");

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
      <Stack gap={1} width="100%">
        <Typography fontWeight={600}>Selecciona una marca</Typography>
        <Controller
          control={control}
          name="brandId"
          render={({ field }) => (
            <FormControl sx={{ minWidth: 120 }} size="small">
              <Select {...field} fullWidth sx={{ background: "#FFF" }}>
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Typography fontWeight={600}>Selecciona una categoría</Typography>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <TextField {...field} label="Categoría" fullWidth size="small" />
          )}
        />

        <Typography fontWeight={600}>¿Tiene subcategoría?</Typography>
        <Controller
          control={control}
          name="hasSubCategory"
          render={({ field }) => (
            <FormControl component="fieldset">
              <RadioGroup {...field} row>
                <FormControlLabel value="yes" control={<Radio />} label="Sí" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          )}
        />

        {hasSubCategory === "yes" && (
          <Controller
            control={control}
            name="subCategory"
            render={({ field }) => (
              <TextField
                {...field}
                label="Subcategoría"
                fullWidth
                size="small"
              />
            )}
          />
        )}
      </Stack>

      <Box
        sx={{
          height: 500,
          width: "100%",
        }}
      >
        <DataGrid
          rows={rows}
          columns={[
            { field: "name", headerName: "Nombre", width: 150, editable: true },
            { field: "code", headerName: "Código", width: 100, editable: true },
            {
              field: "description",
              headerName: "Descripción",
              width: 150,
              editable: true,
            },
            { field: "color", headerName: "Color", width: 150, editable: true },
            { field: "size", headerName: "Tamaño", width: 150, editable: true },
            {
              field: "specifications",
              headerName: "Características",
              width: 150,
              editable: true,
            },
            {
              field: "actions",
              type: "actions",
              headerName: "Acciones",
              cellClassName: "actions",
              getActions: ({ id }) => {
                return [
                  <GridActionsCellItem
                    icon={<Delete />}
                    label="Delete"
                    onClick={handleDeleteClick(id)}
                    color="inherit"
                  />,
                ];
              },
            },
          ]}
          editMode="row"
          // pageSize={5}
          // rowsPerPageOptions={[5]}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </Box>

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
