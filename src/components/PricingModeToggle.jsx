"use client";

import { useState } from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { SellOutlined, Check } from "@mui/icons-material";
import usePricingSwitch from "../hooks/usePricingSwitch";
import { PRICING_LABELS } from "../constants/pricing";

const PricingModeToggle = () => {
  const { pricingMode, confirmOpen, requestSwitch, confirmSwitch, cancelSwitch } =
    usePricingSwitch();
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleToggleChange = (_, newMode) => {
    if (!newMode || newMode === pricingMode) return;
    requestSwitch(newMode);
  };

  const handleMenuSelect = (mode) => {
    setMenuAnchor(null);
    if (mode !== pricingMode) {
      requestSwitch(mode);
    }
  };

  return (
    <>
      {/* Desktop: toggle completo con texto */}
      <ToggleButtonGroup
        value={pricingMode}
        exclusive
        onChange={handleToggleChange}
        size="small"
        sx={{
          display: { xs: "none", md: "flex" },
          height: 32,
          bgcolor: "rgba(255,255,255,0.15)",
          borderRadius: "8px",
          "& .MuiToggleButton-root": {
            textTransform: "none",
            fontSize: "0.75rem",
            px: 1.5,
            fontWeight: 600,
            border: "none",
            color: "rgba(255,255,255,0.7)",
            gap: 0.5,
            "&.Mui-selected": {
              bgcolor: "#fff",
              color: "#b71c1c",
              fontWeight: 700,
              borderRadius: "6px",
              "&:hover": { bgcolor: "#f5f5f5" },
            },
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          },
        }}
      >
        <ToggleButton value="retail">
          {pricingMode === "retail" && <SellOutlined sx={{ fontSize: 16 }} />}
          Menudeo
        </ToggleButton>
        <ToggleButton value="wholesale">
          {pricingMode === "wholesale" && <SellOutlined sx={{ fontSize: 16 }} />}
          Mayoreo
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Mobile: chip que abre menú con opciones */}
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <Chip
          icon={<SellOutlined sx={{ fontSize: 16, color: "#b71c1c !important" }} />}
          label={PRICING_LABELS[pricingMode]}
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          size="small"
          sx={{
            bgcolor: "#fff",
            color: "#b71c1c",
            fontWeight: 700,
            fontSize: "0.7rem",
            height: 28,
            cursor: "pointer",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        />
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          slotProps={{
            paper: {
              sx: {
                minWidth: 0,
                mt: 0.5,
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              },
            },
          }}
        >
          <MenuItem
            onClick={() => handleMenuSelect("retail")}
            selected={pricingMode === "retail"}
            sx={{ py: 0.75, px: 1.5, fontSize: "0.8rem", minHeight: 0, gap: 0.75 }}
          >
            {pricingMode === "retail" ? (
              <Check sx={{ fontSize: 14 }} />
            ) : (
              <Box sx={{ width: 14 }} />
            )}
            Menudeo
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuSelect("wholesale")}
            selected={pricingMode === "wholesale"}
            sx={{ py: 0.75, px: 1.5, fontSize: "0.8rem", minHeight: 0, gap: 0.75 }}
          >
            {pricingMode === "wholesale" ? (
              <Check sx={{ fontSize: 14 }} />
            ) : (
              <Box sx={{ width: 14 }} />
            )}
            Mayoreo
          </MenuItem>
        </Menu>
      </Box>

      <Dialog open={confirmOpen} onClose={cancelSwitch}>
        <DialogTitle>Cambiar modo de precios</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Al cambiar el modo de precios se vaciará tu carrito actual. Los productos y precios
            pueden variar entre modos.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 1, pb: 2 }}>
          <Button onClick={cancelSwitch} variant="contained">
            Cancelar
          </Button>
          <Button onClick={confirmSwitch} variant="outlined">
            Cambiar y vaciar carrito
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PricingModeToggle;
