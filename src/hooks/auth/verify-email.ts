import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import apiRequest from "@/utils/api-request";

import axios from "axios";
export default function VerifyPage({ token }: { token: string }) {
  const router = useRouter();
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: async () => {
      const response = await apiRequest<VerifyResponse>(
        axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify?token=${token}`
        )
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Store tokens in localStorage if provided
      if (data.token) {
        localStorage.setItem("accessToken", data.token);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      // Redirect to success page with type parameter
      setTimeout(() => {
        router.push("/success?type=email_verified");
      }, 500);
    },
    onError: (err) => {
      console.error("Verification failed:", err);
    },
  });
  return { verifyEmail: mutateAsync, isPending, isError };
}
