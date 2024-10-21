import { Box, Typography, Divider } from "@mui/material";

const DeliveryTimes = () => {
  return (
    <Box
      sx={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <Typography variant="h2" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
        Tiempos de Entrega
      </Typography>

      <Typography variant="body1" color="textSecondary" sx={{ textAlign: "center", mb: 4 }}>
        Información sobre los tiempos estimados de entrega de tus pedidos.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Procesamiento de pedidos
        </Typography>
        <Typography variant="body2">
          Todos los pedidos se procesan en un plazo de 1-2 días hábiles, dependiendo del volumen de pedidos. Una vez procesado tu pedido, recibirás una notificación con el estado de tu orden y la información de envío.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Envíos estándar
        </Typography>
        <Typography variant="body2">
          El tiempo de entrega estimado para envíos estándar es de 3 a 5 días hábiles a partir de la fecha de procesamiento. Este tiempo puede variar dependiendo de la ubicación y la disponibilidad del transportista.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Envíos exprés
        </Typography>
        <Typography variant="body2">
          Si seleccionas el servicio de envío exprés, tu pedido llegará en un plazo de 1 a 2 días hábiles. Ten en cuenta que este servicio tiene un costo adicional y está sujeto a la disponibilidad de tu ubicación.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Áreas rurales o de difícil acceso
        </Typography>
        <Typography variant="body2">
          Los tiempos de entrega para áreas rurales o de difícil acceso pueden extenderse hasta 7 días hábiles. Trabajamos constantemente con nuestros socios logísticos para asegurar que los pedidos lleguen en el menor tiempo posible, sin importar la ubicación.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Días no laborables
        </Typography>
        <Typography variant="body2">
          Recuerda que los días festivos y no laborables pueden afectar los tiempos de entrega. Si realizas un pedido en días festivos, comenzaremos a procesarlo el siguiente día hábil.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Estado del pedido
        </Typography>
        <Typography variant="body2">
          Puedes verificar el estado de tu pedido en la sección "Mis Órdenes" de tu cuenta. Allí encontrarás información actualizada sobre el procesamiento y envío de tu pedido.
        </Typography>
      </Box>
    </Box>
  );
};

export default DeliveryTimes;