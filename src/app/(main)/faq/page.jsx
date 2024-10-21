import { Box, Typography, Grid, Icon, Divider } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CachedIcon from "@mui/icons-material/Cached";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PublicIcon from "@mui/icons-material/Public";

const FAQ = () => {
  return (
    <Box
      sx={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <Typography
        variant="h2"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        Preguntas Frecuentes
      </Typography>

      <Typography
        variant="body1"
        color="textSecondary"
        sx={{ textAlign: "center", mb: 4 }}
      >
        Respuestas rápidas a las preguntas que puedas tener.
      </Typography>

      <Grid container spacing={4}>
        {/* Primera columna */}
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center" gap={2}>
            <Icon>
              <HelpOutlineIcon />
            </Icon>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ¿Cómo realizo una orden de compra?
              </Typography>
              <Typography variant="body2">
                Para realizar una orden de compra, navega por nuestro catálogo
                de productos y selecciona los artículos que deseas. Luego, haz
                clic en Añadir a la orden para agregarlos a tu carrito.
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />

          <Box display="flex" alignItems="center" gap={2}>
            <Icon>
              <PaymentIcon />
            </Icon>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ¿Cuáles son las opciones de pago disponibles?
              </Typography>
              <Typography variant="body2">
                Aceptamos pagos con tarjeta de crédito, débito y transferencias
                bancarias. También puedes optar por pago en efectivo en tiendas
                de conveniencia seleccionadas.
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />

          <Box display="flex" alignItems="center" gap={2}>
            <Icon>
              <LocalShippingIcon />
            </Icon>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ¿Cómo puedo rastrear mi pedido?
              </Typography>
              <Typography variant="body2">
                Una vez que tu pedido haya sido confirmado, recibirás un correo
                electrónico con el número de seguimiento. También puedes
                rastrear el estado de tu pedido directamente en tu cuenta.
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* Segunda columna */}
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center" gap={2}>
            <Icon>
              <CachedIcon />
            </Icon>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ¿Puedo cancelar o modificar mi pedido?
              </Typography>
              <Typography variant="body2">
                Sí, puedes cancelar o modificar tu pedido siempre y cuando aún
                no haya sido procesado. Dirígete a la sección Mis Órdenes para
                gestionar tus pedidos.
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />

          <Box display="flex" alignItems="center" gap={2}>
            <Icon>
              <ReportProblemIcon />
            </Icon>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ¿Qué hago si recibo un producto defectuoso o incorrecto?
              </Typography>
              <Typography variant="body2">
                Si recibes un producto defectuoso o incorrecto, contáctanos a
                través de nuestro formulario de atención al cliente o llama a
                nuestro centro de soporte.
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />

          <Box display="flex" alignItems="center" gap={2}>
            <Icon>
              <AccessTimeIcon />
            </Icon>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ¿Cuánto tiempo tarda en llegar mi pedido?
              </Typography>
              <Typography variant="body2">
                El tiempo de entrega varía según tu ubicación y el método de
                envío seleccionado. Normalmente, los pedidos son procesados en
                1-2 días hábiles.
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />

          <Box display="flex" alignItems="center" gap={2}>
            <Icon>
              <PublicIcon />
            </Icon>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ¿Ofrecen envíos internacionales?
              </Typography>
              <Typography variant="body2">
                Actualmente, solo ofrecemos envíos dentro del país. Estamos
                trabajando para expandir nuestras operaciones.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FAQ;
