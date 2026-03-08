import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that are strictly protected (Blacklist)
const protectedRoots = [
  "/admin",
  "/dashboard",
  "/profile",
  "/settings",
  "/orders",
  "/referrals",
  "/launchpad/submit",
  "/launchpad/edit",
];

// Paths that require Explorer (premium) are gated in-app:
// - Lesson 2+ per course → paywall in LessonDetailClient
// - /courses listing is open to authenticated users (free can access lesson 1 + community)
// Launchpad submit stays auth-only (Challenge tier enforced by backend).
const premiumRoots: string[] = [];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- 1. Global Bypass for Assets ---
  // Always allow static files, images, icons, etc.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") || // Let API routes handle their own auth
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/sounds") ||
    pathname.includes(".") // Optimization: Assume files with extensions are public assets
  ) {
    return NextResponse.next();
  }

  // --- 2. Check Protected Routes ---
  const isProtectedRoute = protectedRoots.some(root =>
    pathname === root || pathname.startsWith(`${root}/`)
  );

  // Specific check for /lessons/ (matches any lesson path)
  const isLessonPath = pathname.includes("/lessons/");

  // Specific check for /community (excluding -preview)
  const isProtectedCommunity = pathname === "/community" || (pathname.startsWith("/community/") && !pathname.startsWith("/community-preview"));

  // Paths that should ALWAYS be public (Login pages, etc.)
  const isAuthPage = pathname === "/admin/login" || pathname === "/welcome" || pathname === "/login";

  if (isAuthPage) {
    return NextResponse.next();
  }

  if (!isProtectedRoute && !isLessonPath && !isProtectedCommunity) {
    // IT IS PUBLIC. Allow access.
    return NextResponse.next();
  }

  // --- 3. Authentication Check ---
  // If we are here, the path IS protected.
  const userCookie = request.cookies.get("user");
  const tokenCookie = request.cookies.get("accessToken");
  const refreshTokenCookie = request.cookies.get("refreshToken");

  const isAuthenticated = !!userCookie?.value || !!tokenCookie?.value || !!refreshTokenCookie?.value;

  if (!isAuthenticated) {
    console.log(`[Middleware] No valid session cookies found for ${pathname}. Redirecting to auth page.`);
    const redirectUrl = pathname.startsWith("/admin") ? "/admin/login" : "/login";
    const url = new URL(redirectUrl, request.url);
    url.searchParams.set("reason", "unauthenticated");
    return NextResponse.redirect(url);
  }

  // --- 4. Premium Access Check ---
  // If authenticated, check if they need premium for this specific path

  // Only check premium for lessons or explicit premium roots
  const isPremiumPath = isLessonPath || premiumRoots.some(root => pathname.startsWith(root));

  if (isPremiumPath) {
    if (!userCookie?.value) {
      // Authenticated but missing user metadata (session issue) → re-auth at login, not signup.
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("reason", "no_user_data");
      return NextResponse.redirect(loginUrl);
    }
    try {
      const decodedUser = decodeURIComponent(userCookie.value);
      const user = JSON.parse(decodedUser);

      // Allow if user is premium
      if (user?.is_premium) {
        return NextResponse.next();
      }

      // Deny if not premium
      console.log("User is not premium, redirecting to subscribe");
      const subscribeUrl = new URL("/subscribe", request.url);
      subscribeUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(subscribeUrl);

    } catch (error) {
      // Cookie parse error -> treat as session corrupted
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("reason", "session_parse_error");
      return NextResponse.redirect(loginUrl);
    }
  }

  // Authenticated and passed all checks
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
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
