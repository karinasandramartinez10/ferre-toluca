"use client";
import { Grid, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Dropzone } from "../../../components/Dropzone";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { addProduct } from "../../../api/admin";
import { useSession } from "next-auth/react";
import { toCapitalizeFirstLetter } from "../../../utils/cases";
import { useState } from "react";

const defaultFormValues = {
  name: "",
  description: "",
  image: null,
  code: "",
  specifications: "",
};

const ProductSchema = yup.object().shape({
  name: yup.string().required("El nombre es requerido"),
  description: yup.string().required("La descripción es requerida"),
  code: yup.string().required("El código es requerido"),
  specifications: yup.string().required("Las características son requeridas"),
});

export const Uploader = () => {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);

  const { data } = useSession();

  const {
    control,
    handleSubmit,
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

  const handleRemoveFile = () => {
    unregister("image");
    URL.revokeObjectURL(photo?.preview);
    setPhoto(null);
  };

  const onSubmit = async (values) => {
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
      requestBody.append("name", toCapitalizeFirstLetter(values.name));
      requestBody.append(
        "description",
        toCapitalizeFirstLetter(values.description)
      );
      requestBody.append("code", values.code.toUpperCase());
      requestBody.append(
        "specifications",
        toCapitalizeFirstLetter(values.specifications)
      );

      await addProduct(requestBody, data.user.access_token);
      enqueueSnackbar("Producto añadido exitósamente", {
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

  return (
    <Grid
      container
      width="100%"
      gap={2}
      flexDirection="row"
      justifyContent="center"
      sx={{
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "center", sm: "flex-start" },
      }}
    >
      <Stack gap={1} width="100%">
        <Typography fontWeight={600}>Nombre</Typography>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              label=""
              fullWidth
              error={invalid}
              helperText={error?.message && error.message}
              variant="outlined"
              inputProps={{
                form: {
                  autocomplete: "off",
                },
                style: {
                  textTransform: "capitalize",
                },
              }}
              InputProps={{
                sx: {
                  borderRadius: "8px",
                  background: "#FFF",
                },
              }}
              {...field}
            />
          )}
        />
      </Stack>
      <Stack gap={1} width="100%">
        <Typography fontWeight={600}>Descripción</Typography>
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              label=""
              multiline
              fullWidth
              error={invalid}
              helperText={error?.message && error.message}
              variant="outlined"
              rows={4}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
                style: {
                  textTransform: "capitalize",
                },
              }}
              InputProps={{
                style: { textTransform: "capitalize" },
                sx: {
                  borderRadius: "8px",
                  background: "#FFF",
                },
              }}
              {...field}
            />
          )}
        />
      </Stack>
      <Stack gap={1} width="100%">
        <Typography fontWeight={600}>Código</Typography>
        <Controller
          control={control}
          name="code"
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              label=""
              fullWidth
              error={invalid}
              helperText={error?.message && error.message}
              variant="outlined"
              inputProps={{
                form: {
                  autocomplete: "off",
                },
                style: {
                  textTransform: "capitalize",
                },
              }}
              InputProps={{
                style: { textTransform: "capitalize" },
                sx: {
                  borderRadius: "8px",
                  background: "#FFF",
                },
              }}
              {...field}
            />
          )}
        />
      </Stack>
      <Stack gap={1} width="100%">
        <Typography fontWeight={600}>Características</Typography>
        <Controller
          control={control}
          name="specifications"
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              label=""
              fullWidth
              error={invalid}
              helperText={error?.message && error.message}
              variant="outlined"
              inputProps={{
                form: {
                  autocomplete: "off",
                },
                style: {
                  textTransform: "capitalize",
                },
              }}
              InputProps={{
                style: { textTransform: "capitalize" },
                sx: {
                  borderRadius: "8px",
                  background: "#FFF",
                },
              }}
              {...field}
            />
          )}
        />
      </Stack>
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
          disabled={!isValid}
          loading={loading}
          onClick={handleSubmit(onSubmit)}
        >
          Añadir
        </LoadingButton>
      </Grid>
    </Grid>
  );
};
