"use server";

export async function getProducts(page = 1, size = 10) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/product?page=${page}&size=${size}`
  );

  if (!res.ok) {
    return {
      error: "Failed to fetch data",
    };
  }

  const response = await res.json();
  return response.data.products;
}

export const getProductById = async (id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/product/${id}`
    );

    const response = await res.json();
    return response
  } catch (error) {
    console.log('e',error)
  }
};
