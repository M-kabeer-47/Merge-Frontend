import { NextRequest, NextResponse } from "next/server";

/**
 * API route to get access token for Socket.IO authentication
 * This allows client-side code to get the token without exposing it in localStorage
 */
export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 401 });
  }

  return NextResponse.json({ token: accessToken });
}
