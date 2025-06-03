import { Alert, Collapse, Button, Typography, Box } from "@mui/material";
import { useState } from "react";

export const AddProductBanner = () => {
  const [open, setOpen] = useState(true);
  const [showFull, setShowFull] = useState(false);

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
        <Typography variant="body3" paragraph>
          Estás agregando productos por lote. Cada fila representa un producto
          diferente, pero todos compartirán la misma{" "}
          <b>marca, categoría, subcategoría</b> y <b>variante de producto</b>. Además, se
          usará <b>una sola imagen</b> para todos los productos.
        </Typography>

        {showFull && (
          <>
            <Typography variant="body3" paragraph>
              El campo de <b>modelo</b> se autocompleta según la marca
              seleccionada. Si cambias la marca, también se actualizarán los
              modelos sugeridos. Puedes escribir un modelo nuevo si no existe
              para esa marca, y se registrará automáticamente.
            </Typography>

            <Typography variant="body3"  paragraph>
              Presiona <b>Enter</b> o haz clic fuera de la tabla para guardar
              cada fila. Al finalizar, presiona <b>“Añadir productos”</b> para
              guardar todo el grupo. Luego podrás iniciar otro grupo con
              diferentes datos generales e imagen.
            </Typography>
          </>
        )}
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
