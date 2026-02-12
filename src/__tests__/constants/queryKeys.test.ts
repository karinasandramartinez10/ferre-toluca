import { describe, it, expect } from "vitest";
import { queryKeys } from "../../constants/queryKeys";

describe("queryKeys factory functions", () => {
  describe("statusLogs", () => {
    it("returns a key with the quoteId", () => {
      expect(queryKeys.statusLogs("q1")).toEqual(["statusLogs", "q1"]);
    });

    it("handles numeric quoteId", () => {
      expect(queryKeys.statusLogs(42)).toEqual(["statusLogs", 42]);
    });
  });

  describe("orderHistory", () => {
    it("returns a key with filters object", () => {
      const filters = { page: 1, size: 10, status: "IN_REVIEW" };
      expect(queryKeys.orderHistory(filters)).toEqual(["orderHistory", filters]);
    });
  });

  describe("filteredProducts", () => {
    it("returns a key with filtersKey, page, and pageSize", () => {
      expect(queryKeys.filteredProducts("key1", 2, 10)).toEqual([
        "filteredProducts",
        "key1",
        2,
        10,
      ]);
    });
  });

  describe("filterOptions", () => {
    it("returns a key with normalized filters", () => {
      const filters = { brandIds: [1, 2], categoryIds: [3] };
      const result = queryKeys.filterOptions(filters);
      expect(result[0]).toBe("filterOptions");
      expect(result[1]).toEqual({
        brandIds: [1, 2],
        categoryIds: [3],
        subcategoryIds: [],
        typeIds: [],
        modelIds: [],
        measureIds: [],
        designIds: [],
      });
    });

    it("defaults all filter arrays to empty", () => {
      const result = queryKeys.filterOptions({});
      expect(result[1]).toEqual({
        brandIds: [],
        categoryIds: [],
        subcategoryIds: [],
        typeIds: [],
        modelIds: [],
        measureIds: [],
        designIds: [],
      });
    });
  });

  describe("static keys", () => {
    it("has correct static keys", () => {
      expect(queryKeys.menuTree).toEqual(["menu-tree"]);
      expect(queryKeys.fiscalCatalogs).toEqual(["fiscalCatalogs"]);
      expect(queryKeys.favorites).toEqual(["favorites"]);
      expect(queryKeys.userFiscals).toEqual(["userFiscals"]);
    });
  });
});
