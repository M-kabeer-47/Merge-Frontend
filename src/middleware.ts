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

  // Has accessToken OR refreshToken - let the page render
  // If only refreshToken exists, client-side axios will handle refresh
  // This way the page shows skeleton loading instead of frozen screen
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
