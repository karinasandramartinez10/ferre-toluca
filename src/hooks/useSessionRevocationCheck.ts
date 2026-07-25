"use client";

import { useEffect, useRef } from "react";
import { checkSession } from "../api/auth";
import { SESSION_CHECK_THROTTLE_MS } from "../constants/session";

// Con AuthGuard stateless, un token revocado-pero-no-expirado sigue pasando las
// llamadas normales. La única forma de detectar revocación es pokear GET /auth/session
// al volver el foco a la pestaña; el interceptor de private decide refrescar (si expiró)
// o cerrar sesión (si revocó). El hook sólo dispara, throttleado por pestaña.
export function useSessionRevocationCheck(enabled: boolean) {
  const lastCheckedAt = useRef(0);

  useEffect(() => {
    if (!enabled) return undefined;

    const check = () => {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - lastCheckedAt.current < SESSION_CHECK_THROTTLE_MS) return;
      lastCheckedAt.current = now;
      // El logout lo maneja el interceptor; aquí sólo silenciamos el rechazo.
      checkSession().catch(() => {});
    };

    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);
    return () => {
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
    };
  }, [enabled]);
}
