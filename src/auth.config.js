import CredentialsProviders from "next-auth/providers/credentials";
import signIn from "@modules/auth/signin";

export default {
  providers: [
    CredentialsProviders({
      async authorize(credentials) {
        const { email = "", password = "" } = credentials;

        const { status, session } = await signIn({ email, password });

        if (status === "success" && session) {
          return session;
        }
        return null;
      },
    }),
  ],
};
