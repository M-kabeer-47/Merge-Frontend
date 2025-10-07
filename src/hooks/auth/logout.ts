import apiRequest from "@/utils/api-request";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import useRotateToken from "@/utils/rotate-token";
export default function logout() {
  const { isRotationSuccess, rotateToken } = useRotateToken({
    oldToken:
      (typeof window !== "undefined" && localStorage.getItem("refreshToken")) ||
      "",
  });
  const logoutFunction = async () => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("Access Token:", accessToken);
    return await apiRequest(
      axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,
        {}, // Empty body (no data to send)
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
    );
  };

  const {
    isPending,
    isError,
    isSuccess,
    mutateAsync: logout,
  } = useMutation({
    mutationFn: logoutFunction,
    onError: async (error: any) => {
      if (error?.response?.data?.statusCode === 401) {
        await rotateToken();
        if (isRotationSuccess) {
          await logout();
        }
        return;
      }
      toast.error("Failed to logout. Please try again.");
    },
    onSuccess: (data) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      toast.success("Logged out successfully");
      setTimeout(() => {
        window.location.href = "/sign-in"; // Redirect to sign-in page after logout
      }, 1000);
    },
  });

  return {
    logout,
    isPending,
    isError,
    isSuccess,
  };
}
