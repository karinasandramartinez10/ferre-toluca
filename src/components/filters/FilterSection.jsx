"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { toCapitalizeWords } from "../../utils/cases";

/**
 * Sección de filtro con checkboxes colapsable.
 *
 * @param {Object} props
 * @param {string} props.title - Título de la sección.
 * @param {Array} props.options - Opciones disponibles [{id, name, count}].
 * @param {Array} props.selectedIds - IDs seleccionados.
 * @param {Function} props.onToggle - Callback al toggle un ID.
 * @param {boolean} props.defaultExpanded - Si está expandido por defecto.
 * @param {boolean} props.showSearch - Mostrar campo de búsqueda.
 * @param {boolean} props.disabled - Deshabilitar la sección.
 */
const FilterSection = ({
  title,
  options = [],
  selectedIds = [],
  onToggle,
  defaultExpanded = true,
  showSearch = false,
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = showSearch
    ? options.filter((opt) =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedCount = selectedIds.length;

  if (options.length === 0) return null;

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disabled={disabled}
      disableGutters
      elevation={0}
      sx={{
        "&:before": { display: "none" },
        backgroundColor: "transparent",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          minHeight: "auto",
          px: 0,
          "& .MuiAccordionSummary-content": { my: 0.5 },
        }}
      >
        <Typography variant="subtitle2" fontWeight={600}>
          {title}
          {selectedCount > 0 && (
            <Box
              component="span"
              sx={{
                ml: 1,
                px: 1,
                py: 0.25,
                borderRadius: 1,
                backgroundColor: "primary.main",
                color: "white !important",
                fontSize: "0.75rem",
              }}
            >
              {selectedCount}
            </Box>
          )}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0}}>
        {showSearch && options.length > 5 && (
          <TextField
            size="small"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        )}
        <FormGroup>
          {filteredOptions.map((option) => (
            <FormControlLabel
              key={option.id}
              control={
                <Checkbox
                  size="small"
                  checked={selectedIds.includes(option.id)}
                  onChange={() => onToggle(option.id)}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  {toCapitalizeWords(option.name)}
                  {option.count !== undefined && (
                    <Box component="span" sx={{ ml: 0.5, color: "text.disabled" }}>
                      ({option.count})
                    </Box>
                  )}
                </Typography>
              }
              sx={{ ml: 0, mr: 0 }}
            />
          ))}
        </FormGroup>
        {showSearch && filteredOptions.length === 0 && (
          <Typography variant="body2" color="text.disabled" sx={{ py: 1 }}>
            No se encontraron resultados
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default FilterSection;
