import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { classifyRoute } from "../../routes";

describe("classifyRoute", () => {
  it.each([
    ["/admin/quotes", "admin"],
    ["/admin/quotes/5", "admin"],
    ["/admin/clients", "admin"],
    ["/admin/contact-requests", "admin"],
    ["/admin/promotions", "admin"],
    ["/admin/brands", "superAdmin"],
    ["/admin/products", "superAdmin"],
    ["/admin/taxonomy", "superAdmin"],
    ["/admin/invitations", "superAdmin"],
    ["/user/profile", "user"],
    ["/user/profile/history/5", "user"],
    ["/auth/login", "auth"],
    ["/", "public"],
    ["/product/5", "public"],
    ["/checkout", "public"],
  ])("mantiene %s como %s", (pathname, expected) => {
    expect(classifyRoute(pathname)).toBe(expected);
  });

  it.each([
    ["/admin/products/nuevo", "superAdmin"],
    ["/admin/brands/5/editar", "superAdmin"],
    ["/admin/reportes", "admin"],
    ["/admin", "admin"],
    ["/user", "user"],
  ])("protege la subpágina no registrada %s como %s", (pathname, expected) => {
    expect(classifyRoute(pathname)).toBe(expected);
  });

  it.each([
    ["/admin/brandsx", "admin"],
    ["/adminx", "private"],
    ["/username", "private"],
  ])("respeta el límite de segmento en %s", (pathname, expected) => {
    expect(classifyRoute(pathname)).toBe(expected);
  });

  it("trata una ruta desconocida fuera de las áreas privadas como privada", () => {
    expect(classifyRoute("/pagina-nueva")).toBe("private");
  });
});

describe("middleware matcher", () => {
  const source = readFileSync(path.join(process.cwd(), "src/middleware.js"), "utf8");

  it.each(["/admin/:path*", "/user/:path*"])(
    "corre siempre en %s, aunque la ruta termine en .algo",
    (pattern) => {
      expect(source).toContain(`"${pattern}"`);
    }
  );
});
