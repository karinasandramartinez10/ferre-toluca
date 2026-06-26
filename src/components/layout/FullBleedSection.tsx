import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { ReactNode } from "react";
import { CONTENT_MAX_WIDTH, CONTENT_GUTTER } from "../../constants/layout";

interface FullBleedSectionProps {
  children: ReactNode;
  outerSx?: SxProps<Theme>;
  innerSx?: SxProps<Theme>;
}

// Rompe el contenedor a todo el ancho del viewport y re-constrain el contenido al mismo
// max-width + gutter que el resto de (main), para que el panel quede alineado con la página.
const FullBleedSection = ({ children, outerSx, innerSx }: FullBleedSectionProps) => (
  <Box sx={{ width: "100vw", position: "relative", left: "calc(-50vw + 50%)", ...outerSx }}>
    <Box sx={{ maxWidth: `${CONTENT_MAX_WIDTH}px`, mx: "auto", px: CONTENT_GUTTER, ...innerSx }}>
      {children}
    </Box>
  </Box>
);

export default FullBleedSection;
