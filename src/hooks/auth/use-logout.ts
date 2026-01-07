import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { clearAuthTokens } from "@/utils/auth-tokens";

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
      // Even if logout fails, clear local cookies and cache
      clearAuthTokens();
      queryClient.clear();

      // Redirect to login anyway
      router.push("/sign-in");
    },
    onSuccess: () => {
      clearAuthTokens();
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
