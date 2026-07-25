import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";

const checkSessionMock = vi.fn();

vi.mock("../../api/auth", () => ({
  checkSession: () => checkSessionMock(),
}));

import { useSessionRevocationCheck } from "../../hooks/useSessionRevocationCheck";
import { SESSION_CHECK_THROTTLE_MS } from "../../constants/session";

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  checkSessionMock.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.useRealTimers();
});

const fireFocus = () => window.dispatchEvent(new Event("focus"));

describe("useSessionRevocationCheck", () => {
  it("verifica la sesión al enfocar la pestaña", () => {
    renderHook(() => useSessionRevocationCheck(true));

    fireFocus();

    expect(checkSessionMock).toHaveBeenCalledTimes(1);
  });

  it("no verifica dos veces dentro de la ventana de throttle", () => {
    renderHook(() => useSessionRevocationCheck(true));

    fireFocus();
    fireFocus();

    expect(checkSessionMock).toHaveBeenCalledTimes(1);
  });

  it("vuelve a verificar pasada la ventana de throttle", () => {
    renderHook(() => useSessionRevocationCheck(true));

    fireFocus();
    vi.advanceTimersByTime(SESSION_CHECK_THROTTLE_MS + 1);
    fireFocus();

    expect(checkSessionMock).toHaveBeenCalledTimes(2);
  });

  it("no hace nada si no está habilitado", () => {
    renderHook(() => useSessionRevocationCheck(false));

    fireFocus();

    expect(checkSessionMock).not.toHaveBeenCalled();
  });

  it("quita los listeners al desmontar", () => {
    const { unmount } = renderHook(() => useSessionRevocationCheck(true));

    unmount();
    fireFocus();

    expect(checkSessionMock).not.toHaveBeenCalled();
  });
});
