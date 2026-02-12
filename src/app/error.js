"use client";

import { useEffect } from "react";
import { ErrorUI } from "../components/Error";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return <ErrorUI message="Algo salió mal. Intenta de nuevo." onRetry={reset} />;
}
