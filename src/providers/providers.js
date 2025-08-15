"use client";

import { SnackbarProvider } from "notistack";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { mainTheme } from "../theme/mainTheme";
import { SocketProvider } from "../context/socket/SocketContext";
import { NotificationsProvider } from "../context/notifications/NotificationsProvider";
import { OrderProvider } from "../context/order/OrderProvider";

export function Providers({ children }) {
  return (
    <ThemeProvider theme={mainTheme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={2500}
        sx={{ "& .SnackbarContent-root": { borderRadius: 8 } }}
      >
        <CssBaseline />
        <SocketProvider>
          <NotificationsProvider>
            <OrderProvider>{children}</OrderProvider>
          </NotificationsProvider>
        </SocketProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default Providers;
