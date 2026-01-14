import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Catch-all proxy route for development
 * Forwards all API requests to backend with cookies
 */
async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join("/");
  const url = new URL(request.url);
  const queryString = url.search;

  // Get cookies to forward
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const cookieHeader = [
    accessToken && `accessToken=${accessToken}`,
    refreshToken && `refreshToken=${refreshToken}`,
  ]
    .filter(Boolean)
    .join("; ");

  // Forward headers (except host)
  const headers: Record<string, string> = {
    "Content-Type": request.headers.get("Content-Type") || "application/json",
  };

  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  // Get request body for POST/PUT/PATCH
  let body: string | undefined;
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    try {
      body = await request.text();
    } catch {
      // No body
    }
  }

  // Forward request to backend
  const backendResponse = await fetch(
    `${BACKEND_URL}/${pathString}${queryString}`,
    {
      method: request.method,
      headers,
      body,
    }
  );

  // Get response data
  let responseData: any;
  const contentType = backendResponse.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    responseData = await backendResponse.json();
  } else {
    responseData = await backendResponse.text();
  }

  // Create response
  const response =
    typeof responseData === "string"
      ? new NextResponse(responseData, { status: backendResponse.status })
      : NextResponse.json(responseData, { status: backendResponse.status });

  // Handle Set-Cookie headers from backend (rewrite for localhost)
  const setCookieHeaders = backendResponse.headers.getSetCookie();
  for (const cookieHeader of setCookieHeaders) {
    const parts = cookieHeader.split(";").map((p) => p.trim());
    const [nameValue, ...attributes] = parts;
    const [name, value] = nameValue.split("=");

    // Extract maxAge from original cookie
    let maxAge = 3600;
    for (const attr of attributes) {
      if (attr.toLowerCase().startsWith("max-age=")) {
        maxAge = parseInt(attr.split("=")[1], 10);
      }
    }

    // Set cookie with localhost-friendly options
    response.cookies.set(name, value, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge,
    });
  }

  return response;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
