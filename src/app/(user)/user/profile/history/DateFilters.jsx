import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { es } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { Box } from "@mui/material";

const DateFilters = ({ dateFrom, dateTo, onFromChange, onToChange }) => {
  return (
    <Box display="flex" gap={2}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <DatePicker
          label="Desde"
          value={dateFrom}
          onChange={onFromChange}
          inputFormat="dd/MM/yyyy"
          maxDate={dateTo ?? new Date()}
          slotProps={{
            textField: {
              size: "small",
              sx: { minWidth: 140, backgroundColor: "#fff" },
            },
          }}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <DatePicker
          label="Hasta"
          value={dateTo}
          onChange={onToChange}
          inputFormat="dd/MM/yyyy"
          minDate={dateFrom}
          maxDate={new Date()}
          slotProps={{
            textField: {
              size: "small",
              sx: { minWidth: 140, backgroundColor: "#fff" },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default DateFilters;
