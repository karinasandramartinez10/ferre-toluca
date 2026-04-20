export const trackRelatedClick = ({ sourceId, targetId, reason, position }) => {
  if (typeof window === "undefined") return;
  const base = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  if (!base) return;

  fetch(`${base}/api/v1/events/related-clicked`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sourceId, targetId, reason, position }),
    keepalive: true,
  }).catch(() => {});
};
