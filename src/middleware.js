import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Decode token if exists
  let user = null;
  if (token) {
    try {
      user = await verifyToken(token);
    } catch (error) {
      console.error("Token verification failed:", error);
    }
  }

  // Public routes - no protection
  const publicRoutes = ["/", "/auth/login", "/auth/register", "/auth/verify-email"];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Admin routes - only admin users
  if (pathname.startsWith("/admin")) {
    if (!user) {
      // Not authenticated - redirect to login
      return NextResponse.redirect(new URL("/auth/login?redirect=/admin", request.url));
    }
    if (user.role !== "admin") {
      // Not admin - redirect to home
      return NextResponse.redirect(new URL("/?error=unauthorized", request.url));
    }
    return NextResponse.next();
  }

  // Account routes - only authenticated users
  if (pathname.startsWith("/account")) {
    if (!user) {
      // Not authenticated - redirect to login
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${pathname}`, request.url)
      );
    }
    return NextResponse.next();
  }

  // All complaint routes - only authenticated users
  if (pathname.startsWith("/complaint")) {
    if (!user) {
      // Not authenticated - redirect to login
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${pathname}`, request.url)
      );
    }
    return NextResponse.next();
  }

  // Default: allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
