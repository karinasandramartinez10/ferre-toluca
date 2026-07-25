import { describe, it, expect, vi, beforeEach } from "vitest";

const refreshTokenMock = vi.fn();

vi.mock("../../api/refresh", () => ({
  refreshToken: (...args: unknown[]) => refreshTokenMock(...args),
}));

import { jwtCallback, REFRESH_THRESHOLD_MS, REFRESH_ERROR } from "../../lib/refreshSession";

const nowSec = () => Math.floor(Date.now() / 1000);

// Un token "vivo" con la sesión ya establecida (sin `user`).
const liveToken = (expiresAt: number, extra = {}) => ({
  data: { id: "1", role: "superadmin", access_token: "access-viejo", expires_at: expiresAt },
  refresh_token: "refresh-viejo",
  ...extra,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("jwtCallback — login inicial", () => {
  it("guarda access en data y refresh en la raíz", async () => {
    const user = {
      id: "1",
      email: "a@b.com",
      role: "superadmin",
      access_token: "access-nuevo",
      expires_at: nowSec() + 7200,
      refresh_token: "refresh-nuevo",
    };

    const token = await jwtCallback({ token: {}, user });

    expect(token.data.access_token).toBe("access-nuevo");
    expect(token.refresh_token).toBe("refresh-nuevo");
    // el refresh NO debe quedar dentro de data (lo que se expone al navegador)
    expect(token.data.refresh_token).toBeUndefined();
  });
});

describe("jwtCallback — rotación", () => {
  it("no rota si el access está lejos de expirar", async () => {
    const token = liveToken(nowSec() + 7200); // 2h por delante

    const result = await jwtCallback({ token });

    expect(result).toBe(token);
    expect(refreshTokenMock).not.toHaveBeenCalled();
  });

  it("rota cuando el access entra en la ventana de umbral", async () => {
    refreshTokenMock.mockResolvedValue({
      access_token: "access-rotado",
      refresh_token: "refresh-rotado",
      expires_in: 7200,
    });
    // dentro de los 20 min de umbral
    const token = liveToken(nowSec() + Math.floor(REFRESH_THRESHOLD_MS / 1000) - 60);

    const result = await jwtCallback({ token });

    expect(refreshTokenMock).toHaveBeenCalledWith("refresh-viejo");
    expect(result.data.access_token).toBe("access-rotado");
    expect(result.refresh_token).toBe("refresh-rotado");
    expect(result.data.expires_at).toBeGreaterThan(nowSec() + 7000);
    expect(result.error).toBeUndefined();
  });

  it("marca error si no hay refresh_token", async () => {
    const token = liveToken(nowSec() - 10, { refresh_token: undefined });

    const result = await jwtCallback({ token });

    expect(result.error).toBe(REFRESH_ERROR);
    expect(refreshTokenMock).not.toHaveBeenCalled();
  });

  it("aparca la rotación ante un 429 en vez de matar la sesión", async () => {
    refreshTokenMock.mockRejectedValue({ status: 429 });
    const token = liveToken(nowSec() - 10);

    const result = await jwtCallback({ token });

    expect(result.error).toBeUndefined();
    expect(result.retry_refresh_at).toBeGreaterThan(Date.now());
  });

  it("marca error si el refresh falla por algo que no es 429", async () => {
    refreshTokenMock.mockRejectedValue({ status: 401 });
    const token = liveToken(nowSec() - 10);

    const result = await jwtCallback({ token });

    expect(result.error).toBe(REFRESH_ERROR);
  });

  it("no rota mientras la ventana de parking de 429 sigue abierta", async () => {
    const token = liveToken(nowSec() - 10, { retry_refresh_at: Date.now() + 60_000 });

    const result = await jwtCallback({ token });

    expect(result).toBe(token);
    expect(refreshTokenMock).not.toHaveBeenCalled();
  });
});
