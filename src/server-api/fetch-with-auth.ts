"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { tryIt } from "@/utils/try-it";
import { setAuthCookies } from "@/server-actions/auth";

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
async function refreshTokenOnServer(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    console.error("No refresh token found in cookies");
    return null;
  }
  console.log("Cookie Store", cookieStore.getAll());
  const [response, error] = await tryIt(
    axios.post<RefreshTokenResponse>(
      `${API_BASE_URL}/auth/refresh`,
      {},
      {
        headers: { Cookie: cookieStore.getAll().join(";") },
        withCredentials: true,
      }
    )
  );

  if (error || !response) {
    console.error("Token refresh failed:", error.response.data);
    return null;
  }

  const { token } = response.data;

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
  const is401 = response.status === 401 || initialData?.statusCode === 401;

  if (is401) {
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
      if (retryResponse.status === 401 || retryErrorData?.statusCode === 401) {
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
