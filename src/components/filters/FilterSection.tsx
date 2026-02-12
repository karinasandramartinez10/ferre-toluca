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
import type { FilterOption } from "../../types/filters";

interface FilterSectionProps {
  title: string;
  options?: FilterOption[];
  selectedIds?: (number | string)[];
  onToggle: (id: number | string) => void;
  defaultExpanded?: boolean;
  showSearch?: boolean;
  disabled?: boolean;
}

const FilterSection = ({
  title,
  options = [],
  selectedIds = [],
  onToggle,
  defaultExpanded = true,
  showSearch = false,
  disabled = false,
}: FilterSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = showSearch
    ? options.filter((opt) => opt.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
      <AccordionDetails sx={{ p: 0 }}>
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
