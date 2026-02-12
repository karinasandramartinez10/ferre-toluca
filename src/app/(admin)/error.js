"use client";

import { useEffect } from "react";
import { ErrorUI } from "../../components/Error";

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error("Error en sección admin:", error);
  }, [error]);

  return (
    <ErrorUI
      message="Ocurrió un error en el panel de administración. Intenta de nuevo."
      onRetry={reset}
    />
  );
}
