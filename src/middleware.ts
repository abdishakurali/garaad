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

// Define paths that require premium subscription
const premiumRoots = [
  "/lessons",
  // Note: /courses is public (catalogue), but specific lessons are premium
];

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
  const isAuthenticated = !!userCookie?.value;

  if (!isAuthenticated) {
    // Redirect unauthenticated users
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  // --- 4. Premium Access Check ---
  // If authenticated, check if they need premium for this specific path

  // Only check premium for lessons or explicit premium roots
  const isPremiumPath = isLessonPath || premiumRoots.some(root => pathname.startsWith(root));

  if (isPremiumPath) {
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
      // Cookie parse error -> treat as unauthenticated
      return NextResponse.redirect(new URL("/welcome", request.url));
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
