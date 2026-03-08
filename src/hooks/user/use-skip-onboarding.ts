import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";

export default function useSkipOnboarding() {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async () => {
      const response = await api.patch("/user/skip-onboarding");
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user"], updatedUser);
    },
    onError: (error: any) => {
      toastApiError(error, "Something went wrong. Please try again.");
    },
  });

  return { skipOnboarding: mutateAsync, isSkipping: isPending };
}
