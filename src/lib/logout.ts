import { signOut } from "next-auth/react";
import { revokeSession } from "../api/auth";
import { clearAccessToken } from "./authToken";

interface LogoutOptions {
  callbackUrl?: string;
}

export async function logout(options?: LogoutOptions): Promise<void> {
  try {
    await revokeSession();
  } catch {
    // Si la revocación falla (red caída, token ya vencido) igual cerramos la sesión
    // local: dejar al usuario dentro sería peor que no alcanzar a blacklistear.
  }
  clearAccessToken();
  await signOut(options);
}
