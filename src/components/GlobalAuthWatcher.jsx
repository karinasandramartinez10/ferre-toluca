"use client";
import { useSession, signOut } from "next-auth/react";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useRef } from "react";
import { authEvents } from "../lib/authEvents";
import { EVENTS_EMITERS } from "../lib/events";
import { useSessionRevocationCheck } from "../hooks/useSessionRevocationCheck";

export default function GlobalAuthWatcher() {
  const { enqueueSnackbar } = useSnackbar();
  const { data: session, status } = useSession();
  const alreadyNotified = useRef(false);

  // Ejecutor único de logout. Todos los detectores de sesión muerta (401 del axios,
  // fallo de refresh de NextAuth) convergen aquí; el guard evita cierres duplicados.
  const doHardLogout = useCallback(() => {
    if (alreadyNotified.current) return;
    alreadyNotified.current = true;

    enqueueSnackbar("Tu sesión ha expirado. Por favor inicia sesión nuevamente", {
      variant: "warning",
      autoHideDuration: 2000,
    });

    // espera a que termine el autoHide antes de redirigir
    setTimeout(() => {
      // `signOut` directo y no `logout`: la sesión ya está muerta (expirada, revocada o
      // con refresh fallido), así que blacklistear el token en el BE sería una llamada muerta.
      signOut({ callbackUrl: "/auth/login" });
    }, 2500);
  }, [enqueueSnackbar]);

  // Detector: interceptor de axios (401 sin recuperación por refresh).
  useEffect(() => {
    authEvents.on(EVENTS_EMITERS.AUTH.SESSION_EXPIRED, doHardLogout);
    return () => authEvents.off(EVENTS_EMITERS.AUTH.SESSION_EXPIRED, doHardLogout);
  }, [doHardLogout]);

  // Detector: fallo del refresh silencioso de NextAuth (señal estándar de Auth.js).
  useEffect(() => {
    if (session?.error === "RefreshTokenError") doHardLogout();
  }, [session?.error, doHardLogout]);

  useEffect(() => {
    if (status !== "authenticated") {
      alreadyNotified.current = false;
    }
  }, [status]);

  // Detector: sesión revocada en el BE (AuthGuard stateless → no la atrapan los 401 normales).
  useSessionRevocationCheck(status === "authenticated");

  return null;
}
