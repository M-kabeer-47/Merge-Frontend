import apiRequest from "@/utils/api-request";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export default function logout() {
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
    onError: (error: any) => {
      toast.error("Failed to logout. Please try again.");
    },
    onSuccess: (data) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userID");
      toast.success("Logged out successfully");
    },
  });

  return {
    logout,
    isPending,
    isError,
    isSuccess,
  };
}
