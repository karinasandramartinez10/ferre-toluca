import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../config", () => ({
  api: { post: vi.fn() },
}));
vi.mock("../../config/private", () => ({
  default: { get: vi.fn(), patch: vi.fn() },
}));

import { api } from "../../config";
import privateApi from "../../config/private";

const mockApi = api as unknown as { post: ReturnType<typeof vi.fn> };
const mockPrivateApi = privateApi as unknown as {
  get: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
};

import {
  submitContactRequest,
  getContactRequests,
  updateContactRequestStatus,
} from "../../api/contactRequests";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("submitContactRequest", () => {
  it("posts to /contact-requests", async () => {
    mockApi.post.mockResolvedValue({});

    const body = { firstName: "Juan", lastName: "Perez", email: "j@p.com" };
    await submitContactRequest(body);

    expect(mockApi.post).toHaveBeenCalledWith("/contact-requests", body);
  });

  it("throws ApiError with status on failure", async () => {
    mockApi.post.mockRejectedValue({
      response: { status: 409, data: { message: "Email taken" } },
    });

    try {
      await submitContactRequest({ firstName: "A", lastName: "B", email: "a@b.com" });
      expect.unreachable("Should have thrown");
    } catch (err: unknown) {
      const apiErr = err as Error & { status?: number; data?: Record<string, unknown> };
      expect(apiErr.message).toBe("Email taken");
      expect(apiErr.status).toBe(409);
      expect(apiErr.data?.message).toBe("Email taken");
    }
  });
});

describe("getContactRequests", () => {
  it("calls privateApi.get with params", async () => {
    const responseData = { contactRequests: [], count: 0, page: 1, totalPages: 0 };
    mockPrivateApi.get.mockResolvedValue({ data: { data: responseData } });

    const result = await getContactRequests(1, 20, "pending");

    expect(mockPrivateApi.get).toHaveBeenCalledWith("/contact-requests", {
      params: { page: 1, size: 20, status: "pending" },
    });
    expect(result).toEqual(responseData);
  });

  it("throws on failure", async () => {
    mockPrivateApi.get.mockRejectedValue({
      response: { data: { message: "Unauthorized" } },
    });

    await expect(getContactRequests()).rejects.toThrow("Unauthorized");
  });
});

describe("updateContactRequestStatus", () => {
  it("patches status", async () => {
    mockPrivateApi.patch.mockResolvedValue({});

    await updateContactRequestStatus(5, "contacted");

    expect(mockPrivateApi.patch).toHaveBeenCalledWith("/contact-requests/5", {
      status: "contacted",
    });
  });

  it("throws on failure", async () => {
    mockPrivateApi.patch.mockRejectedValue({
      response: { data: { message: "Not found" } },
    });

    await expect(updateContactRequestStatus(999, "contacted")).rejects.toThrow("Not found");
  });
});
