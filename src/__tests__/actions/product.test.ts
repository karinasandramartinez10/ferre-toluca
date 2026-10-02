import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getProductById, fetchGroupedProductsServer } from "../../actions/product";

const respond = (status: number, body: unknown = {}) =>
  Promise.resolve(new Response(JSON.stringify(body), { status }));

describe("getProductById (server)", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("devuelve el producto", async () => {
    vi.mocked(fetch).mockReturnValue(respond(200, { data: { id: 1 } }));
    await expect(getProductById("1")).resolves.toEqual({ id: 1 });
  });

  it("devuelve null solo cuando el producto no existe", async () => {
    vi.mocked(fetch).mockReturnValue(respond(404));
    await expect(getProductById("1")).resolves.toBeNull();
  });

  it.each([429, 500, 503])(
    "lanza ante un %i para no cachear la página como 'no encontrado'",
    async (status) => {
      vi.mocked(fetch).mockReturnValue(respond(status));
      await expect(getProductById("1")).rejects.toThrow(String(status));
    }
  );

  it("lanza si el BE no responde", async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError("fetch failed"));
    await expect(getProductById("1")).rejects.toThrow("fetch failed");
  });
});

describe("fetchGroupedProductsServer", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("devuelve los productos agrupados", async () => {
    vi.mocked(fetch).mockReturnValue(respond(200, { products: [{ id: 1 }] }));
    await expect(fetchGroupedProductsServer()).resolves.toEqual([{ id: 1 }]);
  });

  it("lanza ante un 429 en vez de cachear un home vacío", async () => {
    vi.mocked(fetch).mockReturnValue(respond(429));
    await expect(fetchGroupedProductsServer()).rejects.toThrow("429");
  });
});
