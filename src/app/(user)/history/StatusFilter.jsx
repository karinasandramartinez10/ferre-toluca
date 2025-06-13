import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { STATUS_OPTIONS } from "./constants/statusOptions";

export const StatusFilter = ({ value, onChange }) => (
  <FormControl
    size="small"
    sx={{ width: { xs: "100%", md: 220 }, backgroundColor: "#fff" }}
  >
    <InputLabel id="filter-status-label" shrink>
      Estado
    </InputLabel>
    <Select
      labelId="filter-status-label"
      value={value}
      label="Estado"
      onChange={onChange}
      displayEmpty
      renderValue={(selected) => {
        if (selected === "") {
          return STATUS_OPTIONS.find((o) => o.value === "")?.label;
        }
        return STATUS_OPTIONS.find((o) => o.value === selected)?.label;
      }}
    >
      {STATUS_OPTIONS.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
