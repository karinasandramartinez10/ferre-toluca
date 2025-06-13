import { Search } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const SearchFilter = ({ initialValue, onSearch }) => {
  const [input, setInput] = useState(initialValue);
  const trigger = () => onSearch(input);

  return (
    <TextField
      size="small"
      label="Buscar por orden"
      placeholder="000005"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && trigger()}
      sx={{ minWidth: 300, backgroundColor: "#fff" }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ pl: 1 }}>
            <Typography sx={{ fontWeight: 500, color: "text.secondary" }}>
              ORD-
            </Typography>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={trigger} edge="end" size="small">
              <Search />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchFilter;
