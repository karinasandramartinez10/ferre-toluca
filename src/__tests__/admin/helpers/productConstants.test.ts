import { describe, it, expect } from "vitest";
import { getSelectOptions } from "../../../app/(admin)/admin/products/constants";

const brands = [{ id: "b1", name: "Marca A" }];
const categories = [{ id: "c1", name: "Cat A" }];
const subcategories = [{ id: "sc1", name: "Subcat A" }];
const types = [{ id: "t1", name: "Type A" }];

describe("getSelectOptions", () => {
  it("returns brands for brandId key", () => {
    expect(getSelectOptions("brandId", brands, categories, subcategories, types)).toBe(brands);
  });

  it("returns categories for categoryId key", () => {
    expect(getSelectOptions("categoryId", brands, categories, subcategories, types)).toBe(
      categories
    );
  });

  it("returns subcategories for subCategoryId key", () => {
    expect(getSelectOptions("subCategoryId", brands, categories, subcategories, types)).toBe(
      subcategories
    );
  });

  it("returns types for typeId key", () => {
    expect(getSelectOptions("typeId", brands, categories, subcategories, types)).toBe(types);
  });

  it("returns [] for unknown key", () => {
    expect(getSelectOptions("unknown", brands, categories, subcategories, types)).toEqual([]);
  });

  it("returns [] when params are undefined", () => {
    expect(getSelectOptions("brandId", undefined, undefined, undefined, undefined)).toEqual([]);
  });
});
