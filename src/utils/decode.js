import jwt from "jsonwebtoken";

export function decodeToken(accessToken) {
  try {
    return jwt.decode(accessToken);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
