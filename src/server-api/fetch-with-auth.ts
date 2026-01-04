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

  const [response, error] = await tryIt(
    axios.post<RefreshTokenResponse>(
      `${API_BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    )
  );

  if (error || !response) {
    console.error("Token refresh failed:", error);
    return null;
  }

  const { token, refreshToken: newRefreshToken } = response.data;

  // Persist new tokens using Server Action
  await setAuthCookies(token, newRefreshToken);
  console.log("Token refreshed and cookies updated on server");

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
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const { next, ...fetchOptions } = options;

  // Extract endpoint for cleaner logging
  const endpoint = url.replace(API_BASE_URL || "", "");
  const startTime = Date.now();

  // Log the request with cache info
  const cacheInfo = next
    ? `revalidate: ${
        next.revalidate === false ? "forever" : next.revalidate
      }s, tags: [${next.tags?.join(", ") || "none"}]`
    : "no cache config";
  console.log(
    `[Server API] ${
      fetchOptions.method || "GET"
    } ${endpoint} | Cache: ${cacheInfo}`
  );

  const makeRequest = async (token: string | undefined) => {
    return fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(next && { next }),
    });
  };

  // First attempt
  const [response, error] = await tryIt(makeRequest(accessToken));

  if (error || !response) {
    console.log(
      `[Server API] ❌ ${endpoint} | Error: ${
        error?.message || "Request failed"
      } | ${Date.now() - startTime}ms`
    );
    return {
      data: null,
      error: error || new Error("Request failed"),
      status: 0,
    };
  }

  // If 401, try to refresh token and retry
  if (response.status === 401) {
    console.log(
      `[Server API] 🔄 ${endpoint} | 401 - Attempting token refresh...`
    );

    const newToken = await refreshTokenOnServer();
    if (!newToken) {
      console.log(
        `[Server API] ❌ ${endpoint} | Token refresh failed | ${
          Date.now() - startTime
        }ms`
      );
      return {
        data: null,
        error: new Error("Session expired. Please sign in again."),
        status: 401,
      };
    }

    // Retry with new token
    const [retryResponse, retryError] = await tryIt(makeRequest(newToken));
    if (retryError || !retryResponse) {
      console.log(
        `[Server API] ❌ ${endpoint} | Retry failed: ${retryError?.message} | ${
          Date.now() - startTime
        }ms`
      );
      return {
        data: null,
        error: retryError || new Error("Retry request failed"),
        status: 0,
      };
    }

    if (!retryResponse.ok) {
      console.log(
        `[Server API] ❌ ${endpoint} | HTTP ${
          retryResponse.status
        } after retry | ${Date.now() - startTime}ms`
      );
      return {
        data: null,
        error: new Error(`HTTP ${retryResponse.status}`),
        status: retryResponse.status,
      };
    }

    const [retryData, parseError] = await tryIt<T>(retryResponse.json());
    console.log(
      `[Server API] ✅ ${endpoint} | ${
        retryResponse.status
      } (after refresh) | ${Date.now() - startTime}ms`
    );
    return {
      data: parseError ? null : retryData,
      error: parseError,
      status: retryResponse.status,
    };
  }

  // Original request succeeded
  if (!response.ok) {
    console.log(
      `[Server API] ❌ ${endpoint} | HTTP ${response.status} | ${
        Date.now() - startTime
      }ms`
    );
    return {
      data: null,
      error: new Error(`HTTP ${response.status}`),
      status: response.status,
    };
  }

  const [data, parseError] = await tryIt<T>(response.json());
  console.log(
    `[Server API] ✅ ${endpoint} | ${response.status} | ${
      Date.now() - startTime
    }ms`
  );
  return {
    data: parseError ? null : data,
    error: parseError,
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
