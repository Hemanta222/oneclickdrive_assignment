import { NextResponse } from "next/server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
const JWT_SECRET = process.env.JWT_SECRET;

const protectedRoutes = ["/dashboard","/audits"];
const publicRoutes = ["/login", "/signup"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const token = (await cookies()).get("authToken")?.value;

  let decoded = null;
  if (token) {
    try {
      const JWT_SECRET_UINT8_ARRAY = new TextEncoder().encode(JWT_SECRET);
      decoded = await jwtVerify(token, JWT_SECRET_UINT8_ARRAY);
    } catch (error) {
      const cookieStore = await cookies();
      cookieStore.delete("authToken");
      console.log("==========error", error);
    }
  }

  if (isProtectedRoute && !decoded) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    decoded &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (decoded && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  if (!decoded && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
