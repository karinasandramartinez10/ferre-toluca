import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../config", () => ({
  api: { get: vi.fn() },
}));
vi.mock("../../config/private", () => ({
  default: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
}));

import { api } from "../../config";
import privateApi from "../../config/private";

const mockApi = api as unknown as { get: ReturnType<typeof vi.fn> };
const mockPrivateApi = privateApi as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

import {
  validateInvitation,
  getInvitations,
  createInvitation,
  revokeInvitation,
} from "../../api/invitations";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("validateInvitation", () => {
  it("returns validation data on success", async () => {
    const validationData = { valid: true, email: "a@b.com" };
    mockApi.get.mockResolvedValue({ data: validationData });

    const result = await validateInvitation("token123");

    expect(mockApi.get).toHaveBeenCalledWith("/invitations/validate/token123");
    expect(result).toEqual(validationData);
  });

  it("returns { valid: false } on error", async () => {
    mockApi.get.mockRejectedValue(new Error("Network error"));

    const result = await validateInvitation("bad-token");
    expect(result).toEqual({ valid: false });
  });
});

describe("getInvitations", () => {
  it("calls privateApi.get with correct params", async () => {
    const responseData = { invitations: [], count: 0, page: 1, totalPages: 0 };
    mockPrivateApi.get.mockResolvedValue({ data: { data: responseData } });

    const result = await getInvitations(2, 10, "pending");

    expect(mockPrivateApi.get).toHaveBeenCalledWith("/invitations", {
      params: { page: 2, size: 10, status: "pending" },
    });
    expect(result).toEqual(responseData);
  });

  it("throws with API error message on failure", async () => {
    mockPrivateApi.get.mockRejectedValue({
      response: { data: { message: "Forbidden" } },
    });

    await expect(getInvitations()).rejects.toThrow("Forbidden");
  });
});

describe("createInvitation", () => {
  it("posts body and returns created invitation", async () => {
    const invitation = { id: 1, email: "a@b.com" };
    mockPrivateApi.post.mockResolvedValue({ data: { data: invitation } });

    const result = await createInvitation({ email: "a@b.com" });

    expect(mockPrivateApi.post).toHaveBeenCalledWith("/invitations", { email: "a@b.com" });
    expect(result).toEqual(invitation);
  });

  it("throws on failure", async () => {
    mockPrivateApi.post.mockRejectedValue({
      response: { data: { message: "Email already invited" } },
    });

    await expect(createInvitation({ email: "a@b.com" })).rejects.toThrow("Email already invited");
  });
});

describe("revokeInvitation", () => {
  it("calls delete with correct id", async () => {
    mockPrivateApi.delete.mockResolvedValue({});

    await revokeInvitation(5);

    expect(mockPrivateApi.delete).toHaveBeenCalledWith("/invitations/5");
  });

  it("throws on failure", async () => {
    mockPrivateApi.delete.mockRejectedValue({
      response: { data: { message: "Not found" } },
    });

    await expect(revokeInvitation(999)).rejects.toThrow("Not found");
  });
});
