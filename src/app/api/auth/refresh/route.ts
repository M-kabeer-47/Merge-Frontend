import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Route Handler to SET cookies only
 * The refresh logic is done elsewhere, this just receives tokens and sets them
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, refreshToken } = body;

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: "Missing tokens" }, { status: 400 });
    }

    const cookieStore = await cookies();

    // Set cookies - Route Handlers CAN do this!
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    };

    cookieStore.set("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60, // 1 hour
    });

    cookieStore.set("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    console.log("[API /auth/refresh] Cookies set successfully");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /auth/refresh] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
