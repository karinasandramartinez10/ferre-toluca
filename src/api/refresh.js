// Se llama desde el `jwt` callback de auth.js, que corre también en el edge runtime
// (el middleware importa `auth`). Por eso usa `fetch` nativo y NO axios/privateApi:
// arrastrar la instancia de axios o next-auth/react al bundle del middleware lo rompe.
//
// El refresh token ES la credencial → va en el body, sin Bearer. Propaga el status
// para que el callback distinga un 429 (rate limit, reintentable) de un fallo real.
export async function refreshToken(token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: token }),
  });

  if (!res.ok) {
    const error = new Error(`refresh failed: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}
