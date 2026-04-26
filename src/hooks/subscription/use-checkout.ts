"use client";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/api";
import { toast } from "sonner";
import { toastApiError } from "@/utils/toast-helpers";
import { CheckoutResponse } from "@/types/subscription";

export default function useCheckout() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (planId: string) => {
      const response = await api.post<CheckoutResponse>("/subscriptions/checkout", { planId });
      return response.data;
    },
    onSuccess: (data) => {
      window.location.href = data.checkoutUrl;
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message;
      if (msg) {
        toast.error(msg, { duration: 8000 });
      } else {
        toastApiError(error, "Failed to start checkout");
      }
    },
  });
  return { checkout: mutate, isLoading: isPending };
}
