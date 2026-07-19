"use client";

import { Link } from "@mui/material";
import { useCookieConsent } from "../context/cookieConsent/useCookieConsent";

const CookieSettingsLink = () => {
  const { openSettings } = useCookieConsent();
  return (
    <Link component="button" type="button" color="inherit" underline="hover" onClick={openSettings}>
      Preferencias de cookies
    </Link>
  );
};

export default CookieSettingsLink;
