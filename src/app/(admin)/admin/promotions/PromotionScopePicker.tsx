"use client";

import { Autocomplete, MenuItem, Stack, TextField } from "@mui/material";
import usePromotionScopeOptions from "../../../../hooks/admin/usePromotionScopeOptions";
import useProductSearch from "../../../../hooks/admin/useProductSearch";
import { SCOPE_KINDS } from "../../../../constants/promotions";
import type { PromotionScopeType, ScopeOption } from "../../../../types/promotion";

interface PromotionScopePickerProps {
  scopeKind: PromotionScopeType;
  scopeOption: ScopeOption | null;
  onKindChange: (kind: PromotionScopeType) => void;
  onOptionChange: (value: ScopeOption | null) => void;
  disabled?: boolean;
  error?: string;
}

const PromotionScopePicker = ({
  scopeKind,
  scopeOption,
  onKindChange,
  onOptionChange,
  disabled,
  error,
}: PromotionScopePickerProps) => {
  const { options } = usePromotionScopeOptions();
  const { options: productOptions, searching, search } = useProductSearch();

  const isProduct = scopeKind === "product";
  const currentOptions = isProduct ? productOptions : (options[scopeKind] ?? []);

  return (
    <Stack spacing={2}>
      <TextField
        select
        label="Tipo de alcance"
        value={scopeKind}
        disabled={disabled}
        onChange={(e) => onKindChange(e.target.value as PromotionScopeType)}
      >
        {SCOPE_KINDS.map((k) => (
          <MenuItem key={k.value} value={k.value}>
            {k.label}
          </MenuItem>
        ))}
      </TextField>

      <Autocomplete
        disabled={disabled}
        options={currentOptions}
        value={scopeOption}
        getOptionLabel={(o) => o?.label ?? ""}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        onChange={(_e, value) => onOptionChange(value)}
        onInputChange={isProduct ? (_e, query) => search(query) : undefined}
        loading={isProduct && searching}
        noOptionsText={isProduct ? "Escribe para buscar un producto" : "Sin opciones"}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Alcance de la promoción"
            error={!!error}
            helperText={error}
          />
        )}
      />
    </Stack>
  );
};

export default PromotionScopePicker;
