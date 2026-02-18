import { Alert, Collapse, Button, Typography, Box } from "@mui/material";
import { useState } from "react";

const BANNER_CONTENT = {
  batch: {
    summary: (
      <>
        Todos los productos de este lote compartirán la misma{" "}
        <b>marca, categoría, subcategoría, variante</b> e <b>imagen</b>. Primero selecciona los
        datos generales, luego agrega cada producto como una fila en la tabla.
      </>
    ),
    details: [
      <>
        Puedes agregar filas manualmente o <b>importar un CSV</b> con la plantilla proporcionada. El
        campo de <b>modelo</b> se autocompleta según la marca seleccionada. Si escribes un modelo
        nuevo, se registrará automáticamente.
      </>,
      <>
        Presiona <b>Enter</b> o haz clic fuera de la tabla para guardar cada fila. Al finalizar,
        presiona <b>&quot;Añadir productos&quot;</b> para guardar todo el grupo. Luego podrás
        iniciar otro grupo con diferentes datos generales e imagen.
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
        Descarga la <b>plantilla CSV</b> para ver las 14 columnas disponibles. Los campos
        obligatorios son <b>nombre, descripción, código, marca y categoría</b>. El resto son
        opcionales.
      </>,
      <>
        Al subir el CSV verás una <b>vista previa</b> de las primeras filas para que confirmes que
        los datos se leyeron correctamente antes de importar. Si el backend detecta errores, se
        mostrarán detallados por número de fila.
      </>,
    ],
  },
};

export const AddProductBanner = ({ variant = "batch" }) => {
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
