import { auth } from "../auth";

export async function fetchQuotesServer(page = 1, size = 10) {
  const session = await auth();
  const token = session?.user?.access_token;

  if (!token) {
    throw new Error("No autenticado");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/quote?page=${page}&size=${size}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${await res.text()}`);
  }

  const payload = await res.json();
  return payload.data;
}

export async function fetchQuoteServer(id) {
  const session = await auth();
  const token = session?.user?.access_token;
  if (!token) throw new Error("No autenticado");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/quote/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  const { data } = await res.json();
  return data;
}
