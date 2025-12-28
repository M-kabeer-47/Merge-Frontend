import Cookies from "js-cookie";

// NOTE: httpOnly cookies CANNOT be set from JavaScript!
// httpOnly cookies must be set by the SERVER via HTTP headers.
// We're setting non-httpOnly cookies here for client-side access.
// For production security, have your backend set httpOnly cookies.
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  expires: 7, // 7 days for refresh token
  // httpOnly: true ← This does NOT work with js-cookie!
};

/**
 * Set auth tokens in both localStorage and cookies
 * - localStorage: for client-side axios interceptors
 * - cookies: sent automatically with requests (for server components to access)
 */
export function setAuthTokens(accessToken: string, refreshToken: string) {
  // localStorage (for client-side axios interceptors)
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  // Cookies (sent automatically with requests)
  // NOTE: These are NOT httpOnly - JS can read them
  // For httpOnly, your backend must set the cookie
  Cookies.set("accessToken", accessToken, {
    ...COOKIE_OPTIONS,
    expires: 1, // 1 day for access token
  });
  Cookies.set("refreshToken", refreshToken, COOKIE_OPTIONS);
}

/**
 * Get access token (from localStorage on client)
 */
export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
}

/**
 * Clear auth tokens from both localStorage and cookies
 */
export function clearAuthTokens() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
}

/**
 * Check if user has auth tokens
 */
export function hasAuthTokens(): boolean {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("accessToken");
  }
  return !!Cookies.get("accessToken");
}
