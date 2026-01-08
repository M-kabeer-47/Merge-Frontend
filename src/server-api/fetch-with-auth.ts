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

  const [response, error] = await tryIt(
    axios.post<RefreshTokenResponse>(`${API_BASE_URL}/auth/refresh`, {})
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
  const { next, ...fetchOptions } = options;

  // Extract endpoint for cleaner logging

  // Log the request with cache info

  const makeRequest = async () => {
    // Read fresh cookies each time (important for retry after refresh)
    const freshCookies = await cookies();
    const cookieHeader = freshCookies
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    console.log("[fetchWithAuth] Request to:", url);
    console.log(
      "[fetchWithAuth] Cookie header:",
      cookieHeader ? cookieHeader : "EMPTY"
    );
    // use axios for testing

    return fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader, // Forward cookies to backend
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

  // If 401, try to refresh token and retry
  if (response.status === 401) {
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

  // Original request succeeded
  if (!response.ok) {
    return {
      data: null,
      error: new Error(`HTTP ${response.status}`),
      status: response.status,
    };
  }

  const [data, parseError] = await tryIt<T>(response.json());

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
