import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that should be accessible without premium
const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/subscribe",
  "/api",
  "/_next",
  "/static",
  "/favicon.ico",
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow public paths
  if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
    return NextResponse.next();
  }

  // Get user from cookie
  const userStr = request.cookies.get("user")?.value;
  if (!userStr) {
    return NextResponse.next();
  }

  try {
    const user = JSON.parse(userStr);

    // If user is not premium, redirect to subscribe page
    if (!user.is_premium) {
      return NextResponse.redirect(new URL("/subscribe", request.url));
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  return NextResponse.next();
}

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
