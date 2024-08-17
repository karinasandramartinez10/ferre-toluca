"use server";

function createCategoryPath(name) {
  return name
    .toLowerCase() // Convertir a minúsculas
    .replace(/\s+/g, "-") // Reemplazar espacios por guiones
    .replace(/[^a-z0-9\-]/g, ""); // Eliminar caracteres no permitidos (opcional)
}

export async function getCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/category`,
    { cache: "force-cache"}
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  //   return res.json();

  const categories = await res.json();

  // Normaliza las categorías y agrega el path
  return categories.map((category) => ({
    ...category,
    path: createCategoryPath(category.name),
  }));
}
