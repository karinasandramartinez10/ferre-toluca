import { POST } from "../requests/methods";
import { decodeToken } from '../../utils/decode'

async function signIn(credentials) {
  console.log('cre',credentials)
  const { email, password } = credentials;

  try {
    const path = "/auth/login";
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = {
      email,
      password,
    };
    const response = await POST(path, body, options);

    if (response.status === 200) {
      const data = await response.json();

      if (!data.access_token) {
        throw new Error("Token not found in the response");
      }

      const decodedToken = decodeToken(data.access_token);

      if (decodedToken) {
        const session = {
          id: decodedToken.id,
          role: decodedToken.role,
          email: decodedToken.userName,
          access_token: data.access_token,
        };

        return {
          status: "success",
          session,
        };
      }
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error) {
    console.error(error);

    return {
      status: "error",
    };
  }
}

export default signIn;
