import type { DefaultSession } from "next-auth";

// El callback `session` de src/auth.js asigna `session.user = token.data`,
// con el shape que arma el callback `jwt`.
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
      access_token?: string;
      expires_at?: number;
    } & DefaultSession["user"];
  }
}
