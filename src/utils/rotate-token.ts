import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import apiRequest from "@/utils/api-request";
export default function rotateToken({ oldToken }: { oldToken: string }) {
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
  });

  return {
    isRotationPending,
    isRotationError,
    isRotationSuccess,
    rotateToken,
  };
}
