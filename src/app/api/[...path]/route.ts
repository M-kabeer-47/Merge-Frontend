import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/api";

/**
 * Catch-all proxy route for development
 * Forwards all API requests to backend with cookies
 */
async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
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

  // Forward Authorization header if present
  const authHeader = request.headers.get("Authorization");
  if (authHeader) {
    headers["Authorization"] = authHeader;
  }

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
    `${API_BASE_URL}/${pathString}${queryString}`,
    {
      method: request.method,
      headers,
      body,
    },
  );

  const contentType = backendResponse.headers.get("content-type");

  // Handle streaming responses (SSE)
  if (contentType?.includes("text/event-stream")) {
    console.log("[API Proxy] Streaming response detected for:", pathString);
    
    // Pass through the stream directly without buffering
    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no", // Disable nginx buffering if behind nginx
      },
    });
  }

  // Handle empty-body responses (204 No Content, 304 Not Modified, or empty 205)
  // These statuses must not have a body per HTTP spec, and parsing an empty
  // body as JSON throws SyntaxError → Next.js converts to a 500.
  const noBodyStatus = [204, 205, 304].includes(backendResponse.status);

  let response: NextResponse;
  if (noBodyStatus) {
    response = new NextResponse(null, { status: backendResponse.status });
  } else {
    // Read raw text so we can safely handle empty bodies even when the
    // backend mistakenly sets Content-Type: application/json with no body.
    const rawBody = await backendResponse.text();
    if (contentType?.includes("application/json") && rawBody.length > 0) {
      try {
        const parsed = JSON.parse(rawBody);
        response = NextResponse.json(parsed, { status: backendResponse.status });
      } catch {
        response = new NextResponse(rawBody, { status: backendResponse.status });
      }
    } else {
      response = new NextResponse(rawBody, { status: backendResponse.status });
    }
  }

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
