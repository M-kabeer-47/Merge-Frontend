import apiRequest from "@/utils/api-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export default function useLogout() {
  const queryClient = useQueryClient();

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
      // Even if logout fails, clear local data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      
      // Redirect to login anyway
      window.location.href = "/sign-in";
    },
    onSuccess: (data) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      queryClient.invalidateQueries({ queryKey: ["user"] });
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
