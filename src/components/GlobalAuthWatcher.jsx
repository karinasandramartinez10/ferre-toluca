"use client";
import { useSession, signOut } from "next-auth/react";
import { useSnackbar } from "notistack";
import { useEffect, useRef } from "react";
import { authEvents } from "../lib/authEvents";
import { EVENTS_EMITERS } from "../lib/events";

export default function GlobalAuthWatcher() {
  const { enqueueSnackbar } = useSnackbar();
  const alreadyNotified = useRef(false);

  useEffect(() => {
    const handler = () => {
      if (alreadyNotified.current) return;
      alreadyNotified.current = true;

      enqueueSnackbar(
        "Tu sesión ha expirado. Por favor inicia sesión nuevamente",
        {
          variant: "warning",
          autoHideDuration: 3000,
        }
      );

      // espera 3.5s para que termine el autoHide
      setTimeout(() => {
        signOut({ callbackUrl: "/auth/login" });
      }, 3500);
    };

    authEvents.on(EVENTS_EMITERS.AUTH.SESSION_EXPIRED, handler);
    return () => authEvents.off(EVENTS_EMITERS.AUTH.SESSION_EXPIRED, handler);
  }, [enqueueSnackbar]);

  // Resetear cuando el usuario no esté autenticado
  const { status } = useSession();
  useEffect(() => {
    if (status !== "authenticated") {
      alreadyNotified.current = false;
    }
  }, [status]);

  return null;
}
