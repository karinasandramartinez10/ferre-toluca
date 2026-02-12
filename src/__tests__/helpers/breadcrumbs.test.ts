import { describe, it, expect } from "vitest";
import {
  homeItem,
  buildCategoryItem,
  buildSubcategoryItem,
  buildBrandItem,
  buildTypeItem,
  buildBrandBreadcrumbs,
  buildCategoryBreadcrumbs,
  buildSubcategoryBreadcrumbs,
  buildTypeBreadcrumbs,
} from "../../helpers/breadcrumbs";

describe("buildCategoryItem", () => {
  it("builds a category breadcrumb item", () => {
    const item = buildCategoryItem("herramientas", 5);
    expect(item).toEqual({
      label: "Herramientas",
      path: "/categories/herramientas?id=5",
    });
  });

  it("returns null if name is missing", () => {
    expect(buildCategoryItem("", 5)).toBeNull();
    expect(buildCategoryItem(null, 5)).toBeNull();
  });

  it("returns null if id is missing", () => {
    expect(buildCategoryItem("test", null)).toBeNull();
    expect(buildCategoryItem("test", undefined)).toBeNull();
  });
});

describe("buildSubcategoryItem", () => {
  it("builds a subcategory breadcrumb item", () => {
    const item = buildSubcategoryItem("tubería pvc", 10);
    expect(item).toEqual({
      label: "Tubería Pvc",
      path: "/subcategories/tubería-pvc?id=10",
    });
  });

  it("returns null for missing params", () => {
    expect(buildSubcategoryItem("", 1)).toBeNull();
    expect(buildSubcategoryItem("x", null)).toBeNull();
  });
});

describe("buildBrandItem", () => {
  it("builds a brand breadcrumb item", () => {
    const item = buildBrandItem("truper", 3);
    expect(item).toEqual({
      label: "Truper",
      path: "/brands/truper?id=3",
    });
  });

  it("returns null for missing params", () => {
    expect(buildBrandItem(null, 1)).toBeNull();
  });
});

describe("buildTypeItem", () => {
  it("builds a type breadcrumb item", () => {
    const item = buildTypeItem("codos", 7);
    expect(item).toEqual({
      label: "Codos",
      path: "/types/codos?id=7",
    });
  });

  it("returns null for missing params", () => {
    expect(buildTypeItem("", 1)).toBeNull();
  });
});

describe("buildBrandBreadcrumbs", () => {
  it("returns [home, brand]", () => {
    const crumbs = buildBrandBreadcrumbs("truper", 1);
    expect(crumbs).toHaveLength(2);
    expect(crumbs[0]).toEqual(homeItem);
    expect(crumbs[1]!.label).toBe("Truper");
  });

  it("returns [home] when brand params are invalid", () => {
    const crumbs = buildBrandBreadcrumbs("", null);
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0]).toEqual(homeItem);
  });
});

describe("buildCategoryBreadcrumbs", () => {
  it("returns [home, category]", () => {
    const crumbs = buildCategoryBreadcrumbs("pinturas", 2);
    expect(crumbs).toHaveLength(2);
    expect(crumbs[1]!.label).toBe("Pinturas");
  });
});

describe("buildSubcategoryBreadcrumbs", () => {
  it("returns [home, category, subcategory label]", () => {
    const product = { category: { name: "plomería", id: 1 } };
    const crumbs = buildSubcategoryBreadcrumbs("tubos", product);
    expect(crumbs).toHaveLength(3);
    expect(crumbs[0]).toEqual(homeItem);
    expect(crumbs[1]!.label).toBe("Plomería");
    expect(crumbs[2]!.label).toBe("Tubos");
  });

  it("filters out null category when product is undefined", () => {
    const crumbs = buildSubcategoryBreadcrumbs("tubos", undefined);
    expect(crumbs.length).toBeGreaterThanOrEqual(1);
    expect(crumbs[0]).toEqual(homeItem);
  });
});

describe("buildTypeBreadcrumbs", () => {
  it("returns [home, subcategory, type label]", () => {
    const product = { subCategory: { name: "tuberías", id: 2 } };
    const crumbs = buildTypeBreadcrumbs("codos", product);
    expect(crumbs).toHaveLength(3);
    expect(crumbs[0]).toEqual(homeItem);
    expect(crumbs[1]!.label).toBe("Tuberías");
    expect(crumbs[2]!.label).toBe("Codos");
  });

  it("filters out null subcategory when product is undefined", () => {
    const crumbs = buildTypeBreadcrumbs("codos", undefined);
    expect(crumbs.length).toBeGreaterThanOrEqual(1);
    expect(crumbs[0]).toEqual(homeItem);
  });
});
