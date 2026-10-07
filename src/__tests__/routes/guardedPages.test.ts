import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { classifyRoute } from "../../routes";

const APP_DIR = path.join(process.cwd(), "src/app");

const findPages = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return findPages(full);
    return /^page\.(js|jsx|ts|tsx)$/.test(entry.name) ? [full] : [];
  });

const toRoute = (file: string) => {
  const segments = path
    .relative(APP_DIR, path.dirname(file))
    .split(path.sep)
    .filter((segment) => segment && !/^\(.*\)$/.test(segment))
    .map((segment) => (/^\[.*\]$/.test(segment) ? "1" : segment));
  return `/${segments.join("/")}`;
};

const pagesInGroup = (group: string) =>
  findPages(APP_DIR)
    .filter((file) => path.relative(APP_DIR, file).split(path.sep)[0] === group)
    .map(toRoute);

describe("cada página queda cubierta por el guard de su grupo", () => {
  it.each(pagesInGroup("(admin)"))("%s exige rol de admin", (route) => {
    expect(["admin", "superAdmin"]).toContain(classifyRoute(route));
  });

  it.each(pagesInGroup("(user)"))("%s exige rol de usuario", (route) => {
    expect(classifyRoute(route)).toBe("user");
  });

  it.each(pagesInGroup("(main)"))("%s está registrada como pública", (route) => {
    expect(classifyRoute(route)).toBe("public");
  });
});
