import { describe, it, expect } from "vitest";
import {
  toCapitalizeFirstLetter,
  toCapitalizeWords,
  transformCategoryPath,
  toCamelCase,
  toSlug,
} from "../../utils/cases";

describe("toCapitalizeFirstLetter", () => {
  it("capitalizes the first letter", () => {
    expect(toCapitalizeFirstLetter("hello")).toBe("Hello");
  });

  it("returns empty string for empty input", () => {
    expect(toCapitalizeFirstLetter("")).toBe("");
  });

  it("returns empty string for non-string input", () => {
    expect(toCapitalizeFirstLetter(null as unknown as string)).toBe("");
    expect(toCapitalizeFirstLetter(undefined as unknown as string)).toBe("");
    expect(toCapitalizeFirstLetter(123 as unknown as string)).toBe("");
  });

  it("handles single character", () => {
    expect(toCapitalizeFirstLetter("a")).toBe("A");
  });

  it("preserves rest of string", () => {
    expect(toCapitalizeFirstLetter("hELLO")).toBe("HELLO");
  });

  it("handles accented characters", () => {
    expect(toCapitalizeFirstLetter("ángel")).toBe("Ángel");
  });
});

describe("toCapitalizeWords", () => {
  it("capitalizes every word", () => {
    expect(toCapitalizeWords("hello world")).toBe("Hello World");
  });

  it('returns "String no válido" for empty string', () => {
    expect(toCapitalizeWords("")).toBe("String no válido");
  });

  it('returns "String no válido" for non-string', () => {
    expect(toCapitalizeWords(null as unknown as string)).toBe("String no válido");
  });

  it("handles single word", () => {
    expect(toCapitalizeWords("test")).toBe("Test");
  });

  it("handles accented characters", () => {
    expect(toCapitalizeWords("ñoño año")).toBe("Ñoño Año");
  });
});

describe("transformCategoryPath", () => {
  it("replaces hyphens and commas with spaces and capitalizes", () => {
    expect(transformCategoryPath("hello-world")).toBe("Hello World");
    expect(transformCategoryPath("foo,bar")).toBe("Foo Bar");
  });

  it("returns empty string for empty input", () => {
    expect(transformCategoryPath("")).toBe("");
  });

  it("returns empty string for non-string", () => {
    expect(transformCategoryPath(null as unknown as string)).toBe("");
  });

  it("handles mixed separators", () => {
    expect(transformCategoryPath("a-b,c")).toBe("A B C");
  });
});

describe("toCamelCase", () => {
  it("converts space-separated to camelCase", () => {
    expect(toCamelCase("hello world")).toBe("helloWorld");
  });

  it("converts hyphen-separated to camelCase", () => {
    expect(toCamelCase("my-variable-name")).toBe("myVariableName");
  });

  it("handles single word", () => {
    expect(toCamelCase("hello")).toBe("hello");
  });

  it("handles special characters as separators", () => {
    expect(toCamelCase("foo_bar_baz")).toBe("fooBarBaz");
  });
});

describe("toSlug", () => {
  it("converts to lowercase slug", () => {
    expect(toSlug("Hello World")).toBe("hello-world");
  });

  it("removes special characters but keeps accents and ñ", () => {
    expect(toSlug("Plomería y Tuberías")).toBe("plomería-y-tuberías");
    expect(toSlug("Año Nuevo")).toBe("año-nuevo");
  });

  it("collapses multiple spaces into a single hyphen", () => {
    expect(toSlug("hello   world")).toBe("hello-world");
  });

  it("handles already lowercase", () => {
    expect(toSlug("test")).toBe("test");
  });
});
