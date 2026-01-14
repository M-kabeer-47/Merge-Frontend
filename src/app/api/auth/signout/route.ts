import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Proxy sign-out requests to backend and clear local cookies
 */
export async function POST(request: NextRequest) {
  try {
    // Get existing cookies to forward to backend
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // Forward request to backend
    const backendResponse = await fetch(`${BACKEND_URL}/auth/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      },
    });

    // Create response
    const response = NextResponse.json(
      { success: true },
      { status: backendResponse.status }
    );

    // Clear cookies
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("[Proxy] Sign-out error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
