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
import type { Control } from "react-hook-form";
import { MONTHS, PROMOTION_TYPE_OPTIONS } from "../../../../constants/promotions";
import { PRICE_TIERS, TIER_LABELS } from "../../../../constants/pricing";
import { formatPrice } from "../../../../utils/currency";
import useScopePreview from "../../../../hooks/admin/useScopePreview";

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

const tierToggleSx = {
  "&.Mui-selected": {
    bgcolor: "primary.main",
    color: "#fff",
    "&:hover": { bgcolor: "primary.hover" },
  },
};

interface PromotionFieldsProps {
  control: Control<any>;
  errors: any;
  type: string;
  priceMode?: string;
  applicableTiers?: string[];
  scopeProductId?: number | null;
  typeDisabled?: boolean;
}

const numberField = (
  name: string,
  label: string,
  control: Control<any>,
  errors: any,
  helper?: string
) => (
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

const PromotionFields = ({
  control,
  errors,
  type,
  priceMode,
  applicableTiers = [],
  scopeProductId,
  typeDisabled = false,
}: PromotionFieldsProps) => {
  const { product: scopePreview } = useScopePreview(
    type === "volume_price" && scopeProductId ? scopeProductId : null
  );
  const tiersToPrice = applicableTiers.length ? applicableTiers : PRICE_TIERS;
  const canAbsolute = !!scopeProductId;

  return (
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

      <Controller
        name="applicableTiers"
        control={control}
        render={({ field }) => {
          const tiers: string[] = field.value ?? [];
          const isAll = tiers.length === 0;
          return (
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Aplica a los clientes
              </Typography>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                <ToggleButton
                  size="small"
                  value="all"
                  selected={isAll}
                  onChange={() => field.onChange([])}
                  sx={tierToggleSx}
                >
                  Todos
                </ToggleButton>
                <ToggleButtonGroup
                  size="small"
                  value={tiers}
                  onChange={(_e, value) => field.onChange(value)}
                >
                  {PRICE_TIERS.map((tier) => (
                    <ToggleButton key={tier} value={tier} sx={tierToggleSx}>
                      {tier} · {TIER_LABELS[tier]}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                Segmenta eligiendo tipos de cliente, o déjala en Todos para cualquiera.
              </Typography>
            </Box>
          );
        }}
      />

      {type === "percentage" ? (
        numberField("discountPercentage", "Porcentaje de descuento", control, errors)
      ) : (
        <>
          {numberField(
            "minQuantity",
            "Cantidad mínima",
            control,
            errors,
            "Desde esta cantidad, todas las piezas bajan de precio"
          )}

          {canAbsolute ? (
            <Controller
              name="priceMode"
              control={control}
              render={({ field }) => (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Precio nuevo por
                  </Typography>
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={field.value}
                    onChange={(_e, value) => value && field.onChange(value)}
                  >
                    <ToggleButton value="percentage" sx={tierToggleSx}>
                      % de descuento
                    </ToggleButton>
                    <ToggleButton value="absolute" sx={tierToggleSx}>
                      Precio fijo por cliente
                    </ToggleButton>
                  </ToggleButtonGroup>
                  {errors.priceMode && (
                    <Typography variant="caption" color="error" display="block">
                      {errors.priceMode.message}
                    </Typography>
                  )}
                </Box>
              )}
            />
          ) : (
            <Typography variant="caption" color="text.secondary" display="block">
              Para fijar un precio exacto por cliente, promociona un solo producto.
            </Typography>
          )}

          {priceMode === "absolute" ? (
            <Stack spacing={1.5}>
              {tiersToPrice.map((tier) => (
                <Stack key={tier} direction="row" spacing={2} alignItems="flex-start">
                  {numberField(
                    `volumePrice${tier}`,
                    `Precio ${tier} — ${TIER_LABELS[tier]}`,
                    control,
                    errors
                  )}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ pt: 2, whiteSpace: "nowrap" }}
                  >
                    {scopePreview ? `hoy ${formatPrice(scopePreview.prices[tier])}` : "—"}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Controller
              name="volumeDiscountPercentage"
              control={control}
              render={({ field }) => (
                <Box>
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    type="number"
                    label="% de descuento por volumen"
                    fullWidth
                    error={!!errors.volumeDiscountPercentage}
                    helperText={
                      errors.volumeDiscountPercentage?.message ||
                      "Al llegar al mínimo, cada pieza baja este %"
                    }
                  />
                  {scopePreview && field.value > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Precio resultante por cliente:
                      </Typography>
                      <Stack direction="row" spacing={1.5} flexWrap="wrap">
                        {tiersToPrice.map((tier) => (
                          <Typography
                            key={tier}
                            variant="caption"
                            color="green.main"
                            fontWeight={700}
                          >
                            {tier}:{" "}
                            {formatPrice(scopePreview.prices[tier] * (1 - field.value / 100))}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>
              )}
            />
          )}
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
};

export default PromotionFields;
