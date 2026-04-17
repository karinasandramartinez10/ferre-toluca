import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../config/private", () => ({
  default: { get: vi.fn(), patch: vi.fn() },
}));

import privateApi from "../../config/private";

const mockPrivateApi = privateApi as unknown as {
  get: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
};

import { getSettings, updateSetting } from "../../api/admin/settings";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getSettings", () => {
  it("calls privateApi.get /settings and returns data", async () => {
    const settings = [{ id: 1, key: "WHOLESALE_MIN_QUANTITY", value: "10" }];
    mockPrivateApi.get.mockResolvedValue({ data: { data: settings } });

    const result = await getSettings();

    expect(mockPrivateApi.get).toHaveBeenCalledWith("/settings");
    expect(result).toEqual(settings);
  });

  it("throws on failure", async () => {
    mockPrivateApi.get.mockRejectedValue({
      response: { data: { message: "Unauthorized" } },
    });

    await expect(getSettings()).rejects.toThrow("Unauthorized");
  });
});

describe("updateSetting", () => {
  it("patches /settings/:key with value", async () => {
    mockPrivateApi.patch.mockResolvedValue({});

    await updateSetting("WHOLESALE_MIN_QUANTITY", "20");

    expect(mockPrivateApi.patch).toHaveBeenCalledWith("/settings/WHOLESALE_MIN_QUANTITY", {
      value: "20",
    });
  });

  it("throws on failure", async () => {
    mockPrivateApi.patch.mockRejectedValue({
      response: { data: { message: "Forbidden" } },
    });

    await expect(updateSetting("INVALID_KEY", "x")).rejects.toThrow("Forbidden");
  });
});
