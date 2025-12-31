import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import apiRequest from "@/utils/api-request";
import { toast } from "sonner";
import { ApiError } from "@/types/api-error";
import { useRouter } from "next/navigation";
export default function useRotateToken() {
  const router = useRouter();
  const rotateTokenFunction = async () => {
    let oldToken =
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken") || ""
        : "";
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
        console.log("Session expired From Client");
        toast.error("Session expired. Please login again.");
        // Clear tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userID");
        // Redirect to login
        setTimeout(() => {
          router.push("/sign-in");
        }, 1000);
      }
    },
  });

  return {
    isRotationPending,
    isRotationError,
    isRotationSuccess,
    rotateToken,
  };
}
