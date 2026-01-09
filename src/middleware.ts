import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Routes that don't require authentication
const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

// Routes that should skip middleware entirely (API routes, static files, etc.)
const skipRoutes = [
  "/api",
  "/_next",
  "/favicon.ico",
  "/illustrations",
  "/images",
];

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  userId: string;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for certain routes
  if (skipRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow public routes without auth
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // No tokens at all - redirect to login
  if (!accessToken && !refreshToken) {
    console.log("[Middleware] No tokens, redirecting to sign-in");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Has access token - proceed normally
  if (accessToken) {
    return NextResponse.next();
  }

  // Has refresh token but no access token - try to refresh
  console.log("[Middleware] No accessToken, attempting refresh...");

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!response.ok) {
      console.error("[Middleware] Refresh failed, redirecting to sign-in");
      // Clear invalid tokens and redirect
      const res = NextResponse.redirect(new URL("/sign-in", request.url));
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
      return res;
    }

    const data: RefreshTokenResponse = await response.json();
    console.log("[Middleware] Refresh successful, setting cookies");

    // Create response and set new cookies
    const res = NextResponse.next();

    res.cookies.set("accessToken", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    res.cookies.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (error) {
    console.error("[Middleware] Error during refresh:", error);
    const res = NextResponse.redirect(new URL("/sign-in", request.url));
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (they handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, images, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|illustrations|images).*)",
  ],
};
