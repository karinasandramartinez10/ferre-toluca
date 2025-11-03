import { Box, Grid, Link, Typography } from "@mui/material";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#12192E",
        color: "#FFF",
        padding: "40px 20px",
        mt: 4,
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <Grid
        container
        spacing={4}
        justifyContent="space-between"
        sx={{ mx: "auto", maxWidth: "100%" }}
      >
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
          <Typography sx={{ wordBreak: "break-word" }}>
            <Link
              href="mailto:atencionalcliente@gmail.com" // TODO: cambiar
              color="inherit"
              underline="hover"
            >
              ferreteriatexcoco@gmail.com
            </Link>
          </Typography>
          <Typography>Llámanos:</Typography>
          <Typography sx={{ wordBreak: "break-word" }}>
            <Link href="tel:8009004872" color="inherit" underline="hover">
              800 900 4872
            </Link>
          </Typography>
        </Grid>
      </Grid>

      <Box
        sx={{ textAlign: "center", mt: 4, pt: 2, borderTop: "1px solid #333" }}
      >
        <Typography variant="body2" color="inherit">
          Copyright © 2026 Ferretería Texcoco. Todos los Derechos Reservados.
        </Typography>
      </Box>
    </Box>
  );
};
