import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/api";

/**
 * Proxy sign-in requests to backend and rewrite cookies for localhost
 * Only used in development mode
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to backend
    const backendResponse = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Get response data
    const data = await backendResponse.json();
    console.log("data", data);
    // Create response
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // If successful, extract cookies from backend and rewrite for localhost
    if (backendResponse.ok) {
      const setCookieHeaders = backendResponse.headers.getSetCookie();
      console.log("setCookieHeaders", setCookieHeaders);

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
    console.error("[Proxy] Sign-in error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
