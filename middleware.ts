import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route should be protected
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/api/admin");

  const isAuthRoute =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");

  // Get the session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to login if accessing protected route without being authenticated
  if (isProtectedRoute && !token) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if visiting auth routes while already logged in
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Continue to the requested route
  return NextResponse.next();
}

// Configure which routes to run the middleware on
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/admin/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
