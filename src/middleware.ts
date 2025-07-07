import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that require premium access
const premiumPaths = ["/courses", "/lessons"];

// Define paths that are always public
const publicPaths = [
  "/", // Home page is public
  "/welcome",
  "/login",
  "/register",
  "/subscribe",
  "/verify-email",
  "/loading",
  "/api/payment",
  "/api/payment/success",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/logo.png",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get access token and user data from cookies
  const accessToken = request.cookies.get("accessToken");
  const userCookie = request.cookies.get("user");

  console.log("Access token exists:", !!accessToken?.value);
  console.log("User cookie exists:", !!userCookie?.value);

  // If no access token, redirect to welcome page
  if (!accessToken?.value) {
    console.log("No access token found, redirecting to welcome");
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  // If no user cookie, redirect to welcome page
  if (!userCookie?.value) {
    console.log("No user cookie found, redirecting to welcome");
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  try {
    // Parse user data from cookie
    const user = JSON.parse(userCookie.value);
    console.log("Current user status from cookie:", {
      email: user.email,
      is_email_verified: user.is_email_verified,
      is_premium: user.is_premium,
    });

    // Check if user's email is verified
    if (!user.is_email_verified && !pathname.startsWith("/verify-email")) {
      console.log("User email not verified, redirecting to email verification");
      const verifyUrl = new URL("/verify-email", request.url);
      verifyUrl.searchParams.set("email", user.email || "");
      return NextResponse.redirect(verifyUrl);
    }

    // If user is premium, allow access to all pages
    if (user.is_premium) {
      console.log("User is premium, allowing access");
      return NextResponse.next();
    }

    // Check if the path requires premium access
    const isPremiumPath = premiumPaths.some((path) =>
      pathname.startsWith(path)
    );
    console.log("Is premium path:", isPremiumPath);

    // If path requires premium and user is not premium, redirect to subscribe
    if (isPremiumPath) {
      console.log("User is not premium, redirecting to subscribe");
      const subscribeUrl = new URL("/subscribe", request.url);
      subscribeUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(subscribeUrl);
    }

    // Allow access to non-premium paths
    return NextResponse.next();
  } catch (error) {
    console.error("Error parsing user cookie:", error);
    return NextResponse.redirect(new URL("/welcome", request.url));
  }
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
