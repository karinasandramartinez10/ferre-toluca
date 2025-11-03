"use client";

import {
  Grid,
  MenuItem,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export default function FiscalForm({
  defaults,
  schema,
  taxRegimes,
  cfdiUses,
  onSubmit,
  submitting,
  onCancel,
  hideIsDefault = false,
}) {
  const {
    control,
    handleSubmit,
  } = useForm({
    defaultValues: defaults,
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const submitHandler = handleSubmit((vals) => {
    onSubmit?.(vals);
  });

  return (
    <Box component="form" onSubmit={submitHandler}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="fiscalName"
            render={({ field, fieldState }) => (
              <TextField
                label="Razón social"
                fullWidth
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                {...field}
                disabled={submitting}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="rfc"
            render={({ field, fieldState }) => (
              <TextField
                label="RFC"
                fullWidth
                inputProps={{ style: { textTransform: "uppercase" } }}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                {...field}
                disabled={submitting}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="taxZipCode"
            render={({ field, fieldState }) => (
              <TextField
                label="Código Postal"
                fullWidth
                inputProps={{ inputMode: "numeric", maxLength: 5 }}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                {...field}
                disabled={submitting}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="taxRegimeId"
            render={({ field, fieldState }) => (
              <TextField
                select
                label="Régimen fiscal"
                fullWidth
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
                disabled={submitting}
              >
                <MenuItem value="">Selecciona una opción</MenuItem>
                {taxRegimes.map((r) => (
                  <MenuItem key={r.id ?? r.code} value={r.id}>
                    {r.code} - {r.description}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="defaultCfdiUseId"
            render={({ field }) => (
              <TextField
                select
                label="Uso CFDI (opcional)"
                fullWidth
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(e.target.value ? Number(e.target.value) : null)
                }
                disabled={submitting}
              >
                <MenuItem value="">Sin seleccionar</MenuItem>
                {cfdiUses.map((u) => (
                  <MenuItem key={u.id ?? u.code} value={u.id}>
                    {u.code} - {u.description}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        {!hideIsDefault && (
          <Grid item xs={12}>
            <Controller
              control={control}
              name="isDefault"
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(field.value)}
                      onChange={(e) => field.onChange(e.target.checked)}
                      disabled={submitting}
                    />
                  }
                  label="Marcar como predeterminado"
                />
              )}
            />
          </Grid>
        )}
      </Grid>
      <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <LoadingButton type="submit" variant="contained" loading={submitting}>
          Guardar
        </LoadingButton>
      </Box>
    </Box>
  );
}
