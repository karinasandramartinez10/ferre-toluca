import { Stack, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

const MessageSection = ({ control }) => (
  <Stack mt={2} gap={1}>
    <Typography variant="h4">Checkout</Typography>
    <Typography id="quote-modal-description">Agrega un mensaje</Typography>
    <Controller
      control={control}
      name="message"
      render={({ field, fieldState: { invalid, error } }) => (
        <TextField
          label="Mensaje *"
          multiline
          fullWidth
          placeholder="Quisiera saber si..."
          error={invalid}
          helperText={error?.message || ""}
          variant="outlined"
          rows={4}
          required
          inputProps={{
            form: { autocomplete: "off" },
          }}
          InputProps={{
            sx: { borderRadius: "8px", background: "#FFF" },
          }}
          {...field}
        />
      )}
    />
  </Stack>
);

export default MessageSection;
