import { Box, Link, Typography } from "@mui/material";
import { BUSINESS } from "../../../constants/businessInfo";

const Section = ({ title, children }) => (
  <>
    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      {title}
    </Typography>
    <Typography variant="body2" component="div" paragraph>
      {children}
    </Typography>
  </>
);

const PrivacyStatement = () => {
  return (
    <Box sx={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <Typography variant="h2" gutterBottom>
        Aviso de Privacidad
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Última actualización: {BUSINESS.lastUpdated}
      </Typography>

      <Typography variant="body1" paragraph>
        {BUSINESS.legalName} (en adelante, &ldquo;{BUSINESS.tradeName}&rdquo;), con domicilio en{" "}
        {BUSINESS.fiscalAddress} y RFC {BUSINESS.rfc}, es responsable del tratamiento de sus datos
        personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los
        Particulares (LFPDPPP), su Reglamento y demás normativa aplicable. Este aviso describe cómo
        recabamos, usamos y protegemos su información.
      </Typography>

      <Section title="1. Datos personales que recabamos">
        Para brindarle nuestros servicios podemos recabar: nombre, correo electrónico, teléfono,
        domicilio de entrega y datos de facturación (razón social, RFC, régimen fiscal, uso de CFDI)
        cuando usted los proporciona al registrarse, solicitar una cotización o contactarnos. Al
        aceptar los Términos y este Aviso, conservamos como constancia la fecha y hora, la versión
        aceptada, su dirección IP de forma anonimizada y el identificador de su navegador
        (user-agent). <strong>No recabamos datos personales sensibles.</strong>
      </Section>

      <Section title="2. Finalidades del tratamiento">
        <Box component="span" sx={{ display: "block", mb: 1 }}>
          <strong>Finalidades primarias</strong> (necesarias para la relación con usted): crear y
          administrar su cuenta, procesar y dar seguimiento a sus cotizaciones y pedidos, emitir
          facturas, brindar atención al cliente y coordinar entregas.
        </Box>
        <Box component="span" sx={{ display: "block" }}>
          <strong>Finalidades secundarias</strong> (no necesarias): enviarle promociones, boletines
          y comunicaciones de marketing, y realizar analítica para mejorar el sitio. Usted puede
          negar el uso de sus datos para estas finalidades secundarias enviando un correo a{" "}
          <Link href={`mailto:${BUSINESS.dataContactEmail}`}>{BUSINESS.dataContactEmail}</Link>; su
          negativa no será motivo para negarle los servicios.
        </Box>
      </Section>

      <Section title="3. Derechos ARCO y revocación del consentimiento">
        Usted tiene derecho a Acceder, Rectificar y Cancelar sus datos personales, así como a
        Oponerse a su tratamiento (derechos ARCO), y a revocar el consentimiento otorgado. Para
        ejercerlos, envíe una solicitud a{" "}
        <Link href={`mailto:${BUSINESS.dataContactEmail}`}>{BUSINESS.dataContactEmail}</Link>{" "}
        indicando su nombre, el derecho que desea ejercer y una descripción clara de los datos
        involucrados, adjuntando identificación que acredite su identidad. Daremos respuesta en los
        plazos que marca la ley.
      </Section>

      <Section title="4. Transferencias de datos">
        Sus datos pueden ser tratados por proveedores que nos prestan servicios (por ejemplo,
        alojamiento del sitio y mensajería), únicamente para cumplir las finalidades descritas. No
        vendemos ni transferimos sus datos a terceros para fines distintos sin su consentimiento,
        salvo en los casos previstos por el artículo 37 de la LFPDPPP.
      </Section>

      <Section title="5. Uso de cookies y tecnologías similares">
        Utilizamos cookies y tecnologías similares (como el almacenamiento local del navegador)
        esenciales para el funcionamiento del sitio y, con su consentimiento, cookies de analítica y
        marketing. Puede administrar sus preferencias en cualquier momento desde el enlace
        &ldquo;Preferencias de cookies&rdquo; del pie de página. Para más detalle consulte nuestra{" "}
        <Link href="/cookies-policy">Política de Cookies</Link>.
      </Section>

      <Section title="6. Medidas de seguridad">
        Adoptamos medidas de seguridad administrativas, técnicas y físicas razonables para proteger
        sus datos personales contra daño, pérdida, alteración, destrucción o uso, acceso o
        tratamiento no autorizados.
      </Section>

      <Section title="7. Cambios a este aviso">
        Podemos actualizar este Aviso de Privacidad. Cualquier cambio se publicará en esta página
        con su nueva fecha de actualización.
      </Section>

      <Section title="8. Contacto">
        Si tiene preguntas sobre este aviso o sobre el tratamiento de sus datos, contáctenos en:
        <br />
        Correo: <Link href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</Link>
        <br />
        Teléfono: {BUSINESS.phone}
      </Section>
    </Box>
  );
};

export default PrivacyStatement;
