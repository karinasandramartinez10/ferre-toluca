import { NextResponse } from "next/server";
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
import { auth } from "./auth";

export default async function middleware(req) {
  const { nextUrl } = req;

  const session = await auth();
  const userRole = session?.user?.role;

  const isLoggedIn = !!session;

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
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (isUserRoute) {
    if (isLoggedIn && userRole === "user") {
      return NextResponse.next(); // Permitir acceso
    }
    return NextResponse.redirect(
      new URL(DEFAULT_ADMIN_LOGIN_REDIRECT, nextUrl)
    );
  }

  if (isAdminRoute) {
    if (isLoggedIn && ["admin", "superadmin"].includes(userRole)) {
      return NextResponse.next(); // Permitir acceso
    }
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isSuperAdminRoute) {
    if (isLoggedIn && userRole === "superadmin") {
      return NextResponse.next(); // Permitir acceso
    }
    return NextResponse.redirect(
      new URL(DEFAULT_ADMIN_LOGIN_REDIRECT, nextUrl)
    );
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
