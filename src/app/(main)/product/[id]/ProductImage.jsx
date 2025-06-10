import { Box } from "@mui/material";
import Image from "next/image";

const ProductImage = ({ path, name }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 3",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <Image
        src={path || "/fallback-image.jpg"}
        alt={name}
        fill
        priority
        style={{ objectFit: "contain" }}
      />
    </Box>
  );
};

export default ProductImage;
