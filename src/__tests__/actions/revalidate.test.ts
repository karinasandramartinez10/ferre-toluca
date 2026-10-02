import { describe, it, expect, vi, beforeEach } from "vitest";
import { revalidatePath } from "next/cache";
import { revalidateProduct } from "../../actions/revalidate";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const revalidatedPaths = () => vi.mocked(revalidatePath).mock.calls.map(([path]) => path);

describe("revalidateProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("revalida el producto, cada variante una sola vez y el home", async () => {
    await revalidateProduct("1", ["1", 2, "3", "2"]);

    expect(revalidatedPaths()).toEqual(["/product/1", "/product/2", "/product/3", "/"]);
  });

  it("ignora ids que no son numéricos", async () => {
    await revalidateProduct("1", ["../admin", "2abc", "", "4"]);

    expect(revalidatedPaths()).toEqual(["/product/1", "/product/4", "/"]);
  });

  it("acota la cantidad de páginas revalidadas", async () => {
    const many = Array.from({ length: 500 }, (_, i) => i + 2);
    await revalidateProduct("1", many);

    const productPaths = revalidatedPaths().filter((p) => p.startsWith("/product/"));
    expect(productPaths).toHaveLength(100);
    expect(productPaths[0]).toBe("/product/1");
  });
});
