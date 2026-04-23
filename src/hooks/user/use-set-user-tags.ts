import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";

export default function useSetUserTags() {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (tagNames: string[]) => {
      const response = await api.patch("/user/tags", { tagNames });
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user"], updatedUser);
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to save tags. Please try again.");
    },
  });

  return { setUserTags: mutateAsync, isSettingTags: isPending };
}
