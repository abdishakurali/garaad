import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
 * Middleware rules by page/route:
 *
 * PUBLIC (no auth):
 *   /, /courses, /courses/[categoryId]/[courseSlug], /blog, /blog/[slug], /blog/tag/[tag],
 *   /challenge, /launchpad, /launchpad/[id], /launchpad/project/[slug], /about, /about/abdishakuur-ali,
 *   /terms, /privacy, /startups, /community-preview, /communitypreview,
 *   /login, /signup, /welcome, /admin/login, /verify-email, /reset-password
 *
 * Subscribe / pay:
 *   /subscribe requires auth (sign in or sign up first); unauthenticated → /login with redirect back (query preserved).
 *
 * PROTECTED (auth required; unauthenticated → /login or /admin/login with redirect param):
 *   /admin, /admin/* (except /admin/login),
 *   /dashboard, /profile, /settings, /orders, /orders/[id],
 *   /launchpad/submit, /launchpad/submit-project, /launchpad/edit, /launchpad/edit/[id],
 *   /community, /community/* (not community-preview),
 *   /courses/.../lessons/[lessonId]
 *
 * Premium gating: /community shows a blur + upgrade overlay for free users (no redirect).
 * Lesson 2+, etc. is enforced in-app and by backend, not here.
 */

const protectedRoots = [
  "/admin",
  "/dashboard",
  "/profile",
  "/settings",
  "/orders",
  "/launchpad/submit",
  "/launchpad/submit-project",
  "/launchpad/edit",
  "/subscribe",
];

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

  // Paths that should ALWAYS be public (login, welcome, verify-email — do not block with onboarding check)
  const isAuthPage =
    pathname === "/admin/login" ||
    pathname === "/welcome" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/verify-email";

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
    const redirectUrl = pathname.startsWith("/admin") ? "/admin/login" : "/login";
    const url = new URL(redirectUrl, request.url);
    url.searchParams.set("reason", "unauthenticated");
    // Preserve intended destination (path + query) so login can send user back (e.g. /subscribe?plan=challenge)
    const returnPath = `${pathname}${request.nextUrl.search}`;
    url.searchParams.set("redirect", returnPath);
    return NextResponse.redirect(url, 308);
  }

  // --- 3a. Email verification gate (non-admin protected routes) ---
  // Authenticated users whose email is not yet verified must complete verification.
  if (!pathname.startsWith("/admin") && userCookie?.value) {
    try {
      const user = JSON.parse(decodeURIComponent(userCookie.value)) as {
        is_email_verified?: boolean;
        email?: string;
      };
      if (user.is_email_verified === false) {
        const verifyUrl = new URL("/verify-email", request.url);
        if (user.email) verifyUrl.searchParams.set("email", user.email);
        return NextResponse.redirect(verifyUrl, 307);
      }
    } catch {
      // Corrupt cookie — let the page handle it
    }
  }

  // --- 3b. Onboarding gate: /dashboard requires has_completed_onboarding === true ---
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  if (isDashboard && userCookie?.value) {
      try {
        const decoded = decodeURIComponent(userCookie.value);
        const user = JSON.parse(decoded) as { has_completed_onboarding?: boolean };
        if (user.has_completed_onboarding === false) {
          const welcomeUrl = new URL("/welcome", request.url);
          welcomeUrl.searchParams.set("redirect", pathname);
          return NextResponse.redirect(welcomeUrl, 308);
        }
      } catch {
        // Cookie parse error: allow through; dashboard or API can re-check
      }
  }

  // --- 4. Premium Access Check ---
  // Lesson paths: do NOT gate by premium here. Backend may still enforce access;
  // Lesson access for signed-in users: full catalog (see lessonTierAccess); optional Challenge CTA in-app.
  const isPremiumPath = premiumRoots.some(root => pathname.startsWith(root));

  if (isPremiumPath) {
    if (!userCookie?.value) {
      // Authenticated but missing user metadata (session issue) → re-auth at login, not signup.
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("reason", "no_user_data");
      return NextResponse.redirect(loginUrl, 308);
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
      return NextResponse.redirect(subscribeUrl, 308);

    } catch (error) {
      // Cookie parse error -> treat as session corrupted
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("reason", "session_parse_error");
      return NextResponse.redirect(loginUrl, 308);
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
