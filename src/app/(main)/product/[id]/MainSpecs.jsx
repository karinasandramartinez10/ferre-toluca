import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

export const MainSpecs = ({
  code,
  color,
  measureValue,
  measure,
  qualifier,
  secondaryMeasureValue,
  secondaryMeasure,
}) => {
  const rows = [
    code && { label: "SKU", value: code },
    color && { label: "Color", value: color },
    measureValue && {
      label: "Medida",
      value: `${measureValue}${measure ? ` ${measure}` : ""}`,
    },
    qualifier && { label: "Cualificador", value: qualifier },
    secondaryMeasureValue && {
      label: "Medida secundaria",
      value: `${secondaryMeasureValue}${secondaryMeasure ? ` ${secondaryMeasure}` : ""}`,
    },
  ].filter(Boolean);

  if (rows.length === 0) return null;

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Especificaciones
      </Typography>
      <Box sx={{ borderBottom: "2px solid #e53935", width: "80px", mb: 2 }} />
      <TableContainer>
        <Table size="small" aria-label="Especificaciones">
          <TableBody>
            {rows.map(({ label, value }) => (
              <TableRow key={label}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ width: "40%", fontWeight: 600, verticalAlign: "top" }}
                >
                  {label}
                </TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
