"use server";

import { cookies } from "next/headers";
import { tryIt } from "@/utils/try-it";

interface FetchWithAuthOptions extends Omit<RequestInit, "headers" | "next"> {
  headers?: Record<string, string>;
  next?: NextFetchRequestConfig;
}

interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Server-side fetch with auth cookies
 * Middleware handles token refresh BEFORE page renders
 * This just makes requests with current cookies
 */
export async function fetchWithAuth<T = unknown>(
  url: string,
  options: FetchWithAuthOptions = {}
): Promise<{ data: T | null; error: Error | null; status: number }> {
  const { next, ...fetchOptions } = options;

  const cookieStore = await cookies();
  const allCookies = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join(";");

  const [response, error] = await tryIt(
    fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        Cookie: allCookies,
        ...options.headers,
      },
      ...(next && { next }),
    })
  );

  if (error || !response) {
    return {
      data: null,
      error: error || new Error("Request failed"),
      status: 0,
    };
  }

  if (!response.ok) {
    const [errorData] = await tryIt(response.json());
    return {
      data: null,
      error: new Error(errorData?.message || `HTTP ${response.status}`),
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
