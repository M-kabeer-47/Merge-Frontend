import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import apiRequest from "@/utils/api-request";
import { toast } from "sonner";
import { ApiError } from "@/types/api-error";

export default function useRotateToken({ oldToken }: { oldToken: string }) {
  const rotateTokenFunction = async () => {
    let response = await apiRequest(
      axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${oldToken}`,
          },
        }
      )
    );
    return response.data;
  };

  const {
    isPending: isRotationPending,
    isError: isRotationError,
    isSuccess: isRotationSuccess,
    mutateAsync: rotateToken,
  } = useMutation({
    mutationFn: rotateTokenFunction,

    onSuccess: (data) => {
      if (data?.token && data?.refreshToken && data?.userId) {
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("userID", data.userId);
      }
    },
    onError: (error: ApiError) => {
      if (error?.response?.data.statusCode === 401) {
        toast.error("Session expired. Please login again.");
        // Clear tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userID");
        // Redirect to login
        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 1000);
      }
      toast.error("Please try again later...");
    },
  });

  return {
    isRotationPending,
    isRotationError,
    isRotationSuccess,
    rotateToken,
  };
}
