import { Box, Link, Typography } from "@mui/material";
import { BUSINESS } from "../../../constants/businessInfo";
import { COOKIE_CATEGORIES } from "../../../constants/cookieConsent";

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

const CookiesPolicy = () => {
  return (
    <Box sx={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <Typography variant="h2" gutterBottom>
        Política de Cookies
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Última actualización: {BUSINESS.lastUpdated}
      </Typography>

      <Typography variant="body1" paragraph>
        En {BUSINESS.tradeName} usamos cookies y tecnologías similares (como el almacenamiento local
        del navegador) para que el sitio funcione y, con tu consentimiento, para mejorar tu
        experiencia. Esta política explica qué usamos y cómo puedes controlarlo.
      </Typography>

      <Section title="1. Qué son las cookies">
        Son pequeños archivos que un sitio guarda en tu navegador para recordar información entre
        páginas o visitas. Junto con tecnologías similares (como el almacenamiento local), permiten
        funciones básicas y, cuando lo autorizas, medir el uso del sitio y personalizar contenido.
      </Section>

      <Section title="2. Categorías que manejamos">
        {COOKIE_CATEGORIES.map((cat) => (
          <Box key={cat.key} sx={{ mb: 1 }}>
            <strong>{cat.label}.</strong> {cat.description}
          </Box>
        ))}
      </Section>

      <Section title="3. Qué usamos hoy">
        <Box component="span" sx={{ display: "block", mb: 1 }}>
          <strong>Esenciales (siempre activas):</strong> cookies de inicio de sesión y seguridad, y
          almacenamiento local para recordar tu carrito y tu preferencia de cookies. Sin ellas el
          sitio no funcionaría correctamente.
        </Box>
        <Box component="span" sx={{ display: "block" }}>
          <strong>Analíticas y marketing:</strong> actualmente el sitio no carga cookies de
          analítica ni de marketing. Si en el futuro las incorporamos, solo se activarán con tu
          consentimiento previo y se detallarán aquí.
        </Box>
      </Section>

      <Section title="4. Cómo administrar tus preferencias">
        Puedes aceptar, rechazar o configurar por categoría desde el banner al ingresar, y cambiar
        tu elección en cualquier momento desde el enlace &ldquo;Preferencias de cookies&rdquo; en el
        pie de página. También puedes borrar o bloquear cookies desde la configuración de tu
        navegador; ten en cuenta que deshabilitar las esenciales puede afectar el funcionamiento del
        sitio.
      </Section>

      <Section title="5. Más información">
        Para conocer cómo tratamos tus datos personales, consulta nuestro{" "}
        <Link href="/privacy-statement">Aviso de Privacidad</Link>. Si tienes dudas, escríbenos a{" "}
        <Link href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</Link>.
      </Section>
    </Box>
  );
};

export default CookiesPolicy;
