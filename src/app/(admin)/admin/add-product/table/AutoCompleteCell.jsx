import { Autocomplete, TextField } from "@mui/material";
import {
  commonCellSx,
  commonInputInnerProps,
  commonInputProps,
} from "./styles";

export const AutocompleteCell = ({ params, productModels, setRows }) => {
  const currentModelId = params.row.modelId;
  const currentModelName = params.row.modelName || "";

  const modelValue = productModels.find((m) => m.id === currentModelId);
  const inputValue = modelValue ? modelValue.name : currentModelName;

  const handleChange = (event, newValue) => {
    if (!newValue) return;

    const isCustom = typeof newValue === "string";
    const modelName = isCustom ? newValue : newValue.name;
    const modelId = isCustom ? null : newValue.id;

    const updatedRow = {
      ...params.row,
      modelName,
      modelId,
    };

    setRows((prevRows) =>
      prevRows.map((r) => (r.id === params.row.id ? updatedRow : r))
    );
  };

  const handleInputChange = (event, newInputValue) => {
    const updatedRow = {
      ...params.row,
      modelName: newInputValue,
    };

    setRows((prevRows) =>
      prevRows.map((r) => (r.id === params.row.id ? updatedRow : r))
    );
  };

  return (
    <Autocomplete
      freeSolo
      disableClearable
      options={productModels}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.name
      }
      value={inputValue}
      onChange={handleChange}
      onInputChange={handleInputChange}
      renderInput={(paramsInput) => (
        <TextField
          {...paramsInput}
          variant="standard"
          placeholder="Modelo"
          onKeyDown={(e) => e.stopPropagation()}
          InputProps={{
            ...paramsInput.InputProps,
            ...commonInputProps,
          }}
          inputProps={{
            ...paramsInput.inputProps,
            ...commonInputInnerProps,
          }}
        />
      )}
      sx={{
        ...commonCellSx,
        width: "100%",
        "& .MuiFormControl-root": {
          height: "100%",
        },
        "& input": {
          height: "100%",
          padding: "0px 8px",
          boxSizing: "border-box",
        },
        "& fieldset": {
          border: "none",
        },
      }}
    />
  );
};
