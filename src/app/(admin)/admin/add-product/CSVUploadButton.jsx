"use client";

import { UploadFile } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Grid, Stack, Typography } from "@mui/material";

const CSVUploadButton = ({ onCSVParsed }) => {
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const Papa = (await import("papaparse")).default;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        onCSVParsed(results.data);
      },
    });
  };

  return (
    <Grid item xs={12}>
      <Typography fontWeight={600} mb={1}>
        O importa tus productos desde un archivo CSV:
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          color="inherit"
          href="/plantilla_upload_products.csv"
          download
        >
          Descarga la plantilla
        </Button>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="csv-upload"
        />
        <label htmlFor="csv-upload">
          <LoadingButton
            component="span"
            variant="contained"
            color="secondary"
            startIcon={<UploadFile />}
          >
            Importa desde CSV
          </LoadingButton>
        </label>
      </Stack>
    </Grid>
  );
};

export default CSVUploadButton;
