import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";

export default function useLogout() {
  const queryClient = useQueryClient();

  const logoutFunction = async () => {
    const response = await api.post("/auth/logout", {});
    return response.data;
  };

  const {
    isPending,
    isError,
    isSuccess,
    mutateAsync: logout,
  } = useMutation({
    mutationFn: logoutFunction,
    onError: async () => {
      // Even if logout fails, clear local data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Redirect to login anyway
      window.location.href = "/sign-in";
    },
    onSuccess: () => {
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
