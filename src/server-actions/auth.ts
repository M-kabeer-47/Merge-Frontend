"use server";

import { cookies } from "next/headers";

const COOKIE_OPTIONS = {
  httpOnly: false, // Allow client-side access
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

/**
 * Server Action to set auth cookies
 * Can be called from Server Components, Server Actions, or Client Components
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();

    // Set access token (shorter expiry)
    cookieStore.set("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60, // 1 hour
    });

    // Set refresh token (longer expiry)
    cookieStore.set("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to set auth cookies:", error);
    return { success: false };
  }
}

/**
 * Server Action to clear auth cookies (for logout)
 */
export async function clearAuthCookies(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return { success: true };
  } catch (error) {
    console.error("Failed to clear auth cookies:", error);
    return { success: false };
  }
}
