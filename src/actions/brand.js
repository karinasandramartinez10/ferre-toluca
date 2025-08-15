"use server";

export async function getBrandsServer() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/brands`
    );

    if (!res.ok) {
      return {
        error: "Failed to fetch data",
      };
    }

    const response = await res.json();
    const brands = response.data.brands ?? [];
    return brands;
  } catch (error) {
    console.error("error", error);
    return [];
  }
}
