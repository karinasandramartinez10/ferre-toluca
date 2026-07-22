import { describe, it, expect, vi, beforeEach } from "vitest";

const getSessionMock = vi.fn();

vi.mock("next-auth/react", () => ({
  getSession: (...args: unknown[]) => getSessionMock(...args),
}));

import privateApi from "../../config/private";
import { setAccessToken, getAccessToken } from "../../lib/authToken";

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

  it("deja de mandar el token viejo después del logout", async () => {
    setAccessToken("token-viejo");
    setAccessToken(null);
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
