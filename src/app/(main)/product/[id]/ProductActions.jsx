import { Button, IconButton, Box } from "@mui/material";
import { motion } from "framer-motion";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

const MotionButton = motion(Button);
const MotionIconButton = motion(IconButton);
const tapAnim = { scale: 0.9 };
const hoverAnim = { scale: 1.05 };

export const ProductActions = ({ onAdd, onToggleFav, isFav, showFav }) => (
  <Box display="flex" gap={1} alignItems="center">
    <MotionButton
      variant="contained"
      color="primary"
      onClick={onAdd}
      whileTap={tapAnim}
      whileHover={hoverAnim}
    >
      Añadir a la orden
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
          padding: "8px",
          "&:hover": { backgroundColor: "rgba(255,0,0,0.1)" },
        }}
      >
        {isFav ? <Favorite /> : <FavoriteBorder />}
      </MotionIconButton>
    )}
  </Box>
);
