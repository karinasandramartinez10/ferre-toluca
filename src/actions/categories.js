"use server";

function createCategoryPath(name) {
  return name
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
      throw new Error("Failed to fetch categories");
    }

    const response = await res.json();

    const categories = (response?.data?.categories ?? []).map((cat) => ({
      ...cat,
      path: createCategoryPath(cat.name),
    }));
    return categories;
  } catch (error) {
    console.error("[getCategoriesServer]", error);
    return [];
  }
}
