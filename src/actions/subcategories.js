"use server";

export async function getSubcategorySlugsServer() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/subcategories/slugs`,
      { cache: "force-cache" }
    );

    if (!res.ok) {
      console.warn("[getSubcategorySlugsServer] Non-OK response. Falling back to []", res.status);
      return [];
    }

    const response = await res.json().catch(() => ({ data: [] }));

    const slugs = response?.data;
    if (!Array.isArray(slugs)) {
      console.warn("[getSubcategorySlugsServer] Invalid payload shape. Using []");
      return [];
    }

    return slugs;
  } catch (error) {
    console.warn("[getSubcategorySlugsServer] Fetch failed. Using []", error?.message);
    return [];
  }
}
