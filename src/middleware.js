import { NextResponse } from "next/server";
import { classifyRoute, DEFAULT_ADMIN_LOGIN_REDIRECT, DEFAULT_LOGIN_REDIRECT } from "./routes";
import { auth } from "./auth";

export default async function middleware(req) {
  const { nextUrl } = req;

  const session = await auth();
  const userRole = session?.user?.role;

  const isLoggedIn = !!session;

  const routeType = classifyRoute(nextUrl.pathname);

  if (routeType === "apiAuth") {
    return NextResponse.next();
  }

  if (routeType === "auth") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (routeType === "user") {
    if (isLoggedIn && userRole === "user") {
      return NextResponse.next(); // Permitir acceso
    }
    return NextResponse.redirect(new URL(DEFAULT_ADMIN_LOGIN_REDIRECT, nextUrl));
  }

  if (routeType === "superAdmin") {
    if (isLoggedIn && userRole === "superadmin") {
      return NextResponse.next(); // Permitir acceso
    }
    return NextResponse.redirect(new URL(DEFAULT_ADMIN_LOGIN_REDIRECT, nextUrl));
  }

  if (routeType === "admin") {
    if (isLoggedIn && ["admin", "superadmin"].includes(userRole)) {
      return NextResponse.next(); // Permitir acceso
    }
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (!isLoggedIn && routeType !== "public") {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
