import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { STEPS } from "../../../../../constants/quotes/status";

const USER_STEPS = [{ value: "", label: "Todas" }, ...STEPS];

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
          return USER_STEPS.find((o) => o.value === "")?.label;
        }
        return USER_STEPS.find((o) => o.value === selected)?.label;
      }}
    >
      {USER_STEPS.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
