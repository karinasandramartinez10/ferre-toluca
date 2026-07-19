"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_DAYS,
  CONSENT_VERSION,
  OPTIONAL_CATEGORIES,
} from "../../constants/cookieConsent";
import { CookieConsentContext } from "./CookieConsentContext";

const readStoredConsent = () => {
  const raw = Cookies.get(CONSENT_COOKIE);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.version === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
};

export const CookieConsentProvider = ({ children }) => {
  const [consent, setConsent] = useState(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setConsent(readStoredConsent());
    setReady(true);
  }, []);

  const persist = useCallback((prefs) => {
    const value = { essential: true, version: CONSENT_VERSION };
    OPTIONAL_CATEGORIES.forEach((key) => {
      value[key] = !!prefs[key];
    });
    Cookies.set(CONSENT_COOKIE, JSON.stringify(value), {
      expires: CONSENT_MAX_AGE_DAYS,
      sameSite: "Lax",
      path: "/",
    });
    setConsent(value);
    setSettingsOpen(false);
  }, []);

  const acceptAll = useCallback(
    () => persist(Object.fromEntries(OPTIONAL_CATEGORIES.map((k) => [k, true]))),
    [persist]
  );
  const rejectAll = useCallback(
    () => persist(Object.fromEntries(OPTIONAL_CATEGORIES.map((k) => [k, false]))),
    [persist]
  );

  const hasConsent = useCallback(
    (category) => (category === "essential" ? true : !!consent?.[category]),
    [consent]
  );

  const value = useMemo(
    () => ({
      consent,
      ready,
      showBanner: ready && !consent,
      settingsOpen,
      acceptAll,
      rejectAll,
      savePreferences: persist,
      hasConsent,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
    }),
    [consent, ready, settingsOpen, acceptAll, rejectAll, persist, hasConsent]
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
};

export default CookieConsentProvider;
