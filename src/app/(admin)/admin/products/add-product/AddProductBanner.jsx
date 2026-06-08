import { Alert, Collapse, Button, Typography, Box } from "@mui/material";
import { useState } from "react";

const BANNER_CONTENT = {
  single: {
    summary: (
      <>
        Da de alta <b>un producto</b> con todos sus datos: marca, categoría, medidas, modelo, imagen
        y <b>precios por tipo de cliente</b> (Precio A público obligatorio; B, C y D opcionales).
      </>
    ),
    details: [
      <>
        El campo de <b>modelo</b> se autocompleta según la marca seleccionada; si escribes uno nuevo
        se registra automáticamente. La <b>categoría</b> filtra las subcategorías y tipos
        disponibles.
      </>,
      <>
        Si tienes muchos productos a la vez, usa <b>Carga masiva (CSV)</b> en la pestaña de arriba.
      </>,
    ],
  },
  csv: {
    summary: (
      <>
        Sube un archivo CSV donde cada fila es un producto independiente con su propia{" "}
        <b>marca, categoría, subcategoría y tipo</b>. Si alguna no existe en el sistema, se creará
        automáticamente. Opcionalmente puedes agregar una imagen compartida para todos los productos
        del archivo.
      </>
    ),
    details: [
      <>
        Descarga la <b>plantilla CSV</b> para ver las columnas disponibles. Los campos obligatorios
        son <b>nombre, descripción, código, marca, categoría y Precio A</b> (precio público). Los
        precios B, C y D son opcionales (por tipo de cliente). El resto son opcionales.
      </>,
      <>
        Al subir el CSV verás una <b>vista previa</b> de las primeras filas para que confirmes que
        los datos se leyeron correctamente antes de importar. Si el backend detecta errores, se
        mostrarán detallados por número de fila.
      </>,
    ],
  },
};

export const AddProductBanner = ({ variant = "single" }) => {
  const [open, setOpen] = useState(true);
  const [showFull, setShowFull] = useState(false);

  const content = BANNER_CONTENT[variant];

  return (
    <Collapse in={open}>
      <Alert
        variant="outlined"
        severity="info"
        sx={{
          mb: 2,
          "& .MuiAlert-message": {
            width: "100%",
            display: "flex",
            flexDirection: "column",
          },
          fontSize: "0.95rem",
        }}
      >
        <Typography variant="body2" paragraph sx={{ mb: showFull ? 1 : 0 }}>
          {content.summary}
        </Typography>

        {showFull &&
          content.details.map((detail, idx) => (
            <Typography key={idx} variant="body2" paragraph sx={{ mb: 1 }}>
              {detail}
            </Typography>
          ))}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Button
            onClick={() => setShowFull((prev) => !prev)}
            variant="text"
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {showFull ? "Ver menos" : "¿Cómo funciona?"}
          </Button>

          <Button
            aria-label="Cerrar mensaje de instrucciones"
            size="small"
            onClick={() => setOpen(false)}
          >
            Listo, ya leí
          </Button>
        </Box>
      </Alert>
    </Collapse>
  );
};
