import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { jwtCallback } from "./lib/refreshSession";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/signup",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ token, session }) {
      session.user = token.data;
      session.error = token.error;
      return session;
    },
    jwt: jwtCallback,
  },
  session: { strategy: "jwt", maxAge: 604800 },
  ...authConfig,
});
