import axios from "axios";
import { toast } from "sonner";

const isClient = typeof window !== "undefined";

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  userId: string;
}

/**
 * Plain async function to refresh the access token.
 * NOT a React hook - can be used in axios interceptors.
 */
export async function refreshToken(): Promise<string | null> {
  if (!isClient) return null;

  const oldRefreshToken = localStorage.getItem("refreshToken");
  if (!oldRefreshToken) {
    return null;
  }

  try {
    const response = await axios.post<RefreshTokenResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${oldRefreshToken}`,
        },
      }
    );

    const { token, refreshToken: newRefreshToken, userId } = response.data;

    // Store new tokens
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("userID", userId);

    return token;
  } catch (error: any) {
    // Clear tokens on refresh failure
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userID");

    toast.error("Session expired. Please sign in again.");

    // Redirect to sign-in (can't use useRouter outside React)
    setTimeout(() => {
      window.location.href = "/sign-in";
    }, 500);

    return null;
  }
}
