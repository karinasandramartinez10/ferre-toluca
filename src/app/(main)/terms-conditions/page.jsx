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

const TermsAndConditions = () => {
  return (
    <Box sx={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <Typography variant="h2" gutterBottom>
        Términos y Condiciones
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Última actualización: {BUSINESS.lastUpdated}
      </Typography>

      <Typography variant="body1" paragraph>
        Estos Términos y Condiciones regulan el uso del sitio de {BUSINESS.tradeName}, operado por{" "}
        {BUSINESS.legalName}, con domicilio en {BUSINESS.fiscalAddress} y RFC {BUSINESS.rfc}. Al
        usar el sitio aceptas estos términos.
      </Typography>

      <Section title="1. Naturaleza del servicio (cotización)">
        Este sitio funciona por <strong>cotización</strong>: los precios mostrados son{" "}
        <strong>referenciales</strong> y una cotización <strong>no constituye una venta</strong>{" "}
        hasta que sea confirmada por nosotros. Nos reservamos el derecho de ajustar precios,
        verificar disponibilidad y cancelar cotizaciones que no podamos cumplir. La vigencia de cada
        cotización se indica al emitirla.
      </Section>

      <Section title="2. Precios e impuestos">
        Los precios se expresan en pesos mexicanos (MXN). Salvo que se indique lo contrario, los
        precios pueden causar IVA conforme a la legislación aplicable. Los precios están sujetos a
        cambio sin previo aviso hasta la confirmación de la cotización.
      </Section>

      <Section title="3. Promociones y precios por tipo de cliente">
        Las promociones son temporales, están sujetas a disponibilidad y a las condiciones que se
        publiquen en cada una. Podemos ofrecer precios diferenciados por tipo de cliente (por
        ejemplo, mayoreo); dichos precios aplican únicamente a las cuentas autorizadas para ese
        nivel.
      </Section>

      <Section title="4. Cuenta de usuario">
        Para ciertas funciones debes registrarte y proporcionar información veraz y actualizada.
        Eres responsable de mantener la confidencialidad de tus credenciales y de la actividad
        realizada con tu cuenta.
      </Section>

      <Section title="5. Entregas">
        La cobertura, tiempos y costos de entrega se informan al confirmar la cotización o en la
        sección correspondiente del sitio. {"[Detallar política de entrega — pendiente]"}
      </Section>

      <Section title="6. Pagos">
        Las formas de pago disponibles se informan al confirmar la cotización.{" "}
        {"[Detallar métodos de pago cuando apliquen — pendiente]"}
      </Section>

      <Section title="7. Devoluciones, cancelaciones y garantías">
        Las devoluciones y garantías se rigen por la Ley Federal de Protección al Consumidor y, en
        su caso, por la garantía del fabricante de cada producto.{" "}
        {"[Detallar política de devoluciones, cancelaciones y garantías — pendiente]"}
      </Section>

      <Section title="8. Propiedad intelectual">
        Los contenidos del sitio (imágenes, textos, logos y marcas) son propiedad de{" "}
        {BUSINESS.tradeName} o de sus proveedores. No está permitida su reproducción sin
        consentimiento previo por escrito.
      </Section>

      <Section title="9. Responsabilidad">
        No nos hacemos responsables por daños o pérdidas derivados del uso o la imposibilidad de uso
        del sitio, salvo en lo que la ley no permita limitar.
      </Section>

      <Section title="10. Privacidad">
        El tratamiento de tus datos personales se rige por nuestro{" "}
        <Link href="/privacy-statement">Aviso de Privacidad</Link> y nuestra{" "}
        <Link href="/cookies-policy">Política de Cookies</Link>.
      </Section>

      <Section title="11. Modificaciones">
        Podemos modificar estos términos en cualquier momento. Las modificaciones serán efectivas a
        partir de su publicación en el sitio.
      </Section>

      <Section title="12. Ley aplicable y jurisdicción">
        Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier
        controversia, las partes se someten a los tribunales competentes de {BUSINESS.jurisdiction},
        sin perjuicio de los derechos que la Ley Federal de Protección al Consumidor reconoce a los
        consumidores ante la PROFECO.
      </Section>

      <Section title="13. Contacto">
        Para preguntas sobre estos términos, contáctanos en:
        <br />
        Correo: <Link href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</Link>
        <br />
        Teléfono: {BUSINESS.phone}
      </Section>
    </Box>
  );
};

export default TermsAndConditions;
