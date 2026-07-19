import { Box, Typography } from "@mui/material";
import Image from "next/image";

interface ProductResultRowProps {
  name: string;
  sku?: string | null;
  imagePath?: string | null;
  size?: number;
}

const ProductResultRow = ({ name, sku, imagePath, size = 44 }: ProductResultRowProps) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, width: "100%" }}>
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "grey.light",
      }}
    >
      <Image
        src={imagePath || "/images/placeholder.png"}
        alt={name}
        width={size}
        height={size}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" fontWeight={500} noWrap>
        {name}
      </Typography>
      {sku && (
        <Typography variant="caption" color="text.secondary" noWrap display="block">
          SKU {sku}
        </Typography>
      )}
    </Box>
  </Box>
);

export default ProductResultRow;
