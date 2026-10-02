import { describe, it, expect, vi, beforeEach } from "vitest";
import { CredentialsSignin } from "next-auth";
import { POST } from "../../../modules/requests/methods";
import signIn from "../../../modules/auth/signin";
import authConfig from "../../../auth.config";
import { RATE_LIMITED_CODE, signInErrorMessage } from "../../../modules/auth/signinErrors";

vi.mock("../../../modules/requests/methods", () => ({
  POST: vi.fn(),
}));

vi.mock("next-auth", () => ({
  CredentialsSignin: class CredentialsSignin extends Error {
    code = "credentials";
  },
}));

const authorize = (
  authConfig.providers[0] as unknown as {
    options: { authorize: (c: Record<string, string>) => Promise<unknown> };
  }
).options.authorize;

describe("signIn (BE login)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("distingue un 429 del rate limiter", async () => {
    vi.mocked(POST).mockResolvedValue(new Response("{}", { status: 429 }));
    await expect(signIn({ email: "a@b.mx", password: "x" })).resolves.toEqual({
      status: "rate_limited",
    });
  });

  it("trata un 401 como credenciales inválidas", async () => {
    vi.mocked(POST).mockResolvedValue(new Response("{}", { status: 401 }));
    await expect(signIn({ email: "a@b.mx", password: "x" })).resolves.toEqual({
      status: "error",
    });
  });
});

describe("authorize", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("propaga el rate limit con un code que llega al cliente", async () => {
    vi.mocked(POST).mockResolvedValue(new Response("{}", { status: 429 }));

    const error = (await authorize({ email: "a@b.mx", password: "x" }).catch((e) => e)) as Error & {
      code?: string;
    };

    expect(error).toBeInstanceOf(CredentialsSignin);
    expect(error.code).toBe(RATE_LIMITED_CODE);
  });

  it("mantiene el error genérico para credenciales inválidas", async () => {
    vi.mocked(POST).mockResolvedValue(new Response("{}", { status: 401 }));

    const error = (await authorize({ email: "a@b.mx", password: "x" }).catch((e) => e)) as Error & {
      code?: string;
    };

    expect(error).not.toBeInstanceOf(CredentialsSignin);
    expect(error.message).toBe("Correo o contraseña incorrectos");
  });
});

describe("signInErrorMessage", () => {
  it("muestra el mensaje de espera ante un rate limit", () => {
    expect(signInErrorMessage({ error: "CredentialsSignin", code: RATE_LIMITED_CODE })).toMatch(
      /Demasiados intentos/
    );
  });

  it("mantiene el mensaje de credenciales para cualquier otro error", () => {
    expect(signInErrorMessage({ error: "Configuration" })).toBe("Correo o contraseña incorrectos");
  });
});
