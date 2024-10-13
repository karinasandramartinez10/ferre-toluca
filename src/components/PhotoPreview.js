import { Close } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { filesize } from "filesize";

export const PhotoPreview = ({ photo, isLoading, onRemove, onSubmit }) => {

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      width="100%"
      bgcolor="primary.light" // naranja
      borderRadius={2}
      padding={2}
    >
      <Box display="flex" gap={2}>
        <Box
          display="inline-flex"
          sx={{ width: 60, height: 60 }}
          boxSizing="border-box"
          key={photo.name}
        >
          <Box
            display="flex"
            minWidth="0"
            overflow="hidden"
            width="100%"
            height="100%"
            position="relative"
          >
            <Image
              src={photo.preview}
              fill
              alt={photo.name}
              sizes="100vw"
              style={{
                objectFit: "contain",
                borderRadius: 3,
              }}
              // Revoke data uri after image is loaded
              onLoad={() => {
                URL.revokeObjectURL(photo.preview);
              }}
            />
          </Box>
        </Box>
        <Stack>
          <Typography variant="body2" fontWeight={600}>
            {photo.name}
          </Typography>
          <Typography variant="body2" fontWeight={400}>
            {filesize(photo.size, { standard: "jedec" })}
          </Typography>
        </Stack>
      </Box>
      <Close
        fontSize="small"
        onClick={onRemove}
        sx={{
          "&:hover": {
            color: "#fafbfc",
            cursor: "pointer",
            transition: "all 0.2s ease-out",
            backgroundColor: (theme) => theme.palette.primary.hover,
            borderRadius: "12px",
          },
        }}
      />
    </Box>
  );
};
