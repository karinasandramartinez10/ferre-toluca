"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Chip,
  Paper,
  Divider,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import Papa from "papaparse";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { postBulkCSV } from "../../../../api/admin";
import { getApiErrorMessage } from "../../../../utils/apiError";
import { BulkCSVPreview } from "./BulkCSVPreview";

const BulkCSVUpload = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const handleRemoveCSV = () => {
    setCsvFile(null);
    setPreviewRows([]);
    setResult(null);
    setErrors([]);
  };

  const handleImageDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      if (fileRejections.length >= 1) {
        enqueueSnackbar("El tamaño de imagen no debe ser mayor a 5MB", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
        return;
      }
      const file = acceptedFiles[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    },
    [enqueueSnackbar]
  );

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleCSVDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!file.name.endsWith(".csv")) {
        enqueueSnackbar("Solo se permiten archivos .csv", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
        return;
      }

      setCsvFile(file);
      setResult(null);
      setErrors([]);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setPreviewRows(results.data);
        },
        error: () => {
          enqueueSnackbar("Error al parsear el archivo CSV", {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "right" },
          });
        },
      });
    },
    [enqueueSnackbar]
  );

  const { getRootProps: getCSVRootProps, getInputProps: getCSVInputProps } = useDropzone({
    accept: { "text/csv": [".csv"] },
    multiple: false,
    onDrop: handleCSVDrop,
  });

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
      "image/webp": [".webp"],
    },
    multiple: false,
    onDrop: handleImageDrop,
    maxSize: 5242880,
  });

  const handleSubmit = async () => {
    if (!csvFile) {
      enqueueSnackbar("Debes seleccionar un archivo CSV", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    setLoading(true);
    setResult(null);
    setErrors([]);

    try {
      const formData = new FormData();
      formData.append("csv", csvFile);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const resp = await postBulkCSV(formData);
      const data = resp.data;

      setResult({
        message: data.message || "Productos importados correctamente",
        count: data.count || data.products?.length || 0,
      });

      enqueueSnackbar(
        `${data.count || data.products?.length || 0} producto(s) importado(s) exitosamente`,
        {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: { vertical: "top", horizontal: "right" },
        }
      );

      setCsvFile(null);
      setPreviewRows([]);
      handleRemoveImage();
    } catch (error) {
      const response = error.response;

      if (response?.status === 400 && response.data?.validationErrors) {
        setErrors(response.data.validationErrors);
      } else {
        const message = getApiErrorMessage(error);
        enqueueSnackbar(message || "Error al importar productos", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCsvFile(null);
    setPreviewRows([]);
    handleRemoveImage();
    setResult(null);
    setErrors([]);
  };

  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      {/* Paso 1 — Archivo CSV */}
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Chip label="1" size="small" color="primary" sx={{ fontWeight: 700, minWidth: 28 }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Archivo CSV
          </Typography>
          <Button
            size="small"
            variant="text"
            startIcon={<DownloadIcon />}
            href="/plantilla_bulk_csv.csv"
            download="plantilla_bulk_csv.csv"
            sx={{ textTransform: "none", ml: "auto !important" }}
          >
            Descargar plantilla
          </Button>
        </Stack>

        {!csvFile ? (
          <Box
            {...getCSVRootProps()}
            sx={(theme) => ({
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              p: 4,
              border: "2px dashed",
              borderColor: "grey.300",
              borderRadius: 2,
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: theme.palette.primary.main,
                bgcolor: "action.hover",
              },
            })}
          >
            <input {...getCSVInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 40, color: "grey.500" }} />
            <Typography variant="body2" color="text.secondary">
              Haz clic o arrastra tu archivo <b>.csv</b> aquí
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                borderRadius: 2,
                bgcolor: "grey.50",
              }}
            >
              <InsertDriveFileOutlinedIcon color="primary" />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {csvFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(csvFile.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
              <Chip
                label={`${previewRows.length} filas`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <IconButton size="small" onClick={handleRemoveCSV} color="error">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Paper>

            <BulkCSVPreview rows={previewRows} />
          </Stack>
        )}
      </Paper>

      {/* Paso 2 — Imagen opcional */}
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Chip label="2" size="small" variant="outlined" sx={{ fontWeight: 700, minWidth: 28 }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Imagen compartida
          </Typography>
          <Chip label="opcional" size="small" variant="outlined" color="default" />
        </Stack>

        {imagePreview ? (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 2,
              bgcolor: "grey.50",
            }}
          >
            <Box
              component="img"
              src={imagePreview}
              alt="Preview"
              sx={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {imageFile?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {imageFile ? (imageFile.size / 1024).toFixed(1) + " KB" : ""}
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleRemoveImage} color="error">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Paper>
        ) : (
          <Box
            {...getImageRootProps()}
            sx={(theme) => ({
              border: "2px dashed",
              borderColor: "grey.300",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: theme.palette.primary.main,
                bgcolor: "action.hover",
              },
              background: "white",
            })}
          >
            <input {...getImageInputProps()} />
            <Stack alignItems="center" gap={1}>
              <Image src="/photos-filled-svgrepo-com.svg" alt="upload" width={36} height={36} />
              <Typography variant="body2" color="text.secondary">
                Arrastra o selecciona una imagen
              </Typography>
              <Typography variant="caption" color="text.disabled">
                JPG, PNG o WebP — máx. 5 MB
              </Typography>
            </Stack>
          </Box>
        )}
      </Paper>

      {/* Resultado exitoso */}
      {result && (
        <Alert severity="success" icon={<CheckCircleOutlineIcon />}>
          <Typography variant="body2">
            {result.message} — <b>{result.count}</b> producto
            {result.count !== 1 ? "s" : ""} creado{result.count !== 1 ? "s" : ""}.
          </Typography>
        </Alert>
      )}

      {/* Errores de validación */}
      {errors.length > 0 && (
        <Alert severity="error">
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Errores de validación ({errors.length})
          </Typography>
          <List dense disablePadding sx={{ maxHeight: 300, overflow: "auto" }}>
            {errors.map((err, idx) => (
              <ListItem key={idx} disablePadding sx={{ pl: 1 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      {err.row != null ? `Fila ${err.row}: ` : ""}
                      {err.message || err.error || JSON.stringify(err)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}

      {/* Acciones */}
      <Divider />
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        {(csvFile || result || errors.length > 0) && (
          <Button variant="outlined" onClick={handleReset} disabled={loading}>
            Limpiar todo
          </Button>
        )}
        <LoadingButton
          loading={loading}
          disabled={!csvFile || loading}
          variant="contained"
          size="large"
          onClick={handleSubmit}
        >
          Importar productos
        </LoadingButton>
      </Box>
    </Stack>
  );
};

export default BulkCSVUpload;
