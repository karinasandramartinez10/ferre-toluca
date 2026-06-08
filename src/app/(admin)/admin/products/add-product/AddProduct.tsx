"use client";

import { useState } from "react";
import { Box, Stack } from "@mui/material";
import { AddBox, UploadFile } from "@mui/icons-material";
import dynamic from "next/dynamic";
import MethodSelector from "../../../../../components/MethodSelector";
import AddProductSingle from "./AddProductSingle";
import { AddProductBanner } from "./AddProductBanner";

const BulkCSVUpload = dynamic(() => import("./BulkCSVUpload"), {
  ssr: false,
});

const AddProduct = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 3 }}>
        <MethodSelector
          options={[
            {
              icon: <AddBox sx={{ fontSize: 28 }} />,
              title: "Agregar producto",
              description: "Uno a la vez, con todos sus datos",
            },
            {
              icon: <UploadFile sx={{ fontSize: 28 }} />,
              title: "Carga masiva (CSV)",
              description: "Muchos productos desde un archivo",
            },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
      </Box>

      {activeTab === 0 && <AddProductSingle />}

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
