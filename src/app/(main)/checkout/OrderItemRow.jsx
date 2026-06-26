"use client";

import { Box, Typography, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Image from "next/image";
import { QuantityField } from "../../../components/QuantityField";
import PromoBadges from "../../../components/PromoBadges";
import { formatPrice } from "../../../utils/currency";

// La tasa de descuento de las unidades de regalo se deriva del monto que ya calculó el BE
// (descuento / (unidades × precio)): 1 = gratis, 0.5 = mitad de precio.
const nxmNote = (nxm, unitPrice, quantity) => {
  if (!nxm || !nxm.freeUnits) return null;
  const rate = nxm.discountAmount / (nxm.freeUnits * parseFloat(unitPrice));
  const word =
    rate >= 0.99
      ? "gratis"
      : Math.abs(rate - 0.5) < 0.05
        ? "a mitad de precio"
        : `con ${Math.round(rate * 100)}% de descuento`;
  const unit = nxm.freeUnits > 1 ? "unidades" : "unidad";
  const prefix = rate >= 0.99 ? `Pagas ${quantity - nxm.freeUnits} · ` : "";
  return `${prefix}${nxm.freeUnits} ${unit} ${word}`;
};

const OrderItemRow = ({ product, quantity, onRemove, unitPrice, nxm }) => {
  const formattedUnit = formatPrice(unitPrice);
  const grossSubtotal = unitPrice ? parseFloat(unitPrice) * quantity : 0;
  const effectiveSubtotal = nxm ? nxm.lineTotal : grossSubtotal;
  const subtotal = unitPrice ? formatPrice(effectiveSubtotal) : null;
  const strikedSubtotal = nxm ? formatPrice(grossSubtotal) : null;
  const hasPromo =
    product?.finalPrice != null && Number(product.finalPrice) < Number(product.price);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 2,
        borderBottom: "1px solid #ddd",
        pb: 2,
        gap: { xs: 1, md: 2 },
      }}
    >
      <Image
        src={product.Files?.[0]?.path ?? "/images/placeholder.png"}
        alt={product.name}
        width={64}
        height={64}
        style={{ objectFit: "contain", flexShrink: 0 }}
      />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {product.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {product.code}
            </Typography>
            <Typography
              variant="caption"
              color={formattedUnit ? "text.secondary" : "warning.main"}
              display="block"
            >
              {formattedUnit ? (
                <>
                  {hasPromo && (
                    <Box
                      component="span"
                      sx={{ textDecoration: "line-through", color: "text.disabled", mr: 0.5 }}
                    >
                      {formatPrice(product.price)}
                    </Box>
                  )}
                  {`${formattedUnit} c/u`}
                </>
              ) : (
                "Precio por confirmar"
              )}
            </Typography>
            <PromoBadges badges={product?.badges} />
            {nxm && (
              <Typography variant="caption" color="green.main" fontWeight={700} display="block">
                {nxmNote(nxm, unitPrice, quantity)}
              </Typography>
            )}
          </Box>
          <IconButton size="small" color="error" onClick={onRemove} sx={{ flexShrink: 0 }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.5 }}
        >
          <QuantityField productId={product.id} quantity={quantity} />
          <Box sx={{ textAlign: "right" }}>
            {strikedSubtotal && (
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ textDecoration: "line-through", display: "block" }}
              >
                {strikedSubtotal}
              </Typography>
            )}
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color={subtotal ? "primary.main" : "warning.main"}
            >
              Subtotal: {subtotal || "Por confirmar"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderItemRow;
