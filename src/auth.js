import NextAuth from "next-auth";
import authConfig from "./auth.config";

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
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.data = {
          id: user.id,
          email: user.email,
          role: user.role,
          access_token: user.access_token,
          expires_at: user.expires_at,
          // ...user,
          // role: user.role
        };
      }
      return token;
    },
  },
  session: { strategy: "jwt", maxAge: 604800 },
  ...authConfig,
});
