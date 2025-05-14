"use client"; // TODO: check if we can remove

import { SnackbarProvider } from "notistack";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { mainTheme } from "../theme/mainTheme";
import { OrderProvider } from "../context/order/OrderProvider";

export function Providers({ children }) {
  return (
    <ThemeProvider theme={mainTheme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={4000}
        sx={{ "& .SnackbarContent-root": { borderRadius: 8 } }}
      >
        <CssBaseline />
        <OrderProvider>{children}</OrderProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default Providers;
