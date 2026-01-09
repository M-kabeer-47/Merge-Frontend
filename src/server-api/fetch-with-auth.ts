"use server";

import { cookies } from "next/headers";
import { tryIt } from "@/utils/try-it";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  userId: string;
}

interface FetchWithAuthOptions extends Omit<RequestInit, "headers" | "next"> {
  headers?: Record<string, string>;
  next?: NextFetchRequestConfig;
}

interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Refresh the access token using the refresh token from cookies
 * Uses simple axios (not interceptor-enabled instance)
 * Persists new tokens via Server Action
 */
export async function refreshTokenOnServer(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    console.error("No refresh token found in cookies");
    return null;
  }
  console.log("Cookie Store", cookieStore.getAll());

  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  console.log("[Refresh] URL:", `${API_BASE_URL}/auth/refresh`);
  console.log("[Refresh] Cookie Header:", cookieHeader);
  // Use native fetch instead of axios
  const [response, error] = await tryIt(
    fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    })
  );

  if (error || !response || !response.ok) {
    const errorData = response ? await response.json().catch(() => null) : null;
    console.error("Token refresh failed:", errorData);
    return null;
  }

  // Parse the JSON response (native fetch requires this)
  const data: RefreshTokenResponse = await response.json();
  console.log("[Refresh] Response:", data);

  const { token, refreshToken: newRefreshToken } = data;

  // ✅ Manually set the cookies on the Next.js server's cookie store
  // This will forward them to the browser via Set-Cookie headers
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    domain: ".mergeedu.app",
  };

  cookieStore.set("accessToken", token, {
    ...cookieOptions,
    maxAge: 0.5 * 60, // 30 seconds (matching backend)
  });

  cookieStore.set("refreshToken", newRefreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return token;
}

/**
 * Server-side fetch with automatic token refresh
 * If request returns 401, attempts to refresh the token and retry
 * Includes cache logging for debugging
 */
export async function fetchWithAuth<T = unknown>(
  url: string,
  options: FetchWithAuthOptions = {}
): Promise<{ data: T | null; error: Error | null; status: number }> {
  const { next, ...fetchOptions } = options;

  const makeRequest = async () => {
    // Read fresh cookies each time (important for retry after refresh)
    const cookieStore = await cookies();
    const allCookies = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join(";");

    console.log("allCookies", allCookies);
    return fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        Cookie: allCookies,
      },
      ...(next && { next }),
    });
  };

  // First attempt
  const [response, error] = await tryIt(makeRequest());

  if (error || !response) {
    return {
      data: null,
      error: error || new Error("Request failed"),
      status: 0,
    };
  }

  // Clone response so we can read body twice if needed (for 401 check and retry)
  const responseClone = response.clone();
  const [initialData, initialParseError] = await tryIt<
    T & { statusCode?: number }
  >(responseClone.json());

  // Check for 401 - native fetch() doesn't throw on HTTP errors
  // Check both HTTP status and body statusCode
  const isAccessTokenExpired =
    initialData?.message === "access token not provided" ||
    initialData?.message === "access token expired";
  console.log("initialData", initialData);
  if (isAccessTokenExpired) {
    console.log("[fetchWithAuth] Got 401, attempting token refresh...");
    const newToken = await refreshTokenOnServer();
    if (!newToken) {
      return {
        data: null,
        error: new Error("Session expired. Please sign in again."),
        status: 401,
      };
    }

    // Retry with new token
    const [retryResponse, retryError] = await tryIt(makeRequest());
    if (retryError || !retryResponse) {
      return {
        data: null,
        error: retryError || new Error("Retry request failed"),
        status: 0,
      };
    }

    if (!retryResponse.ok) {
      const [retryErrorData] = await tryIt<{ statusCode?: number }>(
        retryResponse.clone().json()
      );
      // Check if retry also got 401 (refresh didn't help)
      if (
        retryErrorData?.message === "access token not provided" ||
        retryErrorData?.message === "access token expired"
      ) {
        return {
          data: null,
          error: new Error("Session expired. Please sign in again."),
          status: 401,
        };
      }
      return {
        data: null,
        error: new Error(`HTTP ${retryResponse.status}`),
        status: retryResponse.status,
      };
    }

    const [retryData, parseError] = await tryIt<T>(retryResponse.json());

    return {
      data: parseError ? null : retryData,
      error: parseError,
      status: retryResponse.status,
    };
  }

  // Original request succeeded (non-401)
  if (!response.ok) {
    return {
      data: null,
      error: new Error(`HTTP ${response.status}`),
      status: response.status,
    };
  }

  // Use already parsed data if no parse error, otherwise we already have it
  if (initialParseError) {
    return {
      data: null,
      error: initialParseError,
      status: response.status,
    };
  }

  return {
    data: initialData as T,
    error: null,
    status: response.status,
  };
}

/**
 * GET request with auth
 */
export async function getWithAuth<T = unknown>(
  url: string,
  options?: Omit<FetchWithAuthOptions, "method">
) {
  return fetchWithAuth<T>(url, { ...options, method: "GET" });
}

/**
 * POST request with auth
 */
export async function postWithAuth<T = unknown>(
  url: string,
  body?: unknown,
  options?: Omit<FetchWithAuthOptions, "method" | "body">
) {
  return fetchWithAuth<T>(url, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT request with auth
 */
export async function putWithAuth<T = unknown>(
  url: string,
  body?: unknown,
  options?: Omit<FetchWithAuthOptions, "method" | "body">
) {
  return fetchWithAuth<T>(url, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request with auth
 */
export async function deleteWithAuth<T = unknown>(
  url: string,
  options?: Omit<FetchWithAuthOptions, "method">
) {
  return fetchWithAuth<T>(url, { ...options, method: "DELETE" });
}
