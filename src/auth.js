import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/signup",
    error: "/auth/error",
  },
  callbacks: {
    async session({ token, session, account }) {
      session.user = token.data;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.data = user;
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
