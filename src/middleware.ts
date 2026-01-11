import { NextRequest, NextResponse } from "next/server";
import { tryIt } from "./utils/try-it";

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

  // No accessToken but has refreshToken - try to refresh
  if (!accessToken && refreshToken) {
    console.log("[Middleware] No accessToken, attempting refresh");

    // Call backend refresh endpoint with cookies (use fetch for Edge Runtime)
    const [refreshResponse, error] = await tryIt(
      fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}`,
        },
      })
    );

    if (refreshResponse?.ok) {
      const [data, parseError] = await tryIt(
        refreshResponse.json() as Promise<RefreshTokenResponse>
      );

      if (data && !parseError) {
        console.log("[Middleware] Token refreshed successfully");

        // Set new cookies on the response
        const response = NextResponse.next();

        response.cookies.delete("refreshToken");
        // response.cookies.delete("userId");
        const cookieOptions = {
          domain: ".mergeedu.app",
          httpOnly: true,
          secure: true,
          sameSite: "none" as const,
          path: "/",
        };

        response.cookies.set("accessToken", data.token, {
          ...cookieOptions,
          maxAge: 60 * 60, // 1 hour
        });
        response.cookies.set("refreshToken", data.refreshToken, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return response;
      }
    }

    if (error) {
      console.error("[Middleware] Refresh error:", error);
    } else {
      console.log("[Middleware] Refresh failed:", refreshResponse?.status);
    }

    // Refresh failed - redirect to sign-in and clear cookies
    console.log("[Middleware] Redirecting to sign-in");
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    response.cookies.delete("userId");
    return response;
  }

  // Has accessToken - proceed normally
  return NextResponse.next();
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
