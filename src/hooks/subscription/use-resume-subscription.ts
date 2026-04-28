"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import { toast } from "sonner";
import { toastApiError } from "@/utils/toast-helpers";

export default function useResumeSubscription() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post("/subscriptions/my/resume"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success("Subscription resumed — your plan will renew as usual.");
    },
    onError: (error) => {
      toastApiError(error, "Failed to resume subscription");
    },
  });
  return { resume: mutate, isResuming: isPending };
}
