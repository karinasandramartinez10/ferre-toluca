"use client";

import { Box, IconButton, Stack, Typography, Paper } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Image from "next/image";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import { filesize } from "filesize";

export const Dropzone = ({
  text = "Arrastra o escoge un archivo",
  preview,
  setValue,
  onRemove,
  photo,
  setPhoto,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleDrop = (acceptedFiles, fileRejections) => {
    const file = acceptedFiles[0];

    if (fileRejections.length >= 1) {
      enqueueSnackbar("El tamaño de imagen no debe ser mayor a 5MB", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      return;
    }

    const photoWithPreview = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    setPhoto(photoWithPreview);
    setValue("image", file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
      "image/webp": [".webp"],
    },
    multiple: false,
    onDrop: handleDrop,
    maxSize: 5242880,
  });

  if (preview && photo) {
    const isBlob = photo.preview?.startsWith("blob:");
    const sizeText = photo.size ? filesize(photo.size, { standard: "jedec" }) : "";

    return (
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
          sx={{
            width: 72,
            height: 72,
            position: "relative",
            flexShrink: 0,
          }}
        >
          <Image
            src={photo.preview}
            fill
            alt={photo.name || "imagen"}
            sizes="72px"
            style={{
              objectFit: "contain",
              borderRadius: 6,
            }}
            onLoad={() => {
              if (isBlob) {
                URL.revokeObjectURL(photo.preview);
              }
            }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {photo.name || "Imagen actual"}
          </Typography>
          {sizeText && (
            <Typography variant="caption" color="text.secondary">
              {sizeText}
            </Typography>
          )}
        </Box>
        <IconButton size="small" onClick={onRemove} color="error">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Paper>
    );
  }

  return (
    <Box
      {...getRootProps({ className: "dropzone" })}
      sx={(theme) => ({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "2px dashed",
        borderColor: "grey.300",
        borderRadius: 2,
        width: "100%",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          bgcolor: "action.hover",
        },
        background: "white",
      })}
      component="section"
    >
      <input {...getInputProps()} />
      <Stack alignItems="center" gap={1} width="100%" padding={{ xs: 4 }}>
        <Image src="/photos-filled-svgrepo-com.svg" alt="upload" width={36} height={36} />
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          JPG, PNG o WebP — máx. 5 MB
        </Typography>
      </Stack>
    </Box>
  );
};
