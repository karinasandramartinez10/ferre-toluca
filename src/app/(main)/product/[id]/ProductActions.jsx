import { useState } from "react";
import { Button, IconButton, Box, TextField } from "@mui/material";
import { motion } from "framer-motion";
import { Favorite, FavoriteBorder, Add, Remove } from "@mui/icons-material";

const MotionButton = motion(Button);
const MotionIconButton = motion(IconButton);
const tapAnim = { scale: 0.9 };
const hoverAnim = { scale: 1.05 };

export const ProductActions = ({ onAdd, onToggleFav, isFav, showFav, disabled }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAdd(quantity);
    setQuantity(1);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      {!disabled && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ccc",
            borderRadius: "8px",
            height: 40,
          }}
        >
          <IconButton size="small" onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>
            <Remove fontSize="small" />
          </IconButton>
          <TextField
            type="text"
            inputMode="numeric"
            value={quantity}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (v > 0) setQuantity(v);
              else if (e.target.value === "") setQuantity(1);
            }}
            variant="standard"
            sx={{ width: 40 }}
            inputProps={{ style: { textAlign: "center" } }}
            InputProps={{ disableUnderline: true }}
          />
          <IconButton size="small" onClick={() => setQuantity((q) => q + 1)}>
            <Add fontSize="small" />
          </IconButton>
        </Box>
      )}
      <MotionButton
        variant="contained"
        color="primary"
        onClick={handleAdd}
        disabled={disabled}
        whileTap={disabled ? {} : tapAnim}
        whileHover={disabled ? {} : hoverAnim}
        sx={{ height: 40 }}
      >
        {disabled ? "No disponible" : "Añadir a la orden"}
      </MotionButton>
      {showFav && (
        <MotionIconButton
          onClick={onToggleFav}
          color={isFav ? "error" : "default"}
          whileTap={tapAnim}
          whileHover={hoverAnim}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: 40,
            height: 40,
            "&:hover": { backgroundColor: "rgba(255,0,0,0.1)" },
          }}
        >
          {isFav ? <Favorite /> : <FavoriteBorder />}
        </MotionIconButton>
      )}
    </Box>
  );
};
