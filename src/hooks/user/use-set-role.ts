import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";

export default function useSetRole() {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (role: "student" | "instructor") => {
      const response = await api.patch("/user/role", { role });
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user"], updatedUser);
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to set role. Please try again.");
    },
  });

  return { setRole: mutateAsync, isSettingRole: isPending };
}
