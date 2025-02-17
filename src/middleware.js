import { getToken } from "next-auth/jwt";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  adminRoutes,
  apiAuthPrefix,
  authRoutes,
  DEFAULT_ADMIN_LOGIN_REDIRECT,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  superAdminRoutes,
  userRoutes,
} from "./routes";

const secret = process.env.NEXTAUTH_SECRET;

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;

  const token = await getToken({ req, secret });

  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const isPublicRoute = publicRoutes.some((route) =>
    typeof route === "string"
      ? nextUrl.pathname === route
      : route.test(nextUrl.pathname)
  );

  const isUserRoute = userRoutes.some((route) =>
    typeof route === "string"
      ? nextUrl.pathname === route
      : route.test(nextUrl.pathname)
  );

  const isAdminRoute = adminRoutes.some((route) =>
    typeof route === "string"
      ? nextUrl.pathname === route
      : route.test(nextUrl.pathname)
  );

  const isSuperAdminRoute = superAdminRoutes.some((route) =>
    typeof route === "string"
      ? nextUrl.pathname === route
      : route.test(nextUrl.pathname)
  );

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (isUserRoute) {
    if (isLoggedIn && token?.data?.role === "user") {
      return null; // Permitir acceso
    }
    return Response.redirect(new URL(DEFAULT_ADMIN_LOGIN_REDIRECT, nextUrl));
  }

  if (isAdminRoute) {
    if (isLoggedIn && ["admin", "superadmin"].includes(token?.data?.role)) {
      return null; // Permitir acceso
    }
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isSuperAdminRoute) {
    if (isLoggedIn && token?.data?.role === "superadmin") {
      return null; // Permitir acceso
    }
    return Response.redirect(new URL(DEFAULT_ADMIN_LOGIN_REDIRECT, nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return null;
});


export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
