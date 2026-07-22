import { describe, it, expect, vi, beforeEach } from "vitest";

const signOutMock = vi.fn();
const revokeSessionMock = vi.fn();

vi.mock("next-auth/react", () => ({
  signOut: (...args: unknown[]) => signOutMock(...args),
}));

vi.mock("../../api/auth", () => ({
  revokeSession: () => revokeSessionMock(),
}));

import { logout } from "../../lib/logout";
import { setAccessToken, getAccessToken } from "../../lib/authToken";

beforeEach(() => {
  vi.clearAllMocks();
  revokeSessionMock.mockResolvedValue(undefined);
  setAccessToken("token-vivo");
});

describe("logout", () => {
  it("revoca el token en el BE antes de cerrar la sesión local", async () => {
    const order: string[] = [];
    revokeSessionMock.mockImplementation(async () => {
      order.push("revoke");
    });
    signOutMock.mockImplementation(async () => {
      order.push("signOut");
    });

    await logout({ callbackUrl: "/" });

    expect(order).toEqual(["revoke", "signOut"]);
    expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: "/" });
  });

  it("limpia el token en memoria", async () => {
    await logout();

    expect(getAccessToken()).toBeNull();
  });

  it("cierra la sesión igual si la revocación falla", async () => {
    revokeSessionMock.mockRejectedValue(new Error("network down"));

    await expect(logout({ callbackUrl: "/" })).resolves.toBeUndefined();

    expect(signOutMock).toHaveBeenCalledTimes(1);
    expect(getAccessToken()).toBeNull();
  });
});
