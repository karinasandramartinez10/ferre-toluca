"use client";

import { useState } from "react";
import { SnackbarProvider } from "notistack";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { mainTheme } from "../theme/mainTheme";
import { SocketProvider } from "../context/socket/SocketContext";
import { NotificationsProvider } from "../context/notifications/NotificationsProvider";
import { OrderProvider } from "../context/order/OrderProvider";

export function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              const status = error?.response?.status;
              // No reintentar rate-limit ni auth: amplifican la tormenta de requests
              if (status === 429 || status === 401) return false;
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;
