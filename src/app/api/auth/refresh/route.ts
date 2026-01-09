import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  userId: string;
}

/**
 * Route Handler for token refresh
 * Route Handlers CAN set cookies, unlike RSC during render
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    // Call backend refresh endpoint
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("[API /auth/refresh] Backend refresh failed:", errorData);
      return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    }

    const data: RefreshTokenResponse = await response.json();
    console.log("[API /auth/refresh] Got new tokens");
    console.log("data", data);
    // Set cookies - Route Handlers CAN do this!
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    };

    cookieStore.set("accessToken", data.token, {
      ...cookieOptions,
      maxAge: 60 * 60, // 1 hour
    });

    cookieStore.set("refreshToken", data.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({
      success: true,
      token: data.token,
    });
  } catch (error) {
    console.error("[API /auth/refresh] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
