"use server";

function createCategoryPath(name) {
  const safeName = typeof name === "string" ? name : "";
  return safeName
    .toLowerCase() // Convertir a minúsculas
    .replace(/\s+/g, "-"); // Reemplazar espacios por guiones
}

export async function getCategoriesServer() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/category`,
      { cache: "force-cache" }
    );

    if (!res.ok) {
      console.warn(
        "[getCategoriesServer] Non-OK response. Falling back to []",
        res.status
      );
      return [];
    }

    const response = await res
      .json()
      .catch(() => ({ data: { categories: [] } }));

    const rawCategories = response?.data?.categories;
    if (!Array.isArray(rawCategories)) {
      console.warn("[getCategoriesServer] Invalid payload shape. Using []");
      return [];
    }

    const categories = rawCategories.map((cat) => ({
      ...cat,
      path: createCategoryPath(cat?.name),
    }));
    return categories;
  } catch (error) {
    console.warn(
      "[getCategoriesServer] Fetch failed. Using []",
      error?.message
    );
    return [];
  }
}
