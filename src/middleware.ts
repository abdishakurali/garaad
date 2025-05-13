import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path.startsWith("/welcome") ||
    path.startsWith("/about") ||
    path.startsWith("/api/auth");

  // Get the token from the cookies
  const token = request.cookies.get("accessToken")?.value || "";

  // Redirect logic
  if (isPublicPath && token && path === "/") {
    // Only redirect from welcome to dashboard if user is logged in
    return NextResponse.redirect(new URL("/courses", request.url));
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access protected path, redirect to welcome
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Add security headers
  const response = NextResponse.next();

  // Add security headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
