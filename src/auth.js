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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ token, session, account }) {
      session.user = token.data;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.data = {
          ...user,
          role: user.role
        }
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
