import { decodeJwt } from "jose";

export function decodeToken(accessToken) {
  try {
    return decodeJwt(accessToken);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
