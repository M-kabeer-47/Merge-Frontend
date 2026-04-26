"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import { toast } from "sonner";
import { toastApiError } from "@/utils/toast-helpers";

export default function useCancelSubscription() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => api.delete("/subscriptions/my"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription", "my"] });
      toast.success("Subscription will cancel at the end of the billing period.");
    },
    onError: (error) => {
      toastApiError(error, "Failed to cancel subscription");
    },
  });
  return { cancel: mutate, isCancelling: isPending };
}
