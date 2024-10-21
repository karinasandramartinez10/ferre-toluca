import { Box, Typography } from "@mui/material";

const TermsAndConditions = () => {
  return (
    <Box
      sx={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <Typography variant="h2" gutterBottom>
        Términos y Condiciones
      </Typography>

      <Typography variant="body1" paragraph>
        Bienvenido a Ferretería Texcoco. Al utilizar nuestro sitio web y
        servicios, aceptas los siguientes términos y condiciones.
      </Typography>

      <Typography variant="h6" gutterBottom>
        1. Uso del sitio web
      </Typography>
      <Typography variant="body2" paragraph>
        Al acceder y usar nuestro sitio web, aceptas no utilizarlo para
        actividades ilegales o prohibidas por estos términos. Nos reservamos el
        derecho de modificar o interrumpir el servicio sin previo aviso.
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. Propiedad intelectual
      </Typography>
      <Typography variant="body2" paragraph>
        Todos los contenidos, incluyendo imágenes, textos y logos, son propiedad
        de Ferretería Texcoco o de sus proveedores. No está permitida la
        reproducción sin nuestro consentimiento previo.
      </Typography>

      <Typography variant="h6" gutterBottom>
        3. Políticas de orden de compra
      </Typography>
      <Typography variant="body2" paragraph>
        Todas las órdenes de compras realizadas en nuestro sitio están sujetas a la
        disponibilidad de los productos. Nos reservamos el derecho de cancelar
        pedidos si no podemos cumplir con las condiciones establecidas.
      </Typography>

      <Typography variant="h6" gutterBottom>
        4. Responsabilidad
      </Typography>
      <Typography variant="body2" paragraph>
        No nos hacemos responsables de los daños o pérdidas que resulten del uso
        de nuestro sitio web o de la imposibilidad de utilizarlo.
      </Typography>

      <Typography variant="h6" gutterBottom>
        5. Modificaciones de los términos
      </Typography>
      <Typography variant="body2" paragraph>
        Nos reservamos el derecho de modificar estos términos en cualquier
        momento. Las modificaciones serán efectivas a partir de su publicación
        en el sitio web.
      </Typography>

      <Typography variant="h6" gutterBottom>
        6. Contacto
      </Typography>
      <Typography variant="body2" paragraph>
        Si tienes preguntas sobre estos términos y condiciones, por favor
        contáctanos en:
        <br />
        Correo: ferreteriatexcoco@gmail.com
        <br />
        Teléfono: 800 900 4872
      </Typography>
    </Box>
  );
};

export default TermsAndConditions;
