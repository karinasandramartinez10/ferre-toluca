import { STORAGE_KEYS } from "../constants/storageKeys";

const MAX_ITEMS = 10;

const safeParse = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => Number.isInteger(v)) : [];
  } catch {
    return [];
  }
};

export const getRecentlyViewed = () => {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED));
};

export const pushRecentlyViewed = (productId) => {
  if (typeof window === "undefined" || !Number.isInteger(productId)) return;
  const current = getRecentlyViewed();
  const next = [productId, ...current.filter((id) => id !== productId)].slice(0, MAX_ITEMS);
  window.localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(next));
};

export const removeRecentlyViewed = (idsToRemove) => {
  if (typeof window === "undefined" || !idsToRemove?.length) return;
  const remove = new Set(idsToRemove);
  const next = getRecentlyViewed().filter((id) => !remove.has(id));
  window.localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(next));
};
