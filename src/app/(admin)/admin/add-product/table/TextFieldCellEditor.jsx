import { TextField } from "@mui/material";
import {
  commonCellSx,
  commonInputInnerProps,
  commonInputProps,
} from "./styles";

export const TextFieldCellEditor = ({
  params,
  placeholder = "",
  type = "text",
}) => {
  return (
    <TextField
      fullWidth
      variant="standard"
      type={type}
      placeholder={placeholder}
      defaultValue={params.value || ""}
      onChange={(e) => {
        const newValue = e.target.value;
        params.api.setEditCellValue(
          { id: params.id, field: params.field, value: newValue },
          e
        );
      }}
      InputProps={commonInputProps}
      inputProps={commonInputInnerProps}
      sx={commonCellSx}
    />
  );
};
