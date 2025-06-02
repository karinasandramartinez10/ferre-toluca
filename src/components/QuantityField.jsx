import { useState, useEffect } from "react";
import { TextField, IconButton, Box } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { useOrderContext } from "../context/order/useOrderContext";

export const QuantityField = ({ productId, quantity }) => {
  const { updateQuantity } = useOrderContext();
  const [value, setValue] = useState(quantity.toString());

  // Si cambian las props externas, sincronizamos
  useEffect(() => {
    setValue(quantity.toString());
  }, [quantity]);

  const commit = () => {
    let n = parseInt(value, 10);
    if (!n || n < 1) n = 1;
    updateQuantity(productId, n);
    setValue(n.toString());
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton
        size="small"
        onClick={() => {
          updateQuantity(productId, quantity - 1 > 1 ? quantity - 1 : 1);
        }}
      >
        <RemoveIcon />
      </IconButton>

      <TextField
        // type"text" + inputMode para teclado numérico
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => {
          // solo dígitos
          if (/^\d*$/.test(e.target.value)) {
            setValue(e.target.value);
          }
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            commit();
            e.currentTarget.blur();
          }
        }}
        sx={{ width: 80, mx: 1 }}
        inputProps={{ style: { textAlign: "center" } }}
      />

      <IconButton
        size="small"
        onClick={() => updateQuantity(productId, quantity + 1)}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};
