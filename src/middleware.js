import { NextResponse } from "next/server";

import { cookies } from "next/headers";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const token = (await cookies()).get("authToken")?.value;

  console.log("-------middleware token", token);

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    token &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (token && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  if (!token && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
