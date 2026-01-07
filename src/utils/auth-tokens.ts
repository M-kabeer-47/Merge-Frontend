import Cookies from "js-cookie";

// Cookie options
// NOTE: For production, backend should set httpOnly cookies
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  expires: 7, // 7 days for refresh token
};

/**
 * Set auth tokens in cookies
 * Cookies are sent automatically with requests (withCredentials: true)
 */
export function setAuthTokens(accessToken: string, refreshToken: string) {
  Cookies.set("accessToken", accessToken, {
    ...COOKIE_OPTIONS,
    expires: 1, // 1 day for access token
  });
  Cookies.set("refreshToken", refreshToken, COOKIE_OPTIONS);
}

/**
 * Get access token from cookie
 */
export function getAccessToken(): string | null {
  return Cookies.get("accessToken") || null;
}

/**
 * Clear auth tokens from cookies
 */
export function clearAuthTokens() {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
}

/**
 * Check if user has auth tokens
 */
export function hasAuthTokens(): boolean {
  return !!Cookies.get("accessToken");
}
