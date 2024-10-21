import { Box, Typography, Button } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Link from "next/link";

const NoProductsUI = ({ config }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        backgroundColor: "#f7f7f7",
        borderRadius: "8px",
        p: 3,
      }}
      width="100%"
    >
      {/* //TODO: agregar breadcrumbs */}
      <ShoppingCartOutlinedIcon sx={{ fontSize: 80, color: "gray" }} />
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
        Lo sentimos, no hay productos disponibles en esta {config.type}
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Tal vez te interese explorar otros productos disponibles.
      </Typography>
      <Link href="/" passHref>
        <Button variant="contained" color="primary">
          Explorar otras {config.types}
        </Button>
      </Link>
    </Box>
  );
};

export default NoProductsUI;
