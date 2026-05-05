import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoots = [
  "/admin",
  "/profile",
  "/settings",
  "/orders",
  "/post-verification-choice",
];

const premiumRoots: string[] = [
  "/mentorship",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isAuthPage =
    pathname === "/admin/login" ||
    pathname === "/welcome" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/verify-email" ||
    pathname === "/post-verification-choice" ||
    pathname.startsWith("/post-verification-choice/");

  if (isAuthPage) return NextResponse.next();

  const isProtectedRoute = protectedRoots.some(
    (root) => pathname === root || pathname.startsWith(`${root}/`)
  );
  const isLessonPath = pathname.includes("/lessons/");

  if (!isProtectedRoute && !isLessonPath) {
    return NextResponse.next();
  }

  const userCookie = request.cookies.get("user");
  const tokenCookie = request.cookies.get("accessToken");
  const refreshTokenCookie = request.cookies.get("refreshToken");
  const isAuthenticated =
    !!userCookie?.value || !!tokenCookie?.value || !!refreshTokenCookie?.value;

  const isAdminRoute = pathname.startsWith("/admin") && !pathname.includes("/login");

  if (!isAuthenticated && !isAdminRoute) {
    const url = new URL("/login", request.url);
    url.searchParams.set("reason", "unauthenticated");
    url.searchParams.set("redirect", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url, 308);
  }

  const isPremiumPath = premiumRoots.some((root) => pathname.startsWith(root));
  if (isPremiumPath) {
    if (!userCookie?.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("reason", "no_user_data");
      return NextResponse.redirect(loginUrl, 308);
    }
    try {
      JSON.parse(decodeURIComponent(userCookie.value));
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("reason", "session_parse_error");
      return NextResponse.redirect(loginUrl, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
