"use client";

import { Controller } from "react-hook-form";
import {
  Box,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { MONTHS, PROMOTION_TYPE_OPTIONS } from "../../../../constants/promotions";

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

const numberField = (name, label, control, errors, helper) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        value={field.value ?? ""}
        type="number"
        label={label}
        fullWidth
        error={!!errors[name]}
        helperText={errors[name]?.message || helper}
      />
    )}
  />
);

const PromotionFields = ({ control, errors, type, typeDisabled = false }) => (
  <>
    <Controller
      name="name"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Nombre de la promoción"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
        />
      )}
    />

    <Controller
      name="type"
      control={control}
      render={({ field }) => (
        <TextField {...field} select label="Tipo de promoción" disabled={typeDisabled} fullWidth>
          {PROMOTION_TYPE_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />

    {type === "percentage" ? (
      numberField("discountPercentage", "Porcentaje de descuento", control, errors)
    ) : (
      <>
        <Stack direction="row" spacing={2}>
          {numberField("buyQuantity", "Paga", control, errors)}
          {numberField(
            "receiveTotal",
            "Recibe en total",
            control,
            errors,
            "Ej.: paga 2, recibe 3 = 3x2"
          )}
        </Stack>
        <Controller
          name="getDiscountPercentage"
          control={control}
          render={({ field }) => (
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Las unidades de regalo, ¿gratis o a mitad de precio?
              </Typography>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={field.value}
                onChange={(_e, value) => value != null && field.onChange(value)}
              >
                <ToggleButton value={100}>Producto gratis</ToggleButton>
                <ToggleButton value={50}>Mitad de precio</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}
        />
      </>
    )}

    <Stack direction="row" spacing={2}>
      <Controller
        name="month"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Mes" fullWidth>
            {MONTHS.map((m, i) => (
              <MenuItem key={m} value={i}>
                {m}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="year"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Año" fullWidth>
            {YEARS.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </Stack>

    <Controller
      name="active"
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={<Switch checked={field.value} onChange={field.onChange} />}
          label="Activa"
        />
      )}
    />
  </>
);

export default PromotionFields;
