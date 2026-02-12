"use client";

import { useEffect } from "react";
import { ErrorUI } from "../../components/Error";

export default function MainError({ error, reset }) {
  useEffect(() => {
    console.error("Error en sección principal:", error);
  }, [error]);

  return (
    <ErrorUI message="Ocurrió un error al cargar la página. Intenta de nuevo." onRetry={reset} />
  );
}
