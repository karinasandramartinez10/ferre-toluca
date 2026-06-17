import { MenuItem, Select } from "@mui/material";

const FilterSelect = ({ value, onChange, options, minWidth = 180 }) => (
  <Select
    value={value}
    size="small"
    displayEmpty
    onChange={(e) => onChange(e.target.value)}
    sx={{ minWidth }}
  >
    {options.map((opt) => (
      <MenuItem key={opt.value || "all"} value={opt.value}>
        {opt.label}
      </MenuItem>
    ))}
  </Select>
);

export default FilterSelect;
