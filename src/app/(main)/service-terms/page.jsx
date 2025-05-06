import { Box, Typography, Divider } from "@mui/material";

const TermsOfService = () => {
  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <Typography
        variant="h2"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        Términos de Servicio
      </Typography>

      <Typography
        variant="body1"
        color="textSecondary"
        sx={{ textAlign: "center", mb: 4 }}
      >
        Estos términos rigen el uso de la plataforma y los servicios que
        ofrecemos.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          1. Introducción
        </Typography>
        <Typography variant="body2">
          Estos Términos de Servicio regulan el uso de nuestra plataforma y
          todos los servicios proporcionados. Al utilizar nuestro sitio web y
          servicios, aceptas cumplir con estos términos.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          2. Uso de la plataforma
        </Typography>
        <Typography variant="body2">
          Al acceder a nuestra plataforma, te comprometes a utilizarla de manera
          legal y respetuosa. No está permitido el uso de nuestra plataforma
          para actividades ilícitas, como la distribución de contenido ilegal, o
          que viole los derechos de otros.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          3. Propiedad intelectual
        </Typography>
        <Typography variant="body2">
          Todo el contenido de la plataforma, incluidos textos, imágenes,
          logotipos y otros materiales, está protegido por derechos de autor. No
          puedes copiar, distribuir ni usar dicho contenido sin el
          consentimiento previo por escrito.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          4. Precios y pagos
        </Typography>
        <Typography variant="body2">
          Los precios de los productos están sujetos a cambios. Aceptamos pagos
          mediante tarjeta de crédito, débito y otras formas de pago mencionadas
          en nuestra plataforma. Asegúrate de revisar todas las políticas de
          pago antes de realizar una compra.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          5. Envíos y entregas
        </Typography>
        <Typography variant="body2">
          Nuestros tiempos de entrega varían según la ubicación. Consulta
          nuestra página de Tiempos de Entrega para obtener más información
          sobre los plazos estimados. No somos responsables de los retrasos
          ocasionados por factores externos a nuestro control.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          6. Cancelación y reembolsos
        </Typography>
        <Typography variant="body2">
          Puedes cancelar tu pedido en cualquier momento antes de que haya sido
          procesado. Si deseas un reembolso, por favor revisa nuestra política
          de devoluciones para más detalles.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          7. Modificaciones de los términos
        </Typography>
        <Typography variant="body2">
          Nos reservamos el derecho de modificar estos Términos de Servicio en
          cualquier momento. Los cambios entrarán en vigor una vez publicados en
          nuestro sitio web.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          8. Limitación de responsabilidad
        </Typography>
        <Typography variant="body2">
          No nos hacemos responsables por daños indirectos, incidentales o
          consecuentes que puedan surgir del uso de nuestra plataforma. Esto
          incluye, pero no se limita, a la pérdida de datos, beneficios o
          interrupciones en el servicio.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          9. Contacto
        </Typography>
        <Typography variant="body2">
          Si tienes preguntas o inquietudes sobre estos Términos de Servicio, no
          dudes en ponerte en contacto con nosotros a través de nuestro
          formulario de atención al cliente o llamando al número de soporte.
        </Typography>
      </Box>
    </Box>
  );
};

export default TermsOfService;
