import { Alert, Collapse, Button } from "@mui/material";
import { useState } from "react";

export const AddProductBanner = () => {
  const [open, setOpen] = useState(true);

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
        }}
      >
        <>
          <div>
            Estás agregando productos por lote. Cada fila representa un producto
            diferente, pero todos compartirán la misma{" "}
            <b>marca, categoría, subcategoría y subtipo</b> definidos arriba.{" "}
            Además, todos los productos de esta tanda usarán{" "}
            <b>la misma imagen</b>.<br />
            Presiona <b>Enter</b> para guardar cada fila individualmente. Al
            finalizar, haz clic en <b>“Añadir productos”</b> para guardar el
            grupo completo.
            Podrás iniciar un nuevo grupo con otra imagen y otros datos
            generales después de guardar este.
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <Button
              color="error"
              size="small"
              variant="contained"
              onClick={() => setOpen(false)}
            >
              Entendido
            </Button>
          </div>
        </>
      </Alert>
    </Collapse>
  );
};
