import { describe, it, expect, vi, beforeEach } from "vitest";

const getSessionMock = vi.fn();

vi.mock("next-auth/react", () => ({
  getSession: (...args: unknown[]) => getSessionMock(...args),
}));

import privateApi from "../../config/private";
import { setAccessToken, getAccessToken } from "../../lib/authToken";
import { authEvents } from "../../lib/authEvents";
import { EVENTS_EMITERS } from "../../lib/events";

type RequestInterceptor = (config: {
  headers: Record<string, string>;
}) => Promise<{ headers: Record<string, string> }>;

// El interceptor de request es el primero registrado en config/private.
const runRequestInterceptor = () => {
  const handler = privateApi.interceptors.request as unknown as {
    handlers: { fulfilled: RequestInterceptor }[];
  };
  return handler.handlers[0].fulfilled({ headers: {} });
};

const runResponseError = (error: unknown) => {
  const handler = privateApi.interceptors.response as unknown as {
    handlers: { rejected: (e: unknown) => Promise<unknown> }[];
  };
  return handler.handlers[0].rejected(error);
};

beforeEach(() => {
  vi.clearAllMocks();
  setAccessToken(null);
});

describe("interceptor de request de privateApi", () => {
  it("usa el token en memoria sin pedir la sesión por red", async () => {
    setAccessToken("token-en-memoria");

    const config = await runRequestInterceptor();

    expect(config.headers.Authorization).toBe("Bearer token-en-memoria");
    expect(getSessionMock).not.toHaveBeenCalled();
  });

  it("cae a getSession cuando el store todavía está vacío", async () => {
    getSessionMock.mockResolvedValue({ user: { access_token: "token-de-sesion" } });

    const config = await runRequestInterceptor();

    expect(config.headers.Authorization).toBe("Bearer token-de-sesion");
    expect(getSessionMock).toHaveBeenCalledTimes(1);
  });

  it("no manda Authorization si no hay token por ningún lado", async () => {
    getSessionMock.mockResolvedValue(null);

    const config = await runRequestInterceptor();

    expect(config.headers.Authorization).toBeUndefined();
  });
});

describe("guard de servidor en el store", () => {
  it("no expone el token cacheado cuando no hay window", () => {
    setAccessToken("token-de-otro-usuario");
    const originalWindow = globalThis.window;

    // @ts-expect-error simulamos entorno de servidor
    delete globalThis.window;
    const tokenEnServidor = getAccessToken();
    globalThis.window = originalWindow;

    expect(tokenEnServidor).toBeNull();
  });
});

describe("interceptor de response: reintento reactivo de 401", () => {
  it("un error que no es 401 pasa de largo sin tocar la sesión", async () => {
    const error = { response: { status: 500 }, config: { headers: {} } };

    await expect(runResponseError(error)).rejects.toBe(error);
    expect(getSessionMock).not.toHaveBeenCalled();
  });

  it("renueva la sesión y reintenta la request con el token nuevo", async () => {
    getSessionMock.mockResolvedValue({ user: { access_token: "token-nuevo" } });
    const adapter = vi.fn(async (config) => ({
      data: "ok",
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    }));
    privateApi.defaults.adapter = adapter;

    const result = await runResponseError({
      response: { status: 401 },
      config: { headers: {}, method: "get", url: "/x" },
    });

    expect(getAccessToken()).toBe("token-nuevo");
    expect(adapter).toHaveBeenCalledTimes(1);
    expect(adapter.mock.calls[0][0].headers.Authorization).toBe("Bearer token-nuevo");
    // el reintento debe quedar marcado para que un 401 nuevo no vuelva a rotar
    expect(adapter.mock.calls[0][0]._retried).toBe(true);
    expect((result as { data: string }).data).toBe("ok");
  });

  it("cierra sesión cuando el refresh falla (session.error)", async () => {
    getSessionMock.mockResolvedValue({ error: "RefreshTokenError" });
    const onExpired = vi.fn();
    authEvents.once(EVENTS_EMITERS.AUTH.SESSION_EXPIRED, onExpired);

    const error = { response: { status: 401 }, config: { headers: {} } };
    await expect(runResponseError(error)).rejects.toBe(error);

    expect(onExpired).toHaveBeenCalledTimes(1);
  });

  it("cierra sesión (sin reintentar) si una request ya reintentada vuelve a dar 401", async () => {
    const onExpired = vi.fn();
    authEvents.once(EVENTS_EMITERS.AUTH.SESSION_EXPIRED, onExpired);
    const error = { response: { status: 401 }, config: { headers: {}, _retried: true } };

    await expect(runResponseError(error)).rejects.toBe(error);

    // No vuelve a intentar refrescar, pero sí cierra sesión: token revocado.
    expect(getSessionMock).not.toHaveBeenCalled();
    expect(onExpired).toHaveBeenCalledTimes(1);
  });
});
