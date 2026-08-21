"use client";

import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Close, SearchOutlined } from "@mui/icons-material";

const ProductSearchField = ({ value, onChange, onClear }) => (
  <TextField
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Buscar por nombre, código o marca"
    size="small"
    sx={{ width: { xs: "100%", sm: 360 } }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchOutlined fontSize="small" sx={{ color: "text.secondary" }} />
        </InputAdornment>
      ),
      endAdornment: value ? (
        <InputAdornment position="end">
          <IconButton onClick={onClear} size="small" aria-label="Limpiar búsqueda">
            <Close fontSize="small" />
          </IconButton>
        </InputAdornment>
      ) : null,
    }}
  />
);

export default ProductSearchField;
