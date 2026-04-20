"use client";

import { useState } from "react";
import { Box, ButtonBase, Stack } from "@mui/material";
import { CloudinaryImage } from "../../../../components/CloudinaryImage";

const ProductGallery = ({ name, files = [] }) => {
  const validFiles = files.filter((f) => f?.publicId);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeFile = validFiles[activeIdx];
  const showThumbnails = validFiles.length > 1;

  return (
    <Stack spacing={1.5}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          maxWidth: 480,
          mx: "auto",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <CloudinaryImage
          publicId={activeFile?.publicId}
          alt={name}
          fill
          crop="fit"
          quality="auto:best"
          priority
          fetchPriority="high"
          decoding="async"
          loading="eager"
          style={{ objectFit: "contain" }}
          sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 480px"
        />
      </Box>

      {showThumbnails && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ mx: "auto", flexWrap: "wrap", justifyContent: "center" }}
        >
          {validFiles.map((file, idx) => {
            const isActive = idx === activeIdx;
            return (
              <ButtonBase
                key={file.publicId || idx}
                onClick={() => setActiveIdx(idx)}
                aria-label={`Ver imagen ${idx + 1} de ${validFiles.length}`}
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "2px solid",
                  borderColor: isActive ? "primary.main" : "divider",
                  bgcolor: "grey.50",
                  transition: "border-color 0.15s ease",
                }}
              >
                <CloudinaryImage
                  publicId={file.publicId}
                  alt={`${name} — vista ${idx + 1}`}
                  width={64}
                  height={64}
                  crop="fit"
                  style={{ objectFit: "contain", width: "100%", height: "100%" }}
                />
              </ButtonBase>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default ProductGallery;
