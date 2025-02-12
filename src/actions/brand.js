"use server";

export async function getBrands() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/brands`
    );

    if (!res.ok) {
      return {
        error: "Failed to fetch data",
      };
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
}
