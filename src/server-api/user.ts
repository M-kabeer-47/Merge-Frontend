import axios from "axios";
import { cookies } from "next/headers";
import { User } from "@/types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();

    // Get all cookies and build cookie string properly
    const allCookies = cookieStore.getAll();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    console.log(
      "[getUser] All cookies:",
      allCookies.map((c) => c.name)
    );
    console.log("[getUser] Access token exists:", !!accessToken);
    console.log("[getUser] Refresh token exists:", !!refreshToken);

    if (!accessToken) {
      console.log("[getUser] No access token found");
      return null;
    }

    // Build proper cookie string
    const cookieString = allCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    console.log("[getUser] Cookie string:", cookieString);

    try {
      const response = await axios.get<User>(`${API_BASE_URL}/user/profile`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      // Handle 401 - token expired
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401 &&
        refreshToken
      ) {
        console.log("[getUser] Token expired, attempting refresh");

        try {
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            {
              headers: {
                Cookie: `refreshToken=${refreshToken}`,
              },
            }
          );

          console.log("[getUser] Refresh successful");

          const setCookieHeader = refreshResponse.headers["set-cookie"];
          if (setCookieHeader) {
            const accessTokenCookie = Array.isArray(setCookieHeader)
              ? setCookieHeader.find((cookie) =>
                  cookie.startsWith("accessToken=")
                )
              : setCookieHeader.startsWith("accessToken=")
              ? setCookieHeader
              : null;

            if (accessTokenCookie) {
              const newAccessToken = accessTokenCookie
                .split(";")[0]
                .split("=")[1];

              // Rebuild cookie string with new access token
              const updatedCookieString = allCookies
                .filter((cookie) => cookie.name !== "accessToken")
                .map((cookie) => `${cookie.name}=${cookie.value}`)
                .concat(`accessToken=${newAccessToken}`)
                .join("; ");

              const retryResponse = await axios.get<User>(
                `${API_BASE_URL}/user/profile`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Cookie: updatedCookieString,
                  },
                }
              );

              return retryResponse.data;
            }
          }
        } catch (refreshError) {
          console.error("[getUser] Token refresh failed:", refreshError);
          return null;
        }
      }

      console.error("[getUser] Error fetching user:", error);
      return null;
    }
  } catch (error) {
    console.error("[getUser] Unexpected error:", error);
    return null;
  }
}
