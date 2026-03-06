import { describe, it, expect } from "vitest";
import { buildProductFormData } from "../../../app/(admin)/admin/products/buildProductFormData";
import { buildAddProductFormData } from "../../../app/(admin)/admin/add-product/buildAddProductFormData";

describe("buildProductFormData", () => {
  describe("image handling", () => {
    it("appends a real File to FormData", () => {
      const file = new File(["img"], "photo.png", { type: "image/png" });
      const formData = buildProductFormData(
        { name: "Test", code: "T1", description: "Desc", image: file },
        null
      );

      expect(formData.get("image")).toBeInstanceOf(File);
      expect((formData.get("image") as File).name).toBe("photo.png");
    });

    it("does NOT append a PhotoPreview object (regression: [object Object] bug)", () => {
      const photoPreview = { preview: "blob:http://localhost/abc" };
      const formData = buildProductFormData(
        { name: "Test", code: "T1", description: "Desc", image: photoPreview },
        null
      );

      expect(formData.has("image")).toBe(false);
    });

    it("does not append image when null", () => {
      const formData = buildProductFormData(
        { name: "Test", code: "T1", description: "Desc", image: null },
        null
      );

      expect(formData.has("image")).toBe(false);
    });

    it("does not append image when it is a string URL", () => {
      const formData = buildProductFormData(
        { name: "Test", code: "T1", description: "Desc", image: "http://example.com/img.png" },
        null
      );

      expect(formData.has("image")).toBe(false);
    });
  });

  describe("model logic", () => {
    it("appends only modelId when modelId is set", () => {
      const formData = buildProductFormData({ modelId: "model-1", modelName: "SomeModel" }, null);

      expect(formData.get("modelId")).toBe("model-1");
      expect(formData.has("modelName")).toBe(false);
    });

    it("appends only modelName when only modelName is provided", () => {
      const formData = buildProductFormData({ modelId: null, modelName: "NewModel" }, null);

      expect(formData.get("modelName")).toBe("NewModel");
      expect(formData.has("modelId")).toBe(false);
    });

    it("appends both as empty strings when both are empty (remove model)", () => {
      const formData = buildProductFormData({ modelId: "", modelName: "" }, null);

      expect(formData.get("modelId")).toBe("");
      expect(formData.get("modelName")).toBe("");
    });

    it("trims modelName whitespace", () => {
      const formData = buildProductFormData({ modelId: null, modelName: "  Spaced  " }, null);

      expect(formData.get("modelName")).toBe("Spaced");
    });
  });

  describe("updatedAt", () => {
    it("appends updatedAt when present in selected", () => {
      const formData = buildProductFormData(
        { name: "Test" },
        { updatedAt: "2024-01-01T00:00:00Z" }
      );

      expect(formData.get("updatedAt")).toBe("2024-01-01T00:00:00Z");
    });

    it("does not append updatedAt when selected is null", () => {
      const formData = buildProductFormData({ name: "Test" }, null);

      expect(formData.has("updatedAt")).toBe(false);
    });

    it("does not append updatedAt when selected has no updatedAt", () => {
      const formData = buildProductFormData({ name: "Test" }, {});

      expect(formData.has("updatedAt")).toBe(false);
    });
  });

  describe("standard fields", () => {
    it("appends all provided fields", () => {
      const data = {
        name: "Tornillo",
        code: "T001",
        color: "Rojo",
        qualifier: "Premium",
        description: "Desc",
        specifications: "Specs",
        brandId: "b1",
        categoryId: "c1",
        subCategoryId: "sc1",
        typeId: "t1",
        measureValue: "10",
        measureId: "m1",
        secondaryMeasureValue: "5",
        secondaryMeasureId: "m2",
        modelId: "",
        modelName: "",
      };

      const formData = buildProductFormData(data, null);

      expect(formData.get("name")).toBe("Tornillo");
      expect(formData.get("code")).toBe("T001");
      expect(formData.get("brandId")).toBe("b1");
      expect(formData.get("measureValue")).toBe("10");
    });

    it("skips falsy optional fields", () => {
      const formData = buildProductFormData(
        { name: "X", code: "", modelId: "", modelName: "" },
        null
      );

      expect(formData.has("code")).toBe(false);
      expect(formData.get("name")).toBe("X");
    });
  });
});

describe("buildAddProductFormData", () => {
  const baseValues = {
    brandId: "b1",
    categoryId: "c1",
    hasType: "no",
    subCategoryId: "sc1",
    typeId: "t1",
  };

  const baseRow = {
    name: "Tornillo",
    description: "Desc",
    code: "t001",
    specifications: "Specs",
    color: "Rojo",
    qualifier: "Premium",
    secondaryMeasureValue: "",
    secondaryMeasureId: null,
    modelId: null,
    modelName: "",
    measureId: "m1",
    measureValue: "10",
  };

  it("serializes products with array notation", () => {
    const formData = buildAddProductFormData(baseValues, [baseRow]);

    expect(formData.get("products[0][name]")).toBe("Tornillo");
    expect(formData.get("products[0][code]")).toBe("T001"); // uppercased
    expect(formData.get("products[0][description]")).toBe("Desc");
  });

  it("appends typeId only when hasType is 'yes'", () => {
    const withType = { ...baseValues, hasType: "yes", typeId: "t1" };
    const formData = buildAddProductFormData(withType, [baseRow]);

    expect(formData.get("typeId")).toBe("t1");
  });

  it("does not append typeId when hasType is 'no'", () => {
    const formData = buildAddProductFormData(baseValues, [baseRow]);

    expect(formData.has("typeId")).toBe(false);
  });

  it("appends image when provided", () => {
    const file = new File(["img"], "test.png", { type: "image/png" });
    const values = { ...baseValues, image: file };
    const formData = buildAddProductFormData(values, [baseRow]);

    expect(formData.get("image")).toBeInstanceOf(File);
  });

  it("does not append image when not provided", () => {
    const formData = buildAddProductFormData(baseValues, [baseRow]);

    expect(formData.has("image")).toBe(false);
  });

  it("serializes multiple rows correctly", () => {
    const rows = [baseRow, { ...baseRow, name: "Clavo", code: "c002" }];
    const formData = buildAddProductFormData(baseValues, rows);

    expect(formData.get("products[0][name]")).toBe("Tornillo");
    expect(formData.get("products[1][name]")).toBe("Clavo");
    expect(formData.get("products[1][code]")).toBe("C002");
  });

  it("appends modelId when present, not modelName", () => {
    const row = { ...baseRow, modelId: "mod1", modelName: "ModelX" };
    const formData = buildAddProductFormData(baseValues, [row]);

    expect(formData.get("products[0][modelId]")).toBe("mod1");
    expect(formData.has("products[0][modelName]")).toBe(false);
  });

  it("appends modelName when modelId is null", () => {
    const row = { ...baseRow, modelId: null, modelName: "NewModel" };
    const formData = buildAddProductFormData(baseValues, [row]);

    expect(formData.get("products[0][modelName]")).toBe("NewModel");
    expect(formData.has("products[0][modelId]")).toBe(false);
  });
});
