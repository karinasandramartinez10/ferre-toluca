import { Box, Card, Typography, Tooltip, Chip, Stack } from "@mui/material";
import { CloudinaryImage } from "../../../../../components/CloudinaryImage";

export const ProductItem = ({ product }) => {
  const name = product.name;
  const qty = product.QuoteProduct.quantity;

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        gap: 1,
        boxShadow: "none",
      }}
    >
      <CloudinaryImage
        publicId={product.Files?.[0]?.publicId}
        alt={name}
        width={40}
        height={40}
        crop="fill"
        quality="auto:best"
        style={{ objectFit: "contain", borderRadius: 4 }}
      />
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Stack>
          <Tooltip title={name}>
            <Typography variant="caption" noWrap sx={{ fontWeight: 500 }}>
              {name}
            </Typography>
          </Tooltip>
          <Box>
            <Chip label={`x${qty}`} size="small" />
          </Box>
        </Stack>
      </Box>
    </Card>
  );
};
