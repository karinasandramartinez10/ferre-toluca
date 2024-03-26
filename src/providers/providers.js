"use client"; // TODO: check if we can remove

import { SnackbarProvider } from "notistack";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { mainTheme } from "../theme/mainTheme";

export function Providers({ children }) {
  return (
    <ThemeProvider theme={mainTheme}>
      <SnackbarProvider maxSnack={3}>
        <CssBaseline />
        {children}
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default Providers;
