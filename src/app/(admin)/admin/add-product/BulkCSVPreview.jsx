"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  Stack,
} from "@mui/material";

const PRIORITY_COLUMNS = [
  "Nombre",
  "name",
  "Código",
  "code",
  "Marca",
  "brand",
  "Categoría",
  "category",
  "Subcategoría",
  "subcategory",
  "Tipo",
  "type",
  "Modelo",
  "model",
  "Descripción",
  "description",
];

const MAX_PREVIEW_ROWS = 5;
const MAX_COLUMNS = 7;

export const BulkCSVPreview = ({ rows }) => {
  if (!rows || rows.length === 0) return null;

  const allKeys = Object.keys(rows[0]);
  const orderedKeys = [];
  for (const col of PRIORITY_COLUMNS) {
    if (allKeys.includes(col) && !orderedKeys.includes(col)) {
      orderedKeys.push(col);
    }
  }
  for (const key of allKeys) {
    if (!orderedKeys.includes(key)) {
      orderedKeys.push(key);
    }
  }
  const columns = orderedKeys.slice(0, MAX_COLUMNS);
  const hiddenColumns = allKeys.length - columns.length;

  const previewRows = rows.slice(0, MAX_PREVIEW_ROWS);
  const remaining = rows.length - MAX_PREVIEW_ROWS;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary">
          VISTA PREVIA
        </Typography>
        <Chip
          label={`${rows.length} filas`}
          size="small"
          color="success"
          variant="outlined"
          sx={{ height: 20, fontSize: "0.7rem" }}
        />
        {hiddenColumns > 0 && (
          <Chip
            label={`+${hiddenColumns} columnas ocultas`}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
        )}
      </Stack>
      <TableContainer
        sx={{ maxHeight: 280, borderRadius: 1, border: "1px solid", borderColor: "grey.200" }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  bgcolor: "grey.50",
                  color: "text.secondary",
                  py: 0.75,
                  width: 40,
                }}
              >
                #
              </TableCell>
              {columns.map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    bgcolor: "grey.50",
                    color: "text.secondary",
                    py: 0.75,
                    whiteSpace: "nowrap",
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {previewRows.map((row, idx) => (
              <TableRow key={idx} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                <TableCell sx={{ color: "text.disabled", py: 0.75, fontSize: "0.8rem" }}>
                  {idx + 1}
                </TableCell>
                {columns.map((col) => (
                  <TableCell
                    key={col}
                    sx={{
                      maxWidth: 180,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      py: 0.75,
                      fontSize: "0.8rem",
                    }}
                  >
                    {row[col] || (
                      <Typography component="span" variant="caption" color="text.disabled">
                        —
                      </Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {remaining > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
          ...y {remaining} fila{remaining !== 1 ? "s" : ""} más
        </Typography>
      )}
    </Box>
  );
};
