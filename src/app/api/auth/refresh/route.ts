import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/api";

/**
 * Proxy refresh requests to backend and rewrite cookies for localhost
 * Works for both local development (proxy mode) and production (token setting mode)
 */
export async function POST(request: NextRequest) {
  try {
    // Get existing cookies to forward to backend
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token" },
        { status: 401 }
      );
    }

    // Forward request to backend
    const backendResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    // Get response data
    const data = await backendResponse.json();

    // Create response
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // If successful, extract cookies from backend and rewrite for localhost
    if (backendResponse.ok) {
      const setCookieHeaders = backendResponse.headers.getSetCookie();

      for (const cookieHeader of setCookieHeaders) {
        // Parse the cookie
        const parts = cookieHeader.split(";").map((p) => p.trim());
        const [nameValue, ...attributes] = parts;
        const [name, value] = nameValue.split("=");

        // Extract maxAge from original cookie
        let maxAge = 3600; // Default 1 hour
        for (const attr of attributes) {
          if (attr.toLowerCase().startsWith("max-age=")) {
            maxAge = parseInt(attr.split("=")[1], 10);
          }
        }

        // Set cookie with localhost-friendly options
        response.cookies.set(name, value, {
          httpOnly: true,
          secure: false, // localhost uses HTTP
          sameSite: "lax",
          path: "/",
          maxAge,
        });
      }
    }

    return response;
  } catch (error) {
    console.error("[Proxy] Refresh error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
