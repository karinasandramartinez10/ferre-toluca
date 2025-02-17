import { getToken } from "next-auth/jwt";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
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

  console.log("Middleware Debug:");
  console.log("Pathname:", nextUrl.pathname);
  console.log("Token:", token);
  console.log("Token Role:", token?.data?.role);

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

  // Permitir acceso a rutas de API de autenticación
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirigir si ya está autenticado en rutas de autenticación
  if (isAuthRoute) {
    if (isLoggedIn) {
      console.log(
        "Middleware: Usuario autenticado, redirigiendo a:",
        DEFAULT_LOGIN_REDIRECT
      );
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // Manejo de rutas protegidas por rol
  if (isUserRoute) {
    if (isLoggedIn && token?.data?.role === "user") {
      return NextResponse.next(); // Permitir acceso
    }
    console.log(
      "Middleware: Usuario no autorizado, redirigiendo a:",
      DEFAULT_ADMIN_LOGIN_REDIRECT
    );
    return NextResponse.redirect(
      new URL(DEFAULT_ADMIN_LOGIN_REDIRECT, nextUrl)
    );
  }

  if (isAdminRoute) {
    if (isLoggedIn && ["admin", "superadmin"].includes(token?.data?.role)) {
      return NextResponse.next(); // Permitir acceso
    }
    console.log(
      "Middleware: Admin no autorizado, redirigiendo a:",
      DEFAULT_LOGIN_REDIRECT
    );
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isSuperAdminRoute) {
    if (isLoggedIn && token?.data?.role === "superadmin") {
      return NextResponse.next(); // Permitir acceso
    }
    console.log(
      "Middleware: Superadmin no autorizado, redirigiendo a:",
      DEFAULT_ADMIN_LOGIN_REDIRECT
    );
    return NextResponse.redirect(
      new URL(DEFAULT_ADMIN_LOGIN_REDIRECT, nextUrl)
    );
  }

  // Redirigir a login si no está autenticado y no es una ruta pública
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    console.log(
      "Middleware: No autenticado, redirigiendo a login con callbackUrl:",
      encodedCallbackUrl
    );
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // Permitir acceso a rutas públicas y cuando no hay redirección
  console.log("Middleware: Permitiendo acceso.");
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
