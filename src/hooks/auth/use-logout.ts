import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

export default function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

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
      queryClient.clear();

      // Redirect to login anyway
      router.push("/sign-in");
    },
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      queryClient.clear();
      toast.success("Logged out successfully");
      setTimeout(() => {
        router.push("/sign-in");
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
