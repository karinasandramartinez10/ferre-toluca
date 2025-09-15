import React from "react";
import { FormControl, Select } from "@mui/material";

const GroupedSelect = ({
  value,
  onChange,
  children,
  dense = true,
  maxMenuHeight = 360,
  fullWidth = true,
  size = "small",
  sx,
  MenuProps,
}) => {
  const baseMenuProps = {
    PaperProps: { sx: { maxHeight: maxMenuHeight, overflowY: "auto" } },
    MenuListProps: { sx: { py: 0 } },
    ...MenuProps,
  };

  const selectSx = {
    background: "#FFF",
    ...(dense && { "& .MuiSelect-select": { fontSize: 14, py: 1 } }),
    ...sx,
  };

  return (
    <FormControl sx={{ minWidth: 120 }} size={size} fullWidth={fullWidth}>
      <Select
        value={value ?? ""}
        onChange={onChange}
        fullWidth
        displayEmpty
        sx={selectSx}
        MenuProps={baseMenuProps}
      >
        {children}
      </Select>
    </FormControl>
  );
};

export default GroupedSelect;
