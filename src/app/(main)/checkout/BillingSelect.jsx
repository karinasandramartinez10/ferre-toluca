"use client";

import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Skeleton,
  Stack,
} from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { memo } from "react";
import { buildFiscalSecondaryText } from "../../../utils/fiscal";

const LoadingState = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
    <Skeleton variant="rounded" height={56} />
    <Skeleton variant="rounded" height={56} />
  </Box>
);

const EmptyState = ({ onCreate }) => (
  <Stack gap={1} mt={2}>
    <Typography variant="h4">
      Datos de facturación
    </Typography>
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
        borderStyle: "dashed",
        cursor: "pointer",
      }}
      onClick={onCreate}
      aria-label="Agregar datos de facturación"
    >
      <AddCircleOutline color="primary" />
      <Typography>Agregar datos de facturación</Typography>
    </Paper>
    <Typography
      variant="caption"
      sx={{ mt: 1, color: "text.secondary", display: "block" }}
    >
      Aún no has agregado datos de facturación. Crea uno para continuar.
    </Typography>
  </Stack>
);

const OptionLabel = ({ profile }) => {
  const secondary = buildFiscalSecondaryText(profile);
  return (
    <Box>
      <Typography sx={{ display: "block" }}>
        {profile.fiscalName} — RFC: {profile.rfc}
      </Typography>
      {secondary && (
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {secondary}
        </Typography>
      )}
    </Box>
  );
};

const ADD_OPTION_VALUE = "__add_new_fiscal__";

const SelectState = ({ profiles, selectedId, onChange, onOpenCreate }) => (
  <FormControl fullWidth>
    <InputLabel id="fiscal-select-label">Datos de facturación</InputLabel>
    <Select
      labelId="fiscal-select-label"
      label="Datos de facturación"
      value={selectedId ?? ""}
      onChange={(e) => {
        const value = e.target.value;
        if (value === ADD_OPTION_VALUE) {
          onOpenCreate();
          return;
        }
        onChange(value);
      }}
      size="small"
    >
      {profiles.map((p) => (
        <MenuItem key={p.id} value={p.id}>
          <OptionLabel profile={p} />
        </MenuItem>
      ))}
      <MenuItem
        value={ADD_OPTION_VALUE}
        sx={{ color: "primary.main", fontWeight: 600 }}
      >
        + Agregar nuevo
      </MenuItem>
    </Select>
    {!selectedId && (
      <FormHelperText error>
        Selecciona un registro o crea uno para continuar.
      </FormHelperText>
    )}
  </FormControl>
);

const BillingSelect = ({
  loading,
  profiles,
  selectedId,
  onChange,
  onOpenCreate,
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (profiles.length === 0) {
    return <EmptyState onCreate={onOpenCreate} />;
  }

  return (
    <Stack gap={1} mt={2}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Datos de facturación
      </Typography>
      <SelectState
        profiles={profiles}
        selectedId={selectedId}
        onChange={onChange}
        onOpenCreate={onOpenCreate}
      />
    </Stack>
  );
};

export default memo(BillingSelect);
