"use server";

export async function getBrands() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/brands`,
    { cache: "force-cache" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const response  = await res.json();
  return response.data
}
