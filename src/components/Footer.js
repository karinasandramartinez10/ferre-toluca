import { Box, Grid, Link, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#12192E",
        color: "#FFF",
        padding: "40px 20px",
        mt: 4,
      }}
    >
      <Grid container spacing={4} justifyContent="space-between">
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Ferreteria texcoco
          </Typography>
          <Typography>
            <Link href="/delivery-time" color="inherit" underline="hover">
              Tiempos de entrega
            </Link>
          </Typography>
          <Typography>
            <Link href="/faq" color="inherit" underline="hover">
              Preguntas frecuentes
            </Link>
          </Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Legales
          </Typography>
          <Typography>
            <Link href="/privacy-statement" color="inherit" underline="hover">
              Aviso de Privacidad
            </Link>
          </Typography>
          <Typography>
            <Link href="/terms-conditions" color="inherit" underline="hover">
              Términos y Condiciones
            </Link>
          </Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Contacto
          </Typography>
          <Typography>Escríbenos:</Typography>
          <Typography>
            <Link
              href="mailto:atencionalcliente@gmail.com" // TODO: cambiar
              color="inherit"
              underline="hover"
            >
              ferreteriatexcoco@gmail.com
            </Link>
          </Typography>
          <Typography>Llámanos:</Typography>
          <Typography>
            <Link href="tel:8009004872" color="inherit" underline="hover">
              800 900 4872
            </Link>
          </Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Síguenos en:
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link href="#" color="inherit" underline="none">
              <FacebookIcon fontSize="large" />
            </Link>
            <Link href="#" color="inherit" underline="none">
              <InstagramIcon fontSize="large" />
            </Link>
            <Link href="#" color="inherit" underline="none">
              <TwitterIcon fontSize="large" />
            </Link>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: "center", mt: 4, pt: 2, borderTop: "1px solid #333" }}>
        <Typography variant="body2" color="inherit">
          Copyright © 2024 Ferretería Texococo. Todos los Derechos Reservados.
        </Typography>
      </Box>
    </Box>
  );
};
