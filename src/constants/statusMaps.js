// Invitations
export const INVITATION_STATUS_COLORS = {
  pending: "warning",
  accepted: "success",
  expired: "default",
  revoked: "error",
};

export const INVITATION_STATUS_LABELS = {
  pending: "Pendiente",
  accepted: "Aceptada",
  expired: "Expirada",
  revoked: "Revocada",
};

// Contact Requests
export const CONTACT_REQUEST_STATUS_COLORS = {
  pending: "warning",
  contacted: "info",
  invited: "success",
  rejected: "error",
};

export const CONTACT_REQUEST_STATUS_LABELS = {
  pending: "Pendiente",
  contacted: "Contactado",
  invited: "Invitado",
  rejected: "Rechazado",
};

export const CONTACT_REQUEST_STATUS_OPTIONS = ["pending", "contacted", "invited", "rejected"];

export const CONTACT_REQUEST_TERMINAL_STATUSES = ["rejected", "invited"];
