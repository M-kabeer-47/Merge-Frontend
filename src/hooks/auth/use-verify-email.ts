import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function VerifyPage({ token }: { token: string }) {
  const router = useRouter();

  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: async () => {
      const response = await api.get(`/auth/verify?token=${token}`);
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
