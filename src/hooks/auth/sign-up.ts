import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { UserType } from "@/schemas/user/user";
import apiRequest from "@/utils/api-request";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function signUp() {
  const router = useRouter();
  async function signUpUser(user: UserType) {
    return apiRequest(
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-up`, user)
    );
  }
  const { mutateAsync, isError, isPending } = useMutation({
    mutationFn: signUpUser,
    onError: (error) => {
      toast.error("Sign up failed. Please try again.");
    },
    onSuccess: (data) => {
      toast.success(
        "Sign up successful! Please check your email to verify your account."
      );
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
    },
  });
  return { signUpUser: mutateAsync, isError, isPending };
}
