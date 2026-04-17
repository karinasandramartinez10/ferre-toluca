import { describe, it, expect } from "vitest";
import {
  INVITATION_STATUS_COLORS,
  INVITATION_STATUS_LABELS,
  CONTACT_REQUEST_STATUS_COLORS,
  CONTACT_REQUEST_STATUS_LABELS,
  CONTACT_REQUEST_STATUS_OPTIONS,
  CONTACT_REQUEST_TERMINAL_STATUSES,
} from "../../constants/statusMaps";

describe("INVITATION_STATUS_COLORS", () => {
  it("maps all 4 statuses to MUI color names", () => {
    expect(INVITATION_STATUS_COLORS).toEqual({
      pending: "warning",
      accepted: "success",
      expired: "default",
      revoked: "error",
    });
  });
});

describe("INVITATION_STATUS_LABELS", () => {
  it("maps all 4 statuses to Spanish labels", () => {
    expect(INVITATION_STATUS_LABELS).toEqual({
      pending: "Pendiente",
      accepted: "Aceptada",
      expired: "Expirada",
      revoked: "Revocada",
    });
  });
});

describe("CONTACT_REQUEST_STATUS_COLORS", () => {
  it("maps all 4 statuses to MUI color names", () => {
    expect(CONTACT_REQUEST_STATUS_COLORS).toEqual({
      pending: "warning",
      contacted: "info",
      invited: "success",
      rejected: "error",
    });
  });
});

describe("CONTACT_REQUEST_STATUS_LABELS", () => {
  it("maps all 4 statuses to Spanish labels", () => {
    expect(CONTACT_REQUEST_STATUS_LABELS).toEqual({
      pending: "Pendiente",
      contacted: "Contactado",
      invited: "Invitado",
      rejected: "Rechazado",
    });
  });
});

describe("CONTACT_REQUEST_STATUS_OPTIONS", () => {
  it("contains all 4 status strings", () => {
    expect(CONTACT_REQUEST_STATUS_OPTIONS).toEqual(["pending", "contacted", "invited", "rejected"]);
  });

  it("matches keys of CONTACT_REQUEST_STATUS_LABELS", () => {
    expect(CONTACT_REQUEST_STATUS_OPTIONS).toEqual(Object.keys(CONTACT_REQUEST_STATUS_LABELS));
  });
});

describe("CONTACT_REQUEST_TERMINAL_STATUSES", () => {
  it("contains rejected and invited", () => {
    expect(CONTACT_REQUEST_TERMINAL_STATUSES).toEqual(["rejected", "invited"]);
  });

  it("is a subset of status options", () => {
    CONTACT_REQUEST_TERMINAL_STATUSES.forEach((s) => {
      expect(CONTACT_REQUEST_STATUS_OPTIONS).toContain(s);
    });
  });
});
