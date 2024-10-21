import { Box, Typography } from "@mui/material";

const PrivacyStatement = () => {
  return (
    <Box
      sx={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <Typography variant="h2" gutterBottom>
        Aviso de Privacidad
      </Typography>
      <Typography variant="body1" paragraph>
        En Ferretería Texcoco, estamos comprometidos con proteger su privacidad.
        Este aviso de privacidad describe cómo recopilamos, utilizamos y
        protegemos su información personal.
      </Typography>
      <Typography variant="h6" gutterBottom>
        1. Información que recopilamos
      </Typography>
      <Typography variant="body2" paragraph>
        Recopilamos información personal que usted nos proporciona al realizar
        una orden de compra, registrarse en nuestro sitio, suscribirse a nuestro boletín
        o interactuar de otras maneras con nuestros servicios.
      </Typography>
      <Typography variant="h6" gutterBottom>
        2. Cómo usamos su información
      </Typography>
      <Typography variant="body2" paragraph>
        Utilizamos la información que recopilamos para procesar pedidos, mejorar
        nuestros servicios y personalizar su experiencia.
      </Typography>
      <Typography variant="h6" gutterBottom>
        3. Seguridad de su información
      </Typography>
      <Typography variant="body2" paragraph>
        Tomamos medidas razonables para proteger su información personal de
        accesos no autorizados, uso o divulgación.
      </Typography>
      <Typography variant="h6" gutterBottom>
        4. Sus derechos
      </Typography>
      <Typography variant="body2" paragraph>
        Usted tiene derecho a acceder, rectificar o eliminar su información
        personal en cualquier momento. Para ejercer estos derechos, contáctenos
        a través de nuestros canales de atención al cliente.
      </Typography>
      <Typography variant="h6" gutterBottom>
        5. Contacto
      </Typography>
      <Typography variant="body2" paragraph>
        Si tiene preguntas sobre este aviso de privacidad, por favor contáctenos
        en:
        <br />
        Correo: ferreteriatexcoco@gmail.com
        <br />
        Teléfono: 800 900 4872
      </Typography>
    </Box>
  );
};

export default PrivacyStatement;
