// Throttle del proactive check de revocación (visibilitychange/focus). El BE sugiere
// ≥5 min (MUR-420/421): detecta una sesión revocada en ≤5 min de uso activo sin pegarle
// a GET /auth/session en cada cambio de foco.
export const SESSION_CHECK_THROTTLE_MS = 5 * 60 * 1000;
