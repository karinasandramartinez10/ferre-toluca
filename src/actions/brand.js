"use server";

export async function getBrands() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/brands`,
    );

    const response = await res.json();
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
}
