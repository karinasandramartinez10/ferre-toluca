import { useContext } from "react";
import { CookieConsentContext } from "./CookieConsentContext";

export const useCookieConsent = () => {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent debe usarse dentro de CookieConsentProvider");
  }
  return ctx;
};
