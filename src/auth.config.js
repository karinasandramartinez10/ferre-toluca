import { CredentialsSignin } from "next-auth";
import CredentialsProviders from "next-auth/providers/credentials";
import signIn from "./modules/auth/signin";
import { RATE_LIMITED_CODE } from "./modules/auth/signinErrors";

class RateLimitedSignin extends CredentialsSignin {
  code = RATE_LIMITED_CODE;
}

export default {
  providers: [
    CredentialsProviders({
      async authorize(credentials) {
        const { email = "", password = "" } = credentials;
        const { status, session } = await signIn({ email, password });

        if (status === "rate_limited") throw new RateLimitedSignin();
        if (status === "success" && session) return session;
        throw new Error("Correo o contraseña incorrectos");
      },
    }),
  ],
};
