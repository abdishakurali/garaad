import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of protected routes that require authentication
const protectedRoutes = ["/courses", "/profile", "/courses", "/practice"];

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  // Get the token from the cookies
  const token = request.cookies.get("accessToken")?.value;

  // If it's a protected route and there's no token, redirect to welcome page
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If it's the welcome page and there's a token, redirect to dashboard
  if (path === "/" && token) {
    return NextResponse.redirect(new URL("/courses", request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
