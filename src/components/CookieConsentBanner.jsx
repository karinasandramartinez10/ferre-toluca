"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { COOKIE_CATEGORIES, OPTIONAL_CATEGORIES } from "../constants/cookieConsent";
import { useCookieConsent } from "../context/cookieConsent/useCookieConsent";

const defaultsFrom = (consent) =>
  Object.fromEntries(OPTIONAL_CATEGORIES.map((k) => [k, !!consent?.[k]]));

const CookieConsentBanner = () => {
  const {
    consent,
    showBanner,
    settingsOpen,
    acceptAll,
    rejectAll,
    savePreferences,
    openSettings,
    closeSettings,
  } = useCookieConsent();

  const [prefs, setPrefs] = useState(defaultsFrom(consent));

  useEffect(() => {
    if (settingsOpen) setPrefs(defaultsFrom(consent));
  }, [settingsOpen, consent]);

  return (
    <>
      {showBanner && !settingsOpen && (
        <Box
          role="region"
          aria-label="Aviso de cookies"
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: (theme) => theme.zIndex.snackbar,
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
            boxShadow: "0 -2px 12px rgba(0,0,0,0.12)",
            px: { xs: 2, md: 4 },
            py: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
            sx={{ maxWidth: 1200, mx: "auto" }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              Usamos cookies y tecnologías similares (como el almacenamiento local) esenciales para
              que el sitio funcione y, con tu permiso, cookies de analítica y marketing para mejorar
              tu experiencia. Consulta nuestro{" "}
              <Link href="/privacy-statement" style={{ color: "inherit", fontWeight: 600 }}>
                Aviso de Privacidad
              </Link>{" "}
              y nuestra{" "}
              <Link href="/cookies-policy" style={{ color: "inherit", fontWeight: 600 }}>
                Política de Cookies
              </Link>
              .
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ flexShrink: 0 }}>
              <Button variant="text" color="inherit" onClick={openSettings}>
                Configurar
              </Button>
              <Button variant="outlined" color="primary" onClick={rejectAll}>
                Rechazar
              </Button>
              <Button variant="contained" color="primary" onClick={acceptAll}>
                Aceptar todas
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      <Dialog open={settingsOpen} onClose={closeSettings} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 600 }}>Preferencias de cookies</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Elige qué permitir. Las esenciales (cookies y almacenamiento) no se pueden desactivar
            porque el sitio no funcionaría sin ellas.
          </Typography>
          <Stack spacing={1.5}>
            {COOKIE_CATEGORIES.map((cat) => (
              <Box key={cat.key}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={cat.locked ? true : !!prefs[cat.key]}
                      disabled={cat.locked}
                      onChange={(e) => setPrefs((p) => ({ ...p, [cat.key]: e.target.checked }))}
                    />
                  }
                  label={<Typography fontWeight={600}>{cat.label}</Typography>}
                />
                <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 6 }}>
                  {cat.description}
                </Typography>
                <Divider sx={{ mt: 1.5 }} />
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, flexWrap: "wrap", gap: 1 }}>
          <Button variant="text" color="inherit" onClick={rejectAll}>
            Rechazar todas
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="outlined" color="primary" onClick={() => savePreferences(prefs)}>
            Guardar preferencias
          </Button>
          <Button variant="contained" color="primary" onClick={acceptAll}>
            Aceptar todas
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CookieConsentBanner;
